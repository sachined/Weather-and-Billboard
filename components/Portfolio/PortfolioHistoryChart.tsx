// components/Portfolio/PortfolioHistoryChart.tsx
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

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
  const prevThemeRef = useRef(theme);

  useEffect(() => {
    if (!chartRef.current) return;

    const themeChanged = prevThemeRef.current !== theme;
    prevThemeRef.current = theme;

    const mainData = totalData || data || [];
    const secondaryData = baseData || [];
    const showBase = secondaryData.length > 0 &&
      secondaryData.some(v => v > 0) &&
      secondaryData.some((v, i) => v !== mainData[i]);

    // If chart exists and only data changed (not theme or dataset count), update in place
    if (chartInstance.current && !themeChanged) {
      const chart = chartInstance.current;
      const currentDatasetCount = chart.data.datasets.length;
      const newDatasetCount = showBase ? 2 : 1;

      if (currentDatasetCount === newDatasetCount) {
        chart.data.labels = labels;
        if (showBase) {
          chart.data.datasets[0].data = secondaryData;
          chart.data.datasets[1].data = mainData;
        } else {
          chart.data.datasets[0].data = mainData;
        }
        chart.update('none');
        return;
      }
      // Dataset count changed — fall through to full recreate
      chartInstance.current.destroy();
    } else if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const isDark = theme === 'dark';

    const accentColor = isDark ? '#38bdf8' : '#2563EB';

    const rootStyle = getComputedStyle(document.documentElement);
    const textColor = rootStyle.getPropertyValue('--chart-label').trim() || '#4A5568';
    const gridColor = rootStyle.getPropertyValue('--chart-grid').trim() || 'rgba(0, 0, 0, 0.1)';
    const baseColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(148, 163, 184, 0.6)';

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(37, 99, 235, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    const datasets = [
      {
        label: 'Portfolio Value (with new adds)',
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

    if (showBase) {
      datasets.unshift({
        label: 'Original Positions Only',
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
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.97)',
            titleColor: isDark ? '#f1f5f9' : '#0f172a',
            bodyColor: isDark ? '#94a3b8' : '#4A5568',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
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
