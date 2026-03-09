// components/Portfolio/PortfolioHistoryChart.tsx
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface PortfolioHistoryChartProps {
  labels: string[];
  data?: number[];
  baseData?: number[];
  totalData?: number[];
}

export default function PortfolioHistoryChart({ labels, data, baseData, totalData }: PortfolioHistoryChartProps) {
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
    const gridColor = isDark ? 'rgba(255,13,13,0.65)' :
                      isSpring ? 'rgba(22, 101, 52, 0.1)' : 'rgba(0, 0, 0, 0.08)';
    const textColor = isDark ? '#ffffff' : 
                      isSpring ? '#166534' : 'rgba(150,173,227,0.95)';
    const baseColor = isDark ? 'rgba(255, 255, 255, 0.55)' : 
                      isSpring ? 'rgba(21, 128, 61, 0.6)' : 'rgba(215,221,232,0.55)';

    const mainData = totalData || data || [];
    const secondaryData = baseData || [];

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.2)' : 
                             isSpring ? 'rgba(16, 185, 129, 0.2)' : 'rgba(199,153,2,0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    const datasets = [
      {
        label: 'Total Portfolio ($)',
        data: mainData,
        fill: true,
        backgroundColor: gradient,
        borderColor: accentColor,
        borderWidth: 3,
        pointBackgroundColor: accentColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: accentColor,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        zIndex: 2,
      }
    ];

    // Only add base dataset if it's different from main data
    const showBase = secondaryData.length > 0 && 
                    secondaryData.some((v, i) => v !== mainData[i]);

    if (showBase) {
      datasets.unshift({
        label: 'Base Portfolio ($)',
        data: secondaryData,
        fill: false,
        backgroundColor: 'transparent',
        borderColor: baseColor,
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: baseColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: baseColor,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
        zIndex: 1,
      } as any);
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 10,
            bottom: 10
          }
        },
        plugins: {
          legend: {
            display: showBase,
            position: 'top',
            align: 'end',
            labels: {
              color: textColor,
              usePointStyle: true,
              boxWidth: 6,
              font: {
                size: 13, // Slightly larger from 12
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' :
                             isSpring ? 'rgba(240, 253, 244, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDark ? '#fff' : 
                        isSpring ? '#166534' : '#0f132a',
            bodyColor: isDark ? '#fff' : 
                       isSpring ? '#166534' : '#0f132a',
            borderColor: isDark ? 'transparent' : 
                         isSpring ? '#10b981' : '#e2e8f0',
            borderWidth: 1,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              font: {
                size: 13, // Slightly larger from 12
                weight: 'bold'
              }
            }
          },
          y: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
              font: {
                size: 13, // Slightly larger from 12
                weight: 'bold'
              },
              callback: (value) => {
                return '$' + (value as number).toLocaleString();
              }
            }
          }
        }
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, data, baseData, totalData, theme]);

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      <canvas ref={chartRef} aria-label="Portfolio value history chart" role="img"></canvas>
    </div>
  );
}
