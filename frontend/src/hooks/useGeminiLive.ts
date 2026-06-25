import { useState, useRef, useCallback, useEffect } from 'react';
import { getLiveChatToken } from '../services/api';

export const useGeminiLive = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // PCM Base64 decoding
  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // 16-bit PCM to Float32
  const pcm16ToFloat32 = (pcm16Buffer: ArrayBuffer) => {
    const int16View = new Int16Array(pcm16Buffer);
    const float32 = new Float32Array(int16View.length);
    for (let i = 0; i < int16View.length; i++) {
      float32[i] = int16View[i] / 32768.0;
    }
    return float32;
  };

  // Float32 to 16-bit PCM Base64
  const float32ToPcm16Base64 = (float32Array: Float32Array) => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  };

  const playAudioChunk = (base64Data: string) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    setIsSpeaking(true);
    
    const arrayBuffer = base64ToArrayBuffer(base64Data);
    const float32Data = pcm16ToFloat32(arrayBuffer);
    
    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000); // Gemini returns 24kHz
    audioBuffer.getChannelData(0).set(float32Data);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    const startTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
    source.start(startTime);
    
    nextPlayTimeRef.current = startTime + audioBuffer.duration;
    
    source.onended = () => {
      if (ctx.currentTime >= nextPlayTimeRef.current - 0.1) {
        setIsSpeaking(false);
      }
    };
  };

  const disconnect = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
  }, []);


  const connect = useCallback(async () => {
    try {
      setError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Microphone API not supported. Must use HTTPS or localhost.");
      }

      // 1. Initialize AudioContext (must be 16kHz for mic input)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: 16000 });
      await ctx.resume();
      audioContextRef.current = ctx;
      nextPlayTimeRef.current = ctx.currentTime;

      // 2. Load Worklet
      await ctx.audioWorklet.addModule('/audio-processor.js');

      // 3. Connect Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: true,
        noiseSuppression: true,
      } });
      mediaStreamRef.current = stream;
      const source = ctx.createMediaStreamSource(stream);
      
      const workletNode = new AudioWorkletNode(ctx, 'pcm-processor');
      workletNodeRef.current = workletNode;
      source.connect(workletNode);
      workletNode.connect(ctx.destination); // Required for worklet to process, though we don't output mic audio

      // 4. Fetch Ephemeral Token
      const { token, systemInstruction } = await getLiveChatToken();

      // 5. Connect directly to Gemini using the constrained endpoint
      // Note: For ephemeral tokens, we must use BidiGenerateContentConstrained
      // and pass the token via the access_token query parameter.
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${token}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);

        // Send Setup Message
        ws.send(JSON.stringify({
          setup: {
            model: "models/gemini-2.5-flash-native-audio-latest",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede"
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          }
        }));
        
        // Force an initial greeting so the user knows it's working immediately
        const initialMessage = {
          clientContent: {
            turns: [{
              role: "user",
              parts: [{ text: "Hello! Please briefly introduce yourself in one sentence so I know your audio is working." }]
            }],
            turnComplete: true
          }
        };
        ws.send(JSON.stringify(initialMessage));

        // Start sending mic data
        workletNode.port.onmessage = (event) => {
          if (ws.readyState === WebSocket.OPEN) {
            const float32Array = event.data as Float32Array;
            const base64Pcm = float32ToPcm16Base64(float32Array);
            
            ws.send(JSON.stringify({
              realtimeInput: {
                mediaChunks: [{
                  mimeType: "audio/pcm;rate=16000",
                  data: base64Pcm
                }]
              }
            }));
          }
        };
      };

      const handleWebSocketMessage = async (event: MessageEvent) => {
        try {
          let messageText = event.data;
          if (event.data instanceof Blob) {
            messageText = await event.data.text();
          }
          
          const data = JSON.parse(messageText);
          
          if (data.serverContent && data.serverContent.modelTurn) {
            const parts = data.serverContent.modelTurn.parts;
            for (const part of parts) {
              if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                console.log("Received audio chunk from Gemini, playing...");
                playAudioChunk(part.inlineData.data);
              }
            }
          } else if (data.serverContent?.interrupted) {
             console.log("Gemini interrupted");
          } else if (data.serverContent) {
             console.log("Received other serverContent:", data.serverContent);
          } else if (data.error) {
             setError("Gemini API Error: " + JSON.stringify(data.error));
             disconnect();
          }
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      ws.onmessage = handleWebSocketMessage;

      ws.onclose = (e) => {
        setIsConnected(false);
        if (e.code !== 1000) {
            setError(`WebSocket Closed: ${e.reason || 'Server dropped connection'}`);
        }
        disconnect();
      };
      
      ws.onerror = () => {
        setError("WebSocket Connection Error.");
      };

    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error("Error connecting to Gemini Live:", errorObj);
      setError(errorObj.message || "Failed to connect.");
      disconnect();
    }
  }, [disconnect]);



  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, isConnected, isSpeaking, error };
};
