
import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download } from "lucide-react";
import StatChart from "@/components/StatChart";
import StatForm from "@/components/StatForm";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type StatData = {
  name: string;
  value: string;
  percentage: number;
};

const DEFAULT_STATS: StatData[] = [
  { name: "CONNAISSANCES", value: "SSR", percentage: 90 },
  { name: "VITESSE", value: "SR+", percentage: 85 },
  { name: "INTELLIGENCE", value: "SSS+", percentage: 75 },
  { name: "POTENTIEL", value: "UR", percentage: 100 },
  { name: "RÉACTIVITÉ", value: "SSR+", percentage: 95 },
  { name: "POLYVALENCE", value: "SR", percentage: 80 }
];

const Index = () => {
  const [stats, setStats] = useState<StatData[]>(DEFAULT_STATS);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("stat-chart");
  const [maxRank, setMaxRank] = useState<string>("UR");
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const handleStatsUpdate = (newStats: StatData[]) => {
    setStats(newStats);
  };

  const handleMaxRankChange = (rank: string) => {
    setMaxRank(rank);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const svgElement = document.getElementById("stat-chart");
      if (!svgElement) {
        toast.error("Graphique non trouvé");
        return;
      }

      // Get SVG content with proper dimensions
      const serializer = new XMLSerializer();
      let svgData = serializer.serializeToString(svgElement);
      
      // Ensure SVG has proper viewBox and dimensions
      svgData = svgData.replace(/width="[^"]*"/, 'width="1200"');
      svgData = svgData.replace(/height="[^"]*"/, 'height="1200"');
      
      // Create a canvas with higher resolution
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      
      // Create an image from the SVG with better quality
      const img = new Image();
      const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        if (ctx) {
          if (!transparentBg) {
            // Ajouter un fond blanc uniquement si l'option transparente n'est pas sélectionnée
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Spécifier le format PNG avec transparence
          const pngUrl = canvas.toDataURL("image/png", 1.0);
          
          // Créer un lien de téléchargement
          if (navigator.userAgent.match(/android|iphone|ipad|ipod/i)) {
            // Pour les appareils mobiles, utiliser l'API de partage si disponible
            try {
              const blob = dataURItoBlob(pngUrl);
              const file = new File([blob], `${filename || "stat-chart"}.png`, { type: "image/png" });
              
              if (navigator.share) {
                navigator.share({
                  files: [file],
                  title: "Statistiques",
                  text: "Mon graphique de statistiques"
                }).then(() => {
                  toast.success("Image partagée avec succès!");
                }).catch((error) => {
                  console.error("Erreur de partage:", error);
                  // Fallback pour le téléchargement direct
                  downloadImage(pngUrl);
                });
              } else {
                // Fallback pour le téléchargement direct
                downloadImage(pngUrl);
              }
            } catch (error) {
              console.error("Erreur lors du partage:", error);
              downloadImage(pngUrl);
            }
          } else {
            // Sur desktop, téléchargement classique
            downloadImage(pngUrl);
          }
          
          // Clean up
          URL.revokeObjectURL(url);
        }
        setIsDownloading(false);
      };
      
      img.src = url;
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement");
      setIsDownloading(false);
    }
  };

  // Fonction de téléchargement standard
  const downloadImage = (dataUrl: string) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = `${filename || "stat-chart"}.png`;
    downloadLink.click();
    toast.success("Image téléchargée avec succès!");
  };

  // Fonction pour convertir Data URI en Blob
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Générateur de Graphique de Statistiques</h1>
      <p className="text-center text-muted-foreground mb-8">
        Créez et personnalisez votre propre graphique de statistiques
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="shadow-lg transition-all hover:shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configuration des Statistiques</h2>
              <StatForm 
                stats={stats} 
                onUpdateStats={handleStatsUpdate} 
                maxRank={maxRank}
                onMaxRankChange={handleMaxRankChange}
              />
              
              <div className="border-t mt-6 pt-4">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-sm font-medium">Légende</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>F &lt; E &lt; D</div>
                    <div>C &lt; B &lt; A</div>
                    <div>S &lt; SS &lt; SSS</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Note: Un "+" ajoute 10% à la valeur de base.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-lg transition-all hover:shadow-xl">
            <CardContent className="p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">Visualisation</h2>
              <div ref={chartRef} className="mb-4 w-full max-w-[500px] overflow-hidden rounded-lg border border-muted p-4 shadow-sm">
                <StatChart stats={stats} />
              </div>
              
              <div className="w-full mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="filename" className="text-sm font-medium">
                    Nom du fichier
                  </Label>
                  <Input
                    id="filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="Nom du fichier d'export"
                    className="mb-2"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="transparent-mode"
                    checked={transparentBg}
                    onCheckedChange={setTransparentBg}
                  />
                  <Label htmlFor="transparent-mode" className="text-sm cursor-pointer">
                    Fond transparent
                  </Label>
                </div>
                
                <Button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  {isDownloading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Préparation de l'image...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger l'image
                    </span>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  L'image sera téléchargée au format PNG haute qualité
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
