import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatData } from "@/pages/Index";
import { toast } from "sonner";
import { Plus, Minus, RefreshCw } from "lucide-react";

interface StatFormProps {
  stats: StatData[];
  onUpdateStats: (newStats: StatData[]) => void;
}

const RANK_VALUES = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS", "SR", "SSR", "UR", "UR+"];
const RANK_MODIFIER = ["", "+"];

const getRankPercentage = (rank: string): number => {
  const basePercentages: { [key: string]: number } = {
    'UR+': 110,    // Maximum
    'UR': 100,
    'SSR+': 95,
    'SSR': 90,
    'SR+': 85,
    'SR': 80,
    'SSS+': 75,
    'SSS': 70,
    'SS+': 65,
    'SS': 60,
    'S+': 55,
    'S': 50,
    'A+': 45,
    'A': 40,
    'B+': 35,
    'B': 30,
    'C+': 25,
    'C': 20,
    'D+': 15,
    'D': 10,
    'E+': 7,
    'E': 5,
    'F+': 3,
    'F': 1,
  };
  
  return basePercentages[rank] || 1;
};

const StatForm: React.FC<StatFormProps> = ({ stats, onUpdateStats }) => {
  const [statCount, setStatCount] = useState(stats.length || 6);
  const [formStats, setFormStats] = useState<StatData[]>(stats);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleStatNameChange = (index: number, name: string) => {
    const newStats = [...formStats];
    newStats[index] = { ...newStats[index], name };
    setFormStats(newStats);
  };

  const handleStatValueChange = (index: number, value: string) => {
    const newStats = [...formStats];
    const percentage = getRankPercentage(value);
    newStats[index] = { ...newStats[index], value, percentage };
    setFormStats(newStats);
  };

  const handleStatCountChange = (count: number) => {
    const newCount = Math.max(3, Math.min(12, count));
    setStatCount(newCount);
    
    let newStats = [...formStats];
    
    if (newCount > formStats.length) {
      const additionalStats = Array.from({ length: newCount - formStats.length }, () => ({
        name: "STATISTIQUE",
        value: "A",
        percentage: 70
      }));
      newStats = [...newStats, ...additionalStats];
    } 
    else if (newCount < formStats.length) {
      newStats = newStats.slice(0, newCount);
    }
    
    setFormStats(newStats);
  };

  const handleApplyChanges = () => {
    const emptyNames = formStats.filter(stat => !stat.name.trim()).length;
    if (emptyNames > 0) {
      toast.error("Tous les noms de statistiques doivent être remplis");
      return;
    }
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
    onUpdateStats(formStats);
    toast.success("Statistiques mises à jour avec succès!");
  };

  const handleReset = () => {
    const defaultStats = stats.slice(0, statCount);
    setFormStats(defaultStats);
    toast.info("Formulaire réinitialisé");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="stat-count">Nombre de statistiques</Label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="text-xs"
              title="Réinitialiser le formulaire"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => handleStatCountChange(statCount - 1)}
            disabled={statCount <= 3}
            title="Réduire le nombre de statistiques"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-12 h-10 flex items-center justify-center bg-muted rounded-md font-medium">
            {statCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatCountChange(statCount + 1)}
            disabled={statCount >= 12}
            title="Augmenter le nombre de statistiques"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground ml-2">Min: 3, Max: 12</span>
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {formStats.slice(0, statCount).map((stat, index) => (
          <div 
            key={index} 
            className="grid grid-cols-2 gap-4 p-3 border border-border/50 rounded-md hover:border-border transition-all"
          >
            <div className="space-y-2">
              <Label htmlFor={`stat-name-${index}`} className="text-xs">
                Nom de la statistique {index + 1}
              </Label>
              <Input
                id={`stat-name-${index}`}
                value={stat.name}
                onChange={(e) => handleStatNameChange(index, e.target.value)}
                maxLength={20}
                placeholder="Nom de la statistique"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`stat-value-${index}`} className="text-xs">
                Valeur
              </Label>
              <Select
                value={stat.value}
                onValueChange={(value) => handleStatValueChange(index, value)}
              >
                <SelectTrigger id={`stat-value-${index}`} className="h-9 font-medium">
                  <SelectValue placeholder="Choisir une valeur" />
                </SelectTrigger>
                <SelectContent>
                  {RANK_VALUES.slice().reverse().map((rank) => (
                    <React.Fragment key={rank}>
                      {RANK_MODIFIER.map((mod) => (
                        <SelectItem 
                          key={`${rank}${mod}`} 
                          value={`${rank}${mod}`}
                          className="font-semibold"
                        >
                          {`${rank}${mod}`} ({getRankPercentage(`${rank}${mod}`)}%)
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>

      <Button 
        className={`w-full transition-all duration-300 ${isAnimating ? "animate-pulse" : ""} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700`}
        onClick={handleApplyChanges}
      >
        Appliquer les changements
      </Button>
    </div>
  );
};

export default StatForm;
