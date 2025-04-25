
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatChart from "@/components/StatChart";
import StatForm from "@/components/StatForm";

export type StatData = {
  name: string;
  value: string;
  percentage: number;
};

const DEFAULT_STATS: StatData[] = [
  { name: "CONNAISSANCES", value: "A+", percentage: 90 },
  { name: "VITESSE", value: "S+", percentage: 95 },
  { name: "INTELLIGENCE", value: "A+", percentage: 85 },
  { name: "POTENTIEL", value: "SS", percentage: 98 },
  { name: "RÉACTIVITÉ", value: "S", percentage: 90 },
  { name: "POLYVALENCE", value: "S", percentage: 85 }
];

const Index = () => {
  const [stats, setStats] = useState<StatData[]>(DEFAULT_STATS);
  
  const handleStatsUpdate = (newStats: StatData[]) => {
    setStats(newStats);
  };

  const handleDownload = () => {
    const svgElement = document.getElementById("stat-chart");
    if (!svgElement) return;

    // Get SVG content
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svgElement);
    
    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    
    // Create an image from the SVG
    const img = new Image();
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to PNG
        const pngUrl = canvas.toDataURL("image/png");
        
        // Create download link
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "stat-chart.png";
        downloadLink.click();
        
        // Clean up
        URL.revokeObjectURL(url);
      }
    };
    
    img.src = url;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Générateur de Graphique de Statistiques</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configuration des Statistiques</h2>
              <StatForm stats={stats} onUpdateStats={handleStatsUpdate} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-lg">
            <CardContent className="p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Visualisation</h2>
              <div className="mb-4 w-full max-w-[500px] overflow-hidden">
                <StatChart stats={stats} />
              </div>
              <Button 
                onClick={handleDownload} 
                className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Télécharger l'image
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
