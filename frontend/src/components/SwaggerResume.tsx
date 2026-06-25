import React, { useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Lock, Unlock, Key } from 'lucide-react';

export const SwaggerResume = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchToken = async () => {
    setLoading(true);
    try {
      // Mocking for now to avoid requiring the backend to be running for visual demo
      setTimeout(() => {
        setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked.token");
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Failed to fetch token", error);
      setLoading(false);
    }
  };

  // The OpenAPI spec for the resume
  const spec = {
    openapi: "3.0.1",
    info: {
      title: "Srividya's Interactive Resume API",
      description: "Explore professional experience, skills, and contact info via REST API. To access the /contact endpoint, generate an auth token.",
      version: "1.0.0"
    },
    servers: [
      { url: "http://localhost:8080" }
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
                { category: "Backend & APIs", items: ["Java", "Spring Boot", "RESTful APIs"] },
                { category: "Databases & Messaging", items: ["PostgreSQL", "Apache Kafka"] }
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
              content: { "application/json": { example: { email: "srividya1369@gmail.com", phone: "4084753810", location: "California, USA" } } }
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
    <div className="w-full max-w-5xl mx-auto my-12 p-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Interactive API Resume</h2>
          <p className="text-gray-400">Execute GET requests to fetch my professional metrics in JSON format.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
            {token ? (
              <Unlock className="text-green-400 w-5 h-5" />
            ) : (
              <Lock className="text-yellow-500 w-5 h-5" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-200">
                {token ? "Authentication Active" : "Authentication Required"}
              </p>
              <p className="text-xs text-gray-400">
                {token ? "Contact endpoint unlocked" : "Generate token to unlock /contact"}
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchToken}
            disabled={token !== null || loading}
            className={`mt-3 flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-all
              ${token 
                ? 'bg-green-900/30 text-green-400 border border-green-800 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
          >
            <Key className="w-4 h-4" />
            <span>{loading ? "Generating..." : token ? "Token Generated" : "Generate Access Token"}</span>
          </button>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden bg-white p-4">
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
};
