
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatData } from "@/pages/Index";
import { toast } from "sonner";

interface StatFormProps {
  stats: StatData[];
  onUpdateStats: (newStats: StatData[]) => void;
}

const RANK_VALUES = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
const RANK_MODIFIER = ["", "+", "++"];

// Map rank to percentage value
const getRankPercentage = (rank: string): number => {
  let base = 0;
  let modifier = 0;
  
  // Calculate base percentage
  for (let i = 0; i < RANK_VALUES.length; i++) {
    if (rank.startsWith(RANK_VALUES[i])) {
      base = (i + 1) * 10;
      break;
    }
  }
  
  // Add modifier bonus
  if (rank.includes("+")) {
    modifier = rank.endsWith("++") ? 8 : 5;
  }
  
  return Math.min(base + modifier, 100);
};

const StatForm: React.FC<StatFormProps> = ({ stats, onUpdateStats }) => {
  const [statCount, setStatCount] = useState(stats.length || 6);
  const [formStats, setFormStats] = useState<StatData[]>(stats);
  
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
    
    // If increasing, add new stats
    if (newCount > formStats.length) {
      const additionalStats = Array.from({ length: newCount - formStats.length }, () => ({
        name: "STATISTIQUE",
        value: "A",
        percentage: 70
      }));
      newStats = [...newStats, ...additionalStats];
    } 
    // If decreasing, remove stats
    else if (newCount < formStats.length) {
      newStats = newStats.slice(0, newCount);
    }
    
    setFormStats(newStats);
  };

  const handleApplyChanges = () => {
    // Validate that all stat names are filled
    const emptyNames = formStats.filter(stat => !stat.name.trim()).length;
    if (emptyNames > 0) {
      toast.error("Tous les noms de statistiques doivent être remplis");
      return;
    }
    
    onUpdateStats(formStats);
    toast.success("Statistiques mises à jour avec succès!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="stat-count">Nombre de statistiques</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => handleStatCountChange(statCount - 1)}
            disabled={statCount <= 3}
          >
            -
          </Button>
          <span className="w-8 text-center">{statCount}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatCountChange(statCount + 1)}
            disabled={statCount >= 12}
          >
            +
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Minimum: 3, Maximum: 12</p>
      </div>

      <div className="space-y-4">
        {formStats.slice(0, statCount).map((stat, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`stat-name-${index}`}>Nom</Label>
              <Input
                id={`stat-name-${index}`}
                value={stat.name}
                onChange={(e) => handleStatNameChange(index, e.target.value)}
                maxLength={20}
                placeholder="Nom de la statistique"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`stat-value-${index}`}>Valeur</Label>
              <Select
                value={stat.value}
                onValueChange={(value) => handleStatValueChange(index, value)}
              >
                <SelectTrigger id={`stat-value-${index}`}>
                  <SelectValue placeholder="Choisir une valeur" />
                </SelectTrigger>
                <SelectContent>
                  {RANK_VALUES.map((rank) => (
                    <React.Fragment key={rank}>
                      {RANK_MODIFIER.map((mod) => (
                        <SelectItem key={`${rank}${mod}`} value={`${rank}${mod}`}>
                          {`${rank}${mod}`}
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
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        onClick={handleApplyChanges}
      >
        Appliquer les changements
      </Button>
    </div>
  );
};

export default StatForm;
