
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatData } from "@/pages/Index";
import { toast } from "sonner";
import { Plus, Minus, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface StatFormProps {
  stats: StatData[];
  onUpdateStats: (newStats: StatData[]) => void;
  maxRank: string;
  onMaxRankChange: (rank: string) => void;
}

const RANK_VALUES = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS", "SR", "SSR", "UR"];
const RANK_MODIFIER = ["", "+"];

const getRankPercentage = (rank: string, maxRank: string): number => {
  // Valeurs de base pour tous les rangs
  const rankOrder: { [key: string]: number } = {
    'UR+': 14,
    'UR': 13,
    'SSR+': 12,
    'SSR': 11,
    'SR+': 10,
    'SR': 9,
    'SSS+': 8,
    'SSS': 7,
    'SS+': 6,
    'SS': 5,
    'S+': 4,
    'S': 3,
    'A+': 2,
    'A': 1,
    'B+': 0.8,
    'B': 0.6,
    'C+': 0.5,
    'C': 0.4,
    'D+': 0.3,
    'D': 0.2,
    'E+': 0.15,
    'E': 0.1,
    'F+': 0.05,
    'F': 0.01,
  };

  // Trouver la valeur du rang maximum (100%)
  const maxRankValue = rankOrder[maxRank] || rankOrder['UR'];
  
  // Calculer le pourcentage en fonction du rang maximum
  const rankValue = rankOrder[rank] || 0;
  
  // Si c'est le rang maximum + modificateur, renvoyer 110%
  if (rank === maxRank + '+') {
    return 110;
  }
  
  // Si c'est le rang maximum, renvoyer 100%
  if (rank === maxRank) {
    return 100;
  }
  
  // Sinon calculer le pourcentage en fonction du rang max
  return Math.round((rankValue / maxRankValue) * 100);
};

const StatForm: React.FC<StatFormProps> = ({ stats, onUpdateStats, maxRank, onMaxRankChange }) => {
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
    const percentage = getRankPercentage(value, maxRank);
    newStats[index] = { ...newStats[index], value, percentage };
    setFormStats(newStats);
  };

  const handleMaxRankChange = (newMaxRank: string) => {
    onMaxRankChange(newMaxRank);
    
    // Recalculer les pourcentages pour toutes les stats existantes
    const updatedStats = formStats.map(stat => ({
      ...stat,
      percentage: getRankPercentage(stat.value, newMaxRank)
    }));
    
    setFormStats(updatedStats);
    
    // Appliquer les changements immédiatement
    onUpdateStats(updatedStats);
    toast.success(`Rang maximum défini sur ${newMaxRank}`);
  };

  const handleStatCountChange = (count: number) => {
    const newCount = Math.max(3, Math.min(12, count));
    setStatCount(newCount);
    
    let newStats = [...formStats];
    
    if (newCount > formStats.length) {
      const additionalStats = Array.from({ length: newCount - formStats.length }, () => ({
        name: "STATISTIQUE",
        value: "A",
        percentage: getRankPercentage("A", maxRank)
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
      <div className="space-y-4">
        <div className="p-3 border border-border/50 rounded-md bg-muted/30">
          <Label className="font-medium mb-2 block">Rang Maximum (100%)</Label>
          <Select 
            value={maxRank} 
            onValueChange={handleMaxRankChange}
          >
            <SelectTrigger className="h-9 font-medium">
              <SelectValue placeholder="Choisir le rang maximum" />
            </SelectTrigger>
            <SelectContent>
              {RANK_VALUES.slice(2).reverse().map((rank) => (
                <SelectItem 
                  key={rank} 
                  value={rank}
                  className="font-semibold"
                >
                  {rank} (100%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Le rang sélectionné sera défini à 100% et tous les autres rangs seront ajustés en conséquence
          </p>
        </div>

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
                      {RANK_MODIFIER.map((mod) => {
                        const fullRank = `${rank}${mod}`;
                        return (
                          <SelectItem 
                            key={fullRank} 
                            value={fullRank}
                            className="font-semibold"
                          >
                            {fullRank} ({getRankPercentage(fullRank, maxRank)}%)
                          </SelectItem>
                        );
                      })}
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
