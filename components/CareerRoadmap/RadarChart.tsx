import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import React from 'react';
import { RoleInfo } from '@/lib/roles';
import { useTheme } from '@/hooks/useTheme';
import styles from './RadarChart.module.css';

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
//    const isSpring = theme === 'spring';
//    const isMinimalist = theme === 'light';

    const rootStyle = getComputedStyle(document.documentElement);

    // Inside useEffect in RadarChart.tsx
    const accentColor = rootStyle.getPropertyValue('--accent-primary').trim() || '#38bdf8';
    const gridColor = rootStyle.getPropertyValue('--chart-grid').trim() || 'rgba(0,0,0,0.1)';
    const fillBG = rootStyle.getPropertyValue('--chart-fill').trim() || 'rgba(81,179,223,0.25)';

    // Update grid and axis for high contrast on a light background
    const axisColor = rootStyle.getPropertyValue('--chart-axis').trim() || 'rgba(0, 0, 0, 0.1)';
    const labelColor = rootStyle.getPropertyValue('--text-heading').trim() || '#020617';

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
            grid: { color: gridColor, lineWidth: isDark ? 1 : 1.5},
            angleLines: { color: axisColor, lineWidth: isDark ? 1.5 : 3, borderDash: isDark ? [5, 5] : [] },
            pointLabels: {
              font: {
                size: 18,
                weight: 'bold'
              },
              color: labelColor,
              padding: 10 // Distance from the chart area
            }
          },
        },
        plugins: {
          legend: {
            display: false
          },
        // Update Tooltip colors
          tooltip: {
            backgroundColor: rootStyle.getPropertyValue('--bg-surface').trim(),
            titleColor: rootStyle.getPropertyValue('--text-heading').trim(),
            bodyColor: rootStyle.getPropertyValue('--text-main').trim(),
            borderColor: rootStyle.getPropertyValue('--border-main').trim(),
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
    <div className={styles.chartContainer}>
      <canvas ref={chartRef} aria-label={`Radar chart showing technical and strategic scores for ${role.title}`} role="img">
      </canvas>
    </div>
  );
}
