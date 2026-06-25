import { useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Lock, Unlock, Key, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const SwaggerResume = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchToken = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked.token");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch token", error);
      setLoading(false);
    }
  };

  const spec = {
    openapi: "3.0.1",
    info: {
      title: "Srividya's Interactive Resume API",
      description: "Explore professional experience, skills, and contact info via REST API. To access the /contact endpoint, generate an auth token.",
      version: "1.0.0"
    },
    servers: [
      { url: "https://api.srividya.tech" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    paths: {
      "/api/experiences": {
        get: {
          tags: ["Experience"],
          summary: "Get all professional experience",
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { example: [
                { id: 1, company: "Uber", role: "Software Developer", duration: "Aug 2023 - Present", highlights: ["400K+ daily events", "100K+ daily requests"] },
                { id: 2, company: "Infosys", role: "Software Developer", duration: "Jun 2021 - Jun 2023", highlights: ["150K+ daily transactions", "Apache Kafka pipelines"] }
              ]}}
            }
          }
        }
      },
      "/api/skills": {
        get: {
          tags: ["Skills"],
          summary: "Get technical skills",
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { example: [
                { category: "Backend & APIs", items: ["Java", "Spring Boot", "RESTful APIs", "GraphQL"] },
                { category: "Databases & Messaging", items: ["PostgreSQL", "Apache Kafka", "Redis"] }
              ]}}
            }
          }
        }
      },
      "/api/contact": {
        get: {
          tags: ["Contact"],
          summary: "Get contact information (Secured)",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { example: { email: "srividya1369@gmail.com", phone: "+1 (408) 475-3810", location: "California, USA", linkedin: "linkedin.com/in/srividya" } } }
            },
            "401": {
              description: "Unauthorized - Bearer token required"
            }
          }
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto my-16 relative group"
    >
      {/* Ambient background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative p-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-8 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Terminal className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text tracking-tight mb-2">
                Interactive API Resume
              </h2>
              <p className="text-slate-400 font-medium">Execute GET requests to fetch my professional metrics directly from the backend.</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col items-end w-full md:w-auto">
            <div className="flex items-center space-x-3 bg-slate-950/50 p-3 rounded-xl border border-white/5 w-full md:w-auto shadow-inner">
              <motion.div
                animate={token ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {token ? (
                  <Unlock className="text-emerald-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                ) : (
                  <Lock className="text-fuchsia-400 w-6 h-6" />
                )}
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-slate-200 tracking-wide">
                  {token ? "Authentication Active" : "Authentication Required"}
                </p>
                <p className="text-xs text-slate-400">
                  {token ? "Contact endpoint unlocked" : "Generate token to unlock /contact"}
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={!token && !loading ? { scale: 1.05 } : {}}
              whileTap={!token && !loading ? { scale: 0.95 } : {}}
              onClick={fetchToken}
              disabled={token !== null || loading}
              className={`mt-4 flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all w-full md:w-auto
                ${token 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                  : 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/10 cursor-pointer'}`}
            >
              <Key className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
              <span>{loading ? "Generating JWT..." : token ? "JWT Token Generated" : "Generate Access Token"}</span>
            </motion.button>
          </div>
        </div>
        
        {/* Swagger UI Terminal Window Wrapper */}
        <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-700 shadow-2xl relative">
          {/* macOS window header */}
          <div className="bg-slate-200 px-4 py-2 flex items-center space-x-2 border-b border-slate-300">
            <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
            <span className="ml-4 text-xs text-slate-500 font-medium tracking-wider">api-docs.json</span>
          </div>
          <div className="p-2 sm:p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            <SwaggerUI spec={spec} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
