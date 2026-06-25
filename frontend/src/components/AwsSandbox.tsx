import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Cpu, Database, Globe, Play, Server, FileJson, Terminal as TerminalIcon } from 'lucide-react';

export const AwsSandbox = () => {
  const [requestText, setRequestText] = useState("");
  const [activeStep, setActiveStep] = useState(-1); // -1: idle, 0: client, 1: apigw, 2: lambda, 3: openai/s3, 4: done
  const [isSimulating, setIsSimulating] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const startSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim() || isSimulating) return;

    setIsSimulating(true);
    setResponse(null);
    setActiveStep(0); 

    setTimeout(() => setActiveStep(1), 1000); 
    setTimeout(() => setActiveStep(2), 2200); 
    setTimeout(() => setActiveStep(3), 3400); 
    setTimeout(() => {
      setActiveStep(4); 
      setResponse({
        status: "success",
        validationScore: 0.98,
        sentiment: "positive",
        entitiesExtracted: ["AWS", "AI", "Serverless"],
        storageId: "s3-doc-7781a",
        latency: "142ms"
      });
      setIsSimulating(false);
    }, 4800);
  };

  const steps = [
    { id: 0, title: "Client Request", desc: "Sending JSON payload" },
    { id: 1, title: "API Gateway", desc: "Validating JWT & rate limits" },
    { id: 2, title: "AWS Lambda", desc: "Executing Python data prep" },
    { id: 3, title: "OpenAI & S3", desc: "LLM processing & raw storage" },
    { id: 4, title: "Response", desc: "Returning enriched data to client" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-5xl mx-auto my-16 relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative p-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        
        <div className="flex items-start space-x-4 mb-8 border-b border-white/10 pb-6">
          <div className="p-3 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20">
            <Cloud className="w-8 h-8 text-fuchsia-400" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400 text-transparent bg-clip-text tracking-tight mb-2">
              AWS / AI Architecture Sandbox
            </h2>
            <p className="text-slate-400 font-medium">Simulate a high-volume AI validation request through serverless cloud infrastructure.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Diagram */}
          <div className="flex-1 bg-[#0a0a0f] p-6 rounded-xl border border-white/10 relative min-h-[450px] flex items-center justify-center shadow-inner overflow-hidden">
            
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {/* Base lines */}
              <path d="M 100 225 L 230 225" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 330 225 L 460 225" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 560 225 L 720 140" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 560 225 L 720 310" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              
              {/* Animated lines based on activeStep */}
              {activeStep >= 0 && (
                <motion.path 
                  d="M 100 225 L 230 225" stroke="#0ea5e9" strokeWidth="3" fill="none"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.8))' }}
                  initial={{ pathLength: 0 }} animate={{ pathLength: activeStep >= 1 ? 1 : 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              )}
              {activeStep >= 1 && (
                <motion.path 
                  d="M 330 225 L 460 225" stroke="#10b981" strokeWidth="3" fill="none"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.8))' }}
                  initial={{ pathLength: 0 }} animate={{ pathLength: activeStep >= 2 ? 1 : 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              )}
              {activeStep >= 2 && (
                <>
                  <motion.path 
                    d="M 560 225 L 720 140" stroke="#8b5cf6" strokeWidth="3" fill="none"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.8))' }}
                    initial={{ pathLength: 0 }} animate={{ pathLength: activeStep >= 3 ? 1 : 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M 560 225 L 720 310" stroke="#f59e0b" strokeWidth="3" fill="none"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.8))' }}
                    initial={{ pathLength: 0 }} animate={{ pathLength: activeStep >= 3 ? 1 : 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </>
              )}
            </svg>

            {/* Nodes */}
            <div className="absolute inset-0 flex items-center justify-between px-6 z-10 pointer-events-none">
              {/* Client */}
              <div className="flex flex-col items-center">
                <motion.div 
                  animate={{ scale: activeStep === 0 || activeStep === 4 ? 1.15 : 1, opacity: activeStep === 0 || activeStep === 4 ? 1 : 0.6 }}
                  className={`p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl ${activeStep === 0 || activeStep === 4 ? 'bg-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.5)] border-sky-400' : 'bg-slate-800/50'}`}
                >
                  <Globe className={`w-8 h-8 ${activeStep === 0 || activeStep === 4 ? 'text-sky-400' : 'text-slate-400'}`} />
                </motion.div>
                <span className="text-white mt-3 font-semibold text-sm tracking-wide">Client</span>
              </div>

              {/* API GW */}
              <div className="flex flex-col items-center">
                <motion.div 
                  animate={{ scale: activeStep === 1 ? 1.15 : 1, opacity: activeStep === 1 ? 1 : 0.6 }}
                  className={`p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl ${activeStep === 1 ? 'bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-emerald-400' : 'bg-slate-800/50'}`}
                >
                  <Server className={`w-8 h-8 ${activeStep === 1 ? 'text-emerald-400' : 'text-slate-400'}`} />
                </motion.div>
                <span className="text-white mt-3 font-semibold text-sm text-center tracking-wide">API<br/>Gateway</span>
              </div>

              {/* Lambda */}
              <div className="flex flex-col items-center">
                <motion.div 
                  animate={{ scale: activeStep === 2 ? 1.15 : 1, opacity: activeStep === 2 ? 1 : 0.6 }}
                  className={`p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl ${activeStep === 2 ? 'bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.5)] border-purple-400' : 'bg-slate-800/50'}`}
                >
                  <Cpu className={`w-8 h-8 ${activeStep === 2 ? 'text-purple-400' : 'text-slate-400'}`} />
                </motion.div>
                <span className="text-white mt-3 font-semibold text-sm text-center tracking-wide">AWS<br/>Lambda</span>
              </div>

              {/* Endpoints */}
              <div className="flex flex-col h-[280px] justify-between">
                <div className="flex flex-col items-center">
                  <motion.div 
                    animate={{ scale: activeStep === 3 ? 1.15 : 1, opacity: activeStep === 3 ? 1 : 0.6 }}
                    className={`p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl ${activeStep === 3 ? 'bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.5)] border-indigo-400' : 'bg-slate-800/50'}`}
                  >
                    <Cloud className={`w-8 h-8 ${activeStep === 3 ? 'text-indigo-400' : 'text-slate-400'}`} />
                  </motion.div>
                  <span className="text-white mt-3 font-semibold text-sm text-center tracking-wide">OpenAI<br/>API</span>
                </div>

                <div className="flex flex-col items-center">
                  <motion.div 
                    animate={{ scale: activeStep === 3 ? 1.15 : 1, opacity: activeStep === 3 ? 1 : 0.6 }}
                    className={`p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl ${activeStep === 3 ? 'bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.5)] border-amber-400' : 'bg-slate-800/50'}`}
                  >
                    <Database className={`w-8 h-8 ${activeStep === 3 ? 'text-amber-400' : 'text-slate-400'}`} />
                  </motion.div>
                  <span className="text-white mt-3 font-semibold text-sm text-center tracking-wide">AWS<br/>S3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Controls & Output */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-slate-900/80 p-6 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Play className="w-4 h-4 mr-2 text-indigo-400" /> Simulation Control
              </h3>
              <form onSubmit={startSimulation} className="flex flex-col gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Input Data Payload</label>
                  <textarea 
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Enter some text to validate (e.g., 'Extract entities from this user review...')"
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg p-3 text-emerald-400 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px] shadow-inner transition-colors"
                    disabled={isSimulating}
                  />
                </div>
                <motion.button 
                  whileHover={!isSimulating && requestText.trim() ? { scale: 1.02 } : {}}
                  whileTap={!isSimulating && requestText.trim() ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={isSimulating || !requestText.trim()}
                  className={`font-bold py-3 px-4 rounded-xl transition-all w-full flex items-center justify-center shadow-lg
                    ${isSimulating || !requestText.trim() 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                      : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white border border-white/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]'}`}
                >
                  {isSimulating ? 'Simulating Workflow...' : 'Execute Request'}
                </motion.button>
              </form>
            </div>

            {/* Status Tracker */}
            <div className="bg-slate-900/80 p-6 rounded-xl border border-white/10 flex-1 shadow-lg flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <TerminalIcon className="w-4 h-4 mr-2 text-fuchsia-400" /> Execution Log
              </h3>
              
              <div className="space-y-4 relative flex-1">
                <div className="absolute left-2.5 top-3 bottom-3 w-px bg-gradient-to-b from-indigo-500/50 to-transparent"></div>

                {steps.map((step) => (
                  <div key={step.id} className={`flex items-start pl-8 relative transition-all duration-500 ${activeStep >= step.id ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'}`}>
                    <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-[3px] z-10 transition-colors duration-500
                      ${activeStep === step.id ? 'bg-indigo-500 border-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 
                        activeStep > step.id ? 'bg-emerald-500 border-emerald-900' : 'bg-slate-900 border-slate-700'}`}
                    />
                    <div className="w-full">
                      <h4 className={`text-sm font-bold tracking-wide ${activeStep === step.id ? 'text-indigo-400' : 'text-slate-300'}`}>{step.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{step.desc}</p>
                      
                      {/* Simulated Code Snippet for Lambda Step */}
                      <AnimatePresence>
                        {step.id === 2 && activeStep >= 2 && (
                          <motion.div 
                            initial={{opacity:0, height:0, marginTop:0}} 
                            animate={{opacity:1, height:'auto', marginTop:8}} 
                            exit={{opacity:0, height:0, marginTop:0}}
                            className="text-[11px] text-emerald-400 bg-[#0a0a0f] p-3 rounded-lg border border-white/5 font-mono shadow-inner overflow-hidden"
                          >
                            <span className="text-fuchsia-400">def</span> <span className="text-sky-400">lambda_handler</span>(event, context):<br/>
                            &nbsp;&nbsp;payload = parse(event)<br/>
                            &nbsp;&nbsp;result = openai.Completion.create(...)<br/>
                            &nbsp;&nbsp;s3.put_object(Body=result)<br/>
                            &nbsp;&nbsp;<span className="text-fuchsia-400">return</span> format(result)
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
              
              <AnimatePresence>
                {response && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    className="mt-6 pt-4 border-t border-white/10"
                  >
                    <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center tracking-wide">
                      <FileJson className="w-4 h-4 mr-2 text-emerald-400"/> Result Payload
                    </h4>
                    <pre className="bg-[#0a0a0f] text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto border border-white/10 shadow-inner custom-scrollbar">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
