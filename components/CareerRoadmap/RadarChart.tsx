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
    const isMinimalist = theme === 'light';

    const rootStyle = getComputedStyle(document.documentElement);

    // Inside useEffect in RadarChart.tsx
    const accentColor = isMinimalist ? '#2563EB' : (rootStyle.getPropertyValue('--accent-primary').trim() || '#38bdf8');

    // Update grid and axis for high contrast on light background
    const gridColor = isMinimalist ? '#F1F5F9' : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(100, 250, 200, 0.15)');
    const axisColor = isMinimalist ? '#E2E8F0' : (isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(150, 200, 100, 0.1)');
    const labelColor = rootStyle.getPropertyValue('--text-heading').trim() ||
        (isDark ? '#ffffff' : isSpring ? '#55705E' : '#020617');

    const fillBG = isMinimalist ? 'rgba(37, 99, 235, 0.1)' : (isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(152, 216, 163, 0.4)');

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
            bottom: 50,
            left: 60,
            right: 60
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: { display: false, stepSize: 2 },
            grid: { color: gridColor, lineWidth: isDark ? 1 : 2},
            angleLines: { color: axisColor, lineWidth: isDark ? 1.5 : 2, borderDash: isDark ? [5, 5] : [] },
            pointLabels: {
              font: {
                size: 18,
                weight: isDark ? 500 : 'bold'
              },
              color: labelColor,
              //backdropColor: labelGlow,
              backdropPadding: 4,
              padding: 22 // Distance from the chart area
            }
          },
        },
        plugins: {
          legend: {
            display: false
          },
        // Update Tooltip colors
          tooltip: {
            backgroundColor: isDark ? '#1e293b' :
                             isSpring ? '#FFFFFF' : '#ffffff',
            titleColor: isDark ? '#fff' :
                        isSpring ? '#55705E' : '#0f172a',
            bodyColor: isDark ? '#fff' :
                       isSpring ? '#333333' : '#0f172a',
            borderColor: isDark ? 'transparent' :
                         isSpring ? '#98D8A3' : '#e2e8f0',
            borderWidth: 1,
            titleFont: { size: 14, weight: isDark ? 500 : 'bold' },
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
