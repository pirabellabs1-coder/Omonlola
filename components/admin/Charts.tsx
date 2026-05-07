"use client";

import { useEffect, useRef } from "react";
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartConfiguration
} from "chart.js";

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
);

const C = {
  brand: "#0066FF",
  brandLight: "#3385FF",
  cyan: "#00C6FF",
  rose: "#FF3366",
  green: "#22C55E",
  orange: "#F59E0B",
  purple: "#A855F7",
  brandBg: "rgba(0,102,255,0.2)",
  cyanBg: "rgba(0,198,255,0.2)",
  greenBg: "rgba(34,197,94,0.2)",
  roseBg: "rgba(255,51,102,0.2)"
};

const baseGrid = { color: "rgba(255,255,255,0.06)" };
const baseTicks = { color: "#A1A1AA", font: { family: '"Plus Jakarta Sans", sans-serif', size: 11 } };

function useChart(config: ChartConfiguration | null) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!ref.current || !config) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
  }, [config]);
  return ref;
}

/**
 * Pattern wrapper: always call useChart at the top of the component, then
 * conditionally render either the canvas or the empty state. This keeps Hook
 * order stable across renders.
 */
function ChartCanvas({
  config,
  emptyLabel,
  isEmpty
}: {
  config: ChartConfiguration | null;
  emptyLabel: string;
  isEmpty: boolean;
}) {
  const ref = useChart(isEmpty ? null : config);
  if (isEmpty) return <EmptyChart label={emptyLabel} />;
  return <canvas ref={ref} />;
}


/* ===================== Public charts ===================== */

export function TrafficLeadsChart({ data }: { data: { label: string; visits: number; leads: number }[] }) {
  const ref = useChart({
    type: "line",
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Visites",
          data: data.map((d) => d.visits),
          borderColor: C.brand,
          backgroundColor: C.brandBg,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        },
        {
          label: "Leads",
          data: data.map((d) => d.leads),
          borderColor: C.cyan,
          backgroundColor: C.cyanBg,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 10, font: { size: 11 }, color: "#A1A1AA" } },
        tooltip: { enabled: true }
      },
      scales: {
        x: { grid: { display: false }, ticks: baseTicks },
        y: { grid: baseGrid, ticks: { ...baseTicks, precision: 0 }, beginAtZero: true }
      },
      interaction: { intersect: false, mode: "index" }
    }
  });
  return <canvas ref={ref} />;
}

export function Traffic12mChart({
  data
}: {
  data: { label: string; visits: number; leads: number; conversions: number }[];
}) {
  const ref = useChart({
    type: "line",
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Visites",
          data: data.map((d) => d.visits),
          borderColor: C.brand,
          backgroundColor: "transparent",
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 2
        },
        {
          label: "Leads",
          data: data.map((d) => d.leads),
          borderColor: C.cyan,
          backgroundColor: "transparent",
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 2
        },
        {
          label: "Conversions",
          data: data.map((d) => d.conversions),
          borderColor: C.green,
          backgroundColor: "transparent",
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { boxWidth: 10, font: { size: 11 }, color: "#A1A1AA" } },
        tooltip: { enabled: true }
      },
      scales: {
        x: { grid: { display: false }, ticks: baseTicks },
        y: { grid: baseGrid, ticks: { ...baseTicks, precision: 0 }, beginAtZero: true }
      },
      interaction: { intersect: false, mode: "index" }
    }
  });
  return <canvas ref={ref} />;
}

export function BudgetsDoughnut({ data }: { data: { label: string; value: number }[] }) {
  const colors = [C.orange, C.brand, C.green, C.cyan, C.rose, C.purple];
  const isEmpty = data.length === 0;
  const config = isEmpty
    ? null
    : ({
        type: "doughnut",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: data.map((_, i) => colors[i % colors.length]),
              borderColor: "#030303",
              borderWidth: 2,
              hoverOffset: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 10, font: { size: 11 }, color: "#A1A1AA", padding: 12 }
            },
            tooltip: { enabled: true }
          }
        } as ChartConfiguration["options"]
      } as ChartConfiguration);
  return <ChartCanvas config={config} isEmpty={isEmpty} emptyLabel="Pas encore de données" />;
}

export function SourcesDoughnut({ data }: { data: { label: string; value: number }[] }) {
  const colors = [C.brand, C.green, C.cyan, C.orange, C.rose, C.purple];
  const isEmpty = data.length === 0;
  const config = isEmpty
    ? null
    : ({
        type: "doughnut",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: data.map((_, i) => colors[i % colors.length]),
              borderColor: "#030303",
              borderWidth: 2,
              hoverOffset: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 10, font: { size: 11 }, color: "#A1A1AA", padding: 12 }
            },
            tooltip: { enabled: true }
          }
        } as ChartConfiguration["options"]
      } as ChartConfiguration);
  return <ChartCanvas config={config} isEmpty={isEmpty} emptyLabel="Aucune visite encore" />;
}

export function GeoDoughnut({ data }: { data: { label: string; value: number }[] }) {
  return <SourcesDoughnut data={data} />;
}

export function SourcesPerfBar({
  data
}: {
  data: { label: string; visits: number; leads: number; rate: number }[];
}) {
  const isEmpty = data.length === 0;
  const config: ChartConfiguration | null = isEmpty
    ? null
    : {
        type: "bar",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            { label: "Visites", data: data.map((d) => d.visits), backgroundColor: C.brand, borderRadius: 4 },
            { label: "Leads", data: data.map((d) => d.leads), backgroundColor: C.cyan, borderRadius: 4 },
            { label: "Conv. (%)", data: data.map((d) => d.rate), backgroundColor: C.green, borderRadius: 4 }
          ]
        },
        options: {
          indexAxis: "y" as const,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { boxWidth: 10, font: { size: 11 }, color: "#A1A1AA" } },
            tooltip: { enabled: true }
          },
          scales: {
            x: { grid: baseGrid, ticks: baseTicks, beginAtZero: true },
            y: { grid: { display: false }, ticks: baseTicks }
          }
        }
      };
  return <ChartCanvas config={config} isEmpty={isEmpty} emptyLabel="Aucune donnée encore" />;
}

export function FunnelBar({ data }: { data: { label: string; value: number }[] }) {
  const colors = [C.brand, C.brandLight, C.cyan, C.green];
  const isEmpty = data.every((d) => d.value === 0);
  const config: ChartConfiguration | null = isEmpty
    ? null
    : {
        type: "bar",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Volume",
              data: data.map((d) => d.value),
              backgroundColor: data.map((_, i) => colors[i % colors.length]),
              borderRadius: 6,
              barThickness: 32
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: true } },
          scales: {
            x: { grid: { display: false }, ticks: baseTicks },
            y: { grid: baseGrid, ticks: { ...baseTicks, precision: 0 }, beginAtZero: true }
          }
        }
      };
  return <ChartCanvas config={config} isEmpty={isEmpty} emptyLabel="Aucune donnée encore" />;
}

export function WeeklyLeadsBar({ data }: { data: { label: string; leads: number }[] }) {
  const ref = useChart({
    type: "bar",
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Leads",
          data: data.map((d) => d.leads),
          backgroundColor: C.brand,
          borderRadius: 6,
          barThickness: 20
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        x: { grid: { display: false }, ticks: baseTicks },
        y: { grid: baseGrid, ticks: { ...baseTicks, precision: 0 }, beginAtZero: true }
      }
    }
  });
  return <canvas ref={ref} />;
}

export function ConversionLine({ data }: { data: { label: string; rate: number }[] }) {
  const ref = useChart({
    type: "line",
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Conversion %",
          data: data.map((d) => d.rate),
          borderColor: C.green,
          backgroundColor: C.greenBg,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: C.green,
          pointRadius: 3,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        x: { grid: { display: false }, ticks: baseTicks },
        y: {
          grid: baseGrid,
          ticks: { ...baseTicks, callback: (v) => `${v}%` },
          beginAtZero: true
        }
      }
    }
  });
  return <canvas ref={ref} />;
}

export function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full text-text-muted text-sm">{label}</div>
  );
}
