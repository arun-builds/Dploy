'use client'
import { Status, Website } from "@repo/database";
import { useEffect, useState } from "react";
import axios from "axios";

export default function WebsitePage({ website }: { website: Website }) {
    const [status, setStatus] = useState<Status>(website.status);

   
    useEffect(() => {
      
        if (status === "Deployed") return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`/api/website?domainId=${website.domainId}`);
                if (response.data.status === "Deployed") {
                    setStatus("Deployed");
                }
            } catch (error) {
                console.error(error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [status, website.domainId]); 

   
    if (status !== "Deployed") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                <h1 className="text-xl font-semibold">Deploying your website...</h1>
                <p className="text-gray-500">This usually takes about a minute.</p>
            </div>
        );
    }

    // 3. Final Render (The "Deployed" state)
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">{website.domainId}</h1>
            <div className="space-y-2 mb-6">
                <p><strong>Status:</strong> <span className="text-green-600">{status}</span></p>
                <p><strong>Created:</strong> {new Date(website.createdAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(website.updatedAt).toLocaleString()}</p>
            </div>
            
            <a 
                href={`http://${website.domainId}.localhost:8081`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
                Visit Website
            </a>
        </div>
    );
}