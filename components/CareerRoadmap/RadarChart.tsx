import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import React from 'react';
import { RoleInfo } from '../../lib/roles';
import { useTheme } from '../../hooks/useTheme';

interface RadarChartProps {
  role: RoleInfo;
  labels: (string | string[])[];
}

export default function RadarChart({ role, labels }: RadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const isDark = theme === 'dark';
    const isSpring = theme === 'spring';
    
    const accentColor = isDark ? '#38bdf8' : 
                        isSpring ? '#10b981' : '#0284c7';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 
                      isSpring ? 'rgba(22, 101, 52, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const labelColor = isDark ? '#ffffff' : 
                       isSpring ? '#166534' : '#0f172a';
    const fillBG = isDark ? 'rgba(56, 189, 248, 0.2)' : 
                   isSpring ? 'rgba(16, 185, 129, 0.2)' : 'rgba(2, 132, 199, 0.2)';

    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: role.title,
            data: role.scores,
            fill: true,
            backgroundColor: fillBG,
            borderColor: accentColor,
            pointBackgroundColor: accentColor,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: accentColor,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 40,
            bottom: 40,
            left: 60,
            right: 60
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: { display: false, stepSize: 2 },
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: {
              font: {
                size: 14, 
                weight: 'bold'
              },
              color: labelColor,
              padding: 10 // Distance from chart area
            }
          },
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : 
                             isSpring ? '#f0fdf4' : '#ffffff',
            titleColor: isDark ? '#fff' : 
                        isSpring ? '#166534' : '#0f172a',
            bodyColor: isDark ? '#fff' : 
                       isSpring ? '#166534' : '#0f172a',
            borderColor: isDark ? 'transparent' : 
                         isSpring ? '#10b981' : '#e2e8f0',
            borderWidth: 1,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            padding: 12,
            displayColors: false,
          }
        }
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [role, labels, theme]);

  return (
    <div style={{ width: '100%', height: '450px', margin: '0 auto', position: 'relative' }}>
      <canvas ref={chartRef} aria-label={`Radar chart showing technical and strategic scores for ${role.title}`} role="img">
      </canvas>
    </div>
  );
}
