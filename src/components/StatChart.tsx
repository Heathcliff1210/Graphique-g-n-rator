
import React from "react";
import { StatData } from "@/pages/Index";

interface StatChartProps {
  stats: StatData[];
}

const StatChart: React.FC<StatChartProps> = ({ stats }) => {
  // Function to calculate coordinates based on percentage and angle
  const calculateCoordinates = (percentage: number, index: number, total: number) => {
    const maxLength = 200;
    const length = (percentage / 100) * maxLength;
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    
    return {
      x: Math.cos(angle) * length,
      y: Math.sin(angle) * length
    };
  };

  // Create path for the stats polygon
  const createStatsPath = () => {
    if (!stats.length) return "";
    
    const points = stats.map((stat, index) => {
      const coords = calculateCoordinates(stat.percentage, index, stats.length);
      return `${coords.x},${coords.y}`;
    });
    
    return `M${points.join(" L")} Z`;
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" id="stat-chart">
      {/* Fond blanc */}
      <rect width="600" height="600" fill="white"/>
      
      {/* Définition des gradients */}
      <defs>
        <linearGradient id="statFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#4158D0", stopOpacity:0.8}}/>
          <stop offset="50%" style={{stopColor:"#C850C0", stopOpacity:0.8}}/>
          <stop offset="100%" style={{stopColor:"#FFCC70", stopOpacity:0.8}}/>
        </linearGradient>
        <linearGradient id="centerFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#4158D0", stopOpacity:1}}/>
          <stop offset="50%" style={{stopColor:"#C850C0", stopOpacity:1}}/>
          <stop offset="100%" style={{stopColor:"#FFCC70", stopOpacity:1}}/>
        </linearGradient>
      </defs>

      <g transform="translate(300,300)">
        {/* Hexagone externe et lignes de grille */}
        <g stroke="#000" strokeWidth="1" fill="none">
          {/* Grille principale - 5 niveaux */}
          <path d="M0,-200 L173.2,-100 L173.2,100 L0,200 L-173.2,100 L-173.2,-100 Z" strokeWidth="2"/>
          <path d="M0,-160 L138.56,-80 L138.56,80 L0,160 L-138.56,80 L-138.56,-80 Z" stroke="#000"/>
          <path d="M0,-120 L103.92,-60 L103.92,60 L0,120 L-103.92,60 L-103.92,-60 Z" stroke="#000"/>
          <path d="M0,-80 L69.28,-40 L69.28,40 L0,80 L-69.28,40 L-69.28,-40 Z" stroke="#000"/>
          <path d="M0,-40 L34.64,-20 L34.64,20 L0,40 L-34.64,20 L-34.64,-20 Z" stroke="#000"/>
        </g>

        {/* Zone des stats dynamique */}
        <path d={createStatsPath()} fill="url(#statFill)" stroke="#000" strokeWidth="2"/>
              
        {/* Zone centrale plus foncée */}
        <path d="M0,-80 L69.28,-40 L69.28,40 L0,80 L-69.28,40 L-69.28,-40 Z" 
              fill="url(#centerFill)" stroke="none"/>

        {/* Textes des stats */}
        <g fontFamily="'Roboto', sans-serif" fontSize="16">
          {/* Noms et valeurs des stats dynamiques */}
          {stats.map((stat, index) => {
            const total = stats.length;
            const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
            const labelDistance = 230;
            const valueDistance = 250;
            
            const labelX = Math.cos(angle) * labelDistance;
            const labelY = Math.sin(angle) * labelDistance;
            const valueX = Math.cos(angle) * valueDistance;
            const valueY = Math.sin(angle) * valueDistance;
            
            let anchor = "middle";
            if (labelX > 50) anchor = "start";
            if (labelX < -50) anchor = "end";
            
            return (
              <React.Fragment key={index}>
                <text 
                  x={labelX} 
                  y={labelY} 
                  textAnchor={anchor} 
                  fontWeight="bold" 
                  dominantBaseline="middle"
                >
                  {stat.name}
                </text>
                <text 
                  x={valueX} 
                  y={valueY} 
                  textAnchor={anchor} 
                  fill="#444"
                  dominantBaseline="middle"
                >
                  {stat.value}
                </text>
              </React.Fragment>
            );
          })}
        </g>

        {/* Lignes de connexion */}
        <g stroke="#000" strokeWidth="1">
          {stats.map((_, index) => {
            const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;
            const x = Math.cos(angle) * 200;
            const y = Math.sin(angle) * 200;
            
            return <line key={index} x1="0" y1="0" x2={x} y2={y} />;
          })}
        </g>
      </g>
    </svg>
  );
};

export default StatChart;
