import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Server, User } from 'lucide-react';

const initialNodes = [
  {
    id: 'user',
    type: 'custom',
    position: { x: 50, y: 150 },
    data: { label: 'User Actions', icon: <User className="w-6 h-6" />, color: 'bg-blue-500' },
  },
  {
    id: 'kafka',
    type: 'custom',
    position: { x: 300, y: 150 },
    data: { label: 'Kafka Topic', icon: <Activity className="w-6 h-6" />, color: 'bg-green-500' },
  },
  {
    id: 'consumer',
    type: 'custom',
    position: { x: 550, y: 150 },
    data: { label: 'Spring Boot Consumer', icon: <Server className="w-6 h-6" />, color: 'bg-purple-500' },
  },
  {
    id: 'db',
    type: 'custom',
    position: { x: 800, y: 150 },
    data: { label: 'PostgreSQL', icon: <Database className="w-6 h-6" />, color: 'bg-indigo-500' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'user', target: 'kafka', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e2-3', source: 'kafka', target: 'consumer', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e3-4', source: 'consumer', target: 'db', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
];

const CustomNode = ({ data }: any) => {
  return (
    <div className={`px-4 py-3 shadow-lg rounded-md bg-gray-800 border-2 border-gray-700 flex items-center space-x-3`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-500" />
      <div className={`p-2 rounded-full text-white ${data.color}`}>
        {data.icon}
      </div>
      <div className="text-white font-medium">{data.label}</div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-500" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export const DispatchVisualizer = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [eventsProcessed, setEventsProcessed] = useState(0);
  const [activePackets, setActivePackets] = useState<{ id: string, stage: number }[]>([]);
  const packetIdCounter = useRef(0);

  const triggerEvent = useCallback(() => {
    const id = `packet-${packetIdCounter.current++}`;
    setActivePackets(prev => [...prev, { id, stage: 0 }]);
    
    // Simulate progression
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
    // Attach listener to window scroll to generate events (debounced somewhat implicitly by requestAnimationFrame in real scenario, here we just throttle)
    let lastEventTime = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastEventTime > 800) { // Throttle to prevent spam
        triggerEvent();
        lastEventTime = now;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerEvent]);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Real-Time Event Dispatcher</h2>
          <p className="text-gray-400">Scroll the page to simulate user events flowing through a Kafka pipeline.</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center min-w-[150px]">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Events Processed</p>
          <p className="text-3xl font-bold text-indigo-400">
            {eventsProcessed.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="h-[400px] w-full bg-gray-950 rounded-lg border border-gray-800 relative overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-950"
        >
          <Background color="#333" gap={16} />
        </ReactFlow>

        {/* Overlay animated packets */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          <AnimatePresence>
            {activePackets.map(packet => {
              // Calculate rough positions based on initialNodes setup
              let x = 0;
              if (packet.stage === 0) x = 120 + (Math.random() * 100);
              else if (packet.stage === 1) x = 380 + (Math.random() * 100);
              else if (packet.stage === 2) x = 620 + (Math.random() * 100);

              return (
                <motion.div
                  key={packet.id}
                  initial={{ opacity: 0, x: 100, y: 200 }}
                  animate={{ opacity: 1, x, y: 200 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
