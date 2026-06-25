import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Server, User, Zap } from 'lucide-react';

const initialNodes = [
  {
    id: 'user',
    type: 'custom',
    position: { x: 50, y: 150 },
    data: { label: 'User Actions', icon: <User className="w-6 h-6" />, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]', glow: 'cyan' },
  },
  {
    id: 'kafka',
    type: 'custom',
    position: { x: 300, y: 150 },
    data: { label: 'Kafka Topic', icon: <Activity className="w-6 h-6" />, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]', glow: 'indigo' },
  },
  {
    id: 'consumer',
    type: 'custom',
    position: { x: 550, y: 150 },
    data: { label: 'Event Consumer', icon: <Server className="w-6 h-6" />, color: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]', glow: 'fuchsia' },
  },
  {
    id: 'db',
    type: 'custom',
    position: { x: 800, y: 150 },
    data: { label: 'PostgreSQL', icon: <Database className="w-6 h-6" />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]', glow: 'emerald' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'user', target: 'kafka', animated: true, style: { stroke: 'rgba(6,182,212,0.6)', strokeWidth: 3 } },
  { id: 'e2-3', source: 'kafka', target: 'consumer', animated: true, style: { stroke: 'rgba(99,102,241,0.6)', strokeWidth: 3 } },
  { id: 'e3-4', source: 'consumer', target: 'db', animated: true, style: { stroke: 'rgba(217,70,239,0.6)', strokeWidth: 3 } },
];

const CustomNode = ({ data }: { data: { label: string, icon: React.ReactNode, color: string } }) => {
  return (
    <div className={`px-5 py-3 rounded-full bg-slate-900/80 backdrop-blur-md border-2 flex items-center space-x-3 transition-transform hover:scale-105 cursor-pointer ${data.color}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-800 !border-slate-500" />
      <div className={`p-2 rounded-full bg-slate-950/50 shadow-inner`}>
        {data.icon}
      </div>
      <div className="font-bold tracking-wide">{data.label}</div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-800 !border-slate-500" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export const DispatchVisualizer = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [eventsProcessed, setEventsProcessed] = useState(0);
  const [activePackets, setActivePackets] = useState<{ id: string, stage: number, xOffsets: number[] }[]>([]);
  const packetIdCounter = useRef(0);

  const triggerEvent = useCallback(() => {
    const id = `packet-${packetIdCounter.current++}`;
    const xOffsets = [Math.random() * 80, Math.random() * 80, Math.random() * 80];
    setActivePackets(prev => [...prev, { id, stage: 0, xOffsets }]);
    
    setTimeout(() => {
      setActivePackets(prev => prev.map(p => p.id === id ? { ...p, stage: 1 } : p));
    }, 600);
    
    setTimeout(() => {
      setActivePackets(prev => prev.map(p => p.id === id ? { ...p, stage: 2 } : p));
    }, 1200);

    setTimeout(() => {
      setActivePackets(prev => prev.filter(p => p.id !== id));
      setEventsProcessed(prev => prev + 1);
    }, 1800);
  }, []);

  useEffect(() => {
    let lastEventTime = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastEventTime > 600) { 
        triggerEvent();
        lastEventTime = now;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerEvent]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto my-16 relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative p-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 text-transparent bg-clip-text tracking-tight mb-2">
                Real-Time Event Dispatcher
              </h2>
              <p className="text-slate-400 font-medium">Scroll the page to simulate user events flowing through a high-volume Kafka pipeline.</p>
            </div>
          </div>

          <div className="mt-6 md:mt-0 bg-slate-950/60 p-5 rounded-2xl border border-white/5 shadow-inner text-center min-w-[180px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Events Processed</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tighter tabular-nums font-mono">
              {eventsProcessed.toLocaleString().padStart(5, '0')}
            </p>
          </div>
        </div>

        <div className="h-[400px] w-full bg-[#0a0a0f] rounded-xl border border-white/10 relative overflow-hidden shadow-inner">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            className="z-10"
          >
            <Background color="transparent" />
          </ReactFlow>

          {/* Comet Trails Overlay */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
            <AnimatePresence>
              {activePackets.map(packet => {
                let x = 0;
                let colors = "";
                if (packet.stage === 0) {
                  x = 120 + packet.xOffsets[0];
                  colors = "from-cyan-400 to-transparent";
                } else if (packet.stage === 1) {
                  x = 380 + packet.xOffsets[1];
                  colors = "from-indigo-400 to-transparent";
                } else if (packet.stage === 2) {
                  x = 620 + packet.xOffsets[2];
                  colors = "from-fuchsia-400 to-transparent";
                }

                return (
                  <motion.div
                    key={packet.id}
                    initial={{ opacity: 0, x: x - 50, y: 200, scaleX: 0 }}
                    animate={{ opacity: 1, x: x, y: 200, scaleX: 1 }}
                    exit={{ opacity: 0, x: x + 50, scaleX: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`absolute w-16 h-1 rounded-full bg-gradient-to-r ${colors} shadow-[0_0_15px_rgba(255,255,255,0.8)] blur-[1px]`}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
