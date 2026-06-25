import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Cpu, Database, Globe, Play, Server, FileJson } from 'lucide-react';

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
    setActiveStep(0); // Client sending

    setTimeout(() => setActiveStep(1), 800); // API GW
    setTimeout(() => setActiveStep(2), 1800); // Lambda
    setTimeout(() => setActiveStep(3), 2800); // Fork to OpenAI & S3
    setTimeout(() => {
      setActiveStep(4); // Back to client
      setResponse({
        status: "success",
        validationScore: 0.98,
        sentiment: "positive",
        entitiesExtracted: ["AWS", "AI"],
        storageId: "s3-doc-7781a"
      });
      setIsSimulating(false);
    }, 4000);
  };

  const steps = [
    { id: 0, title: "Client Request", desc: "Sending JSON payload" },
    { id: 1, title: "API Gateway", desc: "Validating JWT & rate limits" },
    { id: 2, title: "AWS Lambda", desc: "Executing Python data prep" },
    { id: 3, title: "OpenAI & S3", desc: "LLM processing & raw storage" },
    { id: 4, title: "Response", desc: "Returning enriched data to client" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
      <div className="mb-8 border-b border-gray-800 pb-6">
        <h2 className="text-3xl font-bold text-white mb-2">AWS / AI Architecture Sandbox</h2>
        <p className="text-gray-400">Simulate a high-volume AI validation request through serverless cloud infrastructure.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Diagram */}
        <div className="flex-1 bg-gray-950 p-6 rounded-lg border border-gray-800 relative min-h-[400px] flex items-center justify-center">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {/* Base lines */}
            <path d="M 100 200 L 250 200" stroke="#374151" strokeWidth="2" fill="none" />
            <path d="M 350 200 L 500 200" stroke="#374151" strokeWidth="2" fill="none" />
            <path d="M 600 200 L 750 120" stroke="#374151" strokeWidth="2" fill="none" />
            <path d="M 600 200 L 750 280" stroke="#374151" strokeWidth="2" fill="none" />
            
            {/* Animated lines based on activeStep */}
            {activeStep >= 0 && (
              <motion.path 
                d="M 100 200 L 250 200" stroke="#3b82f6" strokeWidth="3" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: activeStep >= 1 ? 1 : 0 }} transition={{ duration: 0.5 }}
              />
            )}
            {activeStep >= 1 && (
              <motion.path 
                d="M 350 200 L 500 200" stroke="#10b981" strokeWidth="3" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: activeStep >= 2 ? 1 : 0 }} transition={{ duration: 0.5 }}
              />
            )}
            {activeStep >= 2 && (
              <>
                <motion.path 
                  d="M 600 200 L 750 120" stroke="#8b5cf6" strokeWidth="3" fill="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: activeStep >= 3 ? 1 : 0 }} transition={{ duration: 0.5 }}
                />
                <motion.path 
                  d="M 600 200 L 750 280" stroke="#f59e0b" strokeWidth="3" fill="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: activeStep >= 3 ? 1 : 0 }} transition={{ duration: 0.5 }}
                />
              </>
            )}
          </svg>

          {/* Nodes */}
          <div className="absolute inset-0 flex items-center justify-between px-10 z-10 pointer-events-none">
            {/* Client */}
            <div className={`flex flex-col items-center transition-all ${activeStep === 0 || activeStep === 4 ? 'scale-110' : 'scale-100 opacity-70'}`}>
              <div className={`p-4 rounded-full ${activeStep === 0 || activeStep === 4 ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]' : 'bg-gray-800 border-2 border-blue-900'}`}>
                <Globe className="w-8 h-8 text-white" />
              </div>
              <span className="text-white mt-2 font-medium">Client</span>
            </div>

            {/* API GW */}
            <div className={`flex flex-col items-center transition-all ${activeStep === 1 ? 'scale-110' : 'scale-100 opacity-70'}`}>
              <div className={`p-4 rounded-full ${activeStep === 1 ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-gray-800 border-2 border-emerald-900'}`}>
                <Server className="w-8 h-8 text-white" />
              </div>
              <span className="text-white mt-2 font-medium text-center">API<br/>Gateway</span>
            </div>

            {/* Lambda */}
            <div className={`flex flex-col items-center transition-all ${activeStep === 2 ? 'scale-110' : 'scale-100 opacity-70'}`}>
              <div className={`p-4 rounded-full ${activeStep === 2 ? 'bg-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.8)]' : 'bg-gray-800 border-2 border-purple-900'}`}>
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <span className="text-white mt-2 font-medium text-center">AWS<br/>Lambda</span>
            </div>

            {/* Endpoints */}
            <div className="flex flex-col h-[250px] justify-between">
              <div className={`flex flex-col items-center transition-all ${activeStep === 3 ? 'scale-110' : 'scale-100 opacity-70'}`}>
                <div className={`p-4 rounded-full ${activeStep === 3 ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)]' : 'bg-gray-800 border-2 border-indigo-900'}`}>
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <span className="text-white mt-2 font-medium text-center">OpenAI<br/>API</span>
              </div>

              <div className={`flex flex-col items-center transition-all ${activeStep === 3 ? 'scale-110' : 'scale-100 opacity-70'}`}>
                <div className={`p-4 rounded-full ${activeStep === 3 ? 'bg-yellow-600 shadow-[0_0_15px_rgba(202,138,4,0.8)]' : 'bg-gray-800 border-2 border-yellow-900'}`}>
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-white mt-2 font-medium text-center">AWS<br/>S3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Controls & Output */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><Play className="w-4 h-4 mr-2" /> Simulation Control</h3>
            <form onSubmit={startSimulation} className="flex flex-col gap-3">
              <label className="text-sm text-gray-400">Input Data Payload</label>
              <textarea 
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="Enter some text to validate (e.g., 'Extract entities from this user review...')"
                className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white text-sm focus:outline-none focus:border-indigo-500 min-h-[100px]"
                disabled={isSimulating}
              />
              <button 
                type="submit"
                disabled={isSimulating || !requestText.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors w-full"
              >
                {isSimulating ? 'Simulating Workflow...' : 'Execute Request'}
              </button>
            </form>
          </div>

          {/* Status Tracker */}
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 flex-1">
            <h3 className="text-lg font-semibold text-white mb-4">Execution Log</h3>
            <div className="space-y-3 relative">
               {/* Connecting line for timeline */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-700"></div>

              {steps.map((step) => (
                <div key={step.id} className={`flex items-start pl-8 relative transition-opacity duration-300 ${activeStep >= step.id ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 
                    ${activeStep === step.id ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 
                      activeStep > step.id ? 'bg-green-500 border-green-500' : 'bg-gray-800 border-gray-600'}`}
                  />
                  <div>
                    <h4 className={`text-sm font-bold ${activeStep === step.id ? 'text-indigo-400' : 'text-gray-300'}`}>{step.title}</h4>
                    <p className="text-xs text-gray-400">{step.desc}</p>
                    
                    {/* Simulated Code Snippet for Lambda Step */}
                    {step.id === 2 && activeStep >= 2 && (
                       <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mt-2 text-[10px] text-green-400 bg-gray-950 p-2 rounded border border-gray-800 font-mono">
                         {`def lambda_handler(event, context):
    payload = parse(event)
    result = openai.Completion.create(...)
    s3.put_object(Body=result)
    return format(result)`}
                       </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {response && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center"><FileJson className="w-4 h-4 mr-2"/> Result Payload</h4>
                <pre className="bg-gray-950 text-emerald-400 p-3 rounded text-xs overflow-x-auto border border-gray-800">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
