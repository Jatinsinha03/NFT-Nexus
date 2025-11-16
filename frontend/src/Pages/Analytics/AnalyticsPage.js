import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import './AnalyticsPage.css';

Chart.register(...registerables);

const AnalyticsPage = ({ contractAddress }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [threshold, setThreshold] = useState(50000); // Default threshold
  const [userAlerted, setUserAlerted] = useState(false); // Prevent multiple alerts

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Use backend proxy to avoid CORS issues
        const response = await fetch(
          `https://nft-nexus-backend.onrender.com/api/unleash/collection/analytics?blockchain=ethereum&contract_address=${contractAddress}&offset=0&limit=30&sort_by=sales&time_range=24h&sort_order=desc`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setAnalyticsData(data.data[0]);
        } else {
          throw new Error("No analytics data available.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [contractAddress]);

  useEffect(() => {
    if (analyticsData && !userAlerted) {
      const { volume_trend } = analyticsData;
      const latestVolume = volume_trend[volume_trend.length - 7];

      if (latestVolume > threshold) {
        window.alert(`Volume spike detected! Latest volume: ${latestVolume}`);
        setUserAlerted(true); // Prevents repeated alerts until new data is fetched
      }
    }
  }, [analyticsData, threshold, userAlerted]);

  if (loading) return <div className="analytics-loading">Loading analytics...</div>;
  if (error) return <div className="analytics-error">Error: {error}</div>;

  const { block_dates, volume_trend, sales, transactions, assets, transactions_trend } = analyticsData;

  const volumeTrendData = {
    labels: block_dates.map((date) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
    datasets: [
      {
        label: "Volume Trend",
        data: volume_trend,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
      },
    ],
  };

  const totalMetricsData = {
    labels: ["Sales", "Transactions", "Assets"],
    datasets: [
      {
        label: "Total Metrics Summary",
        data: [sales, transactions, assets],
        backgroundColor: ["rgba(54,162,235,0.6)", "rgba(255,206,86,0.6)", "rgba(75,192,192,0.6)"],
      },
    ],
  };

  const transactionHeatmapData = {
    labels: block_dates.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: "Transaction Heatmap",
        data: transactions_trend,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time / Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Analytics for {contractAddress}</h2>

      <div className="analytics-threshold-input">
        <label>
          Set Volume Alert Threshold:{" "}
          <input
            type="number"
            value={threshold}
            onChange={(e) => {
              setThreshold(Number(e.target.value));
              setUserAlerted(false); // Reset alert state when threshold changes
            }}
            className="analytics-input"
          />
        </label>
      </div>

      <div className="analytics-chart-container">
        <h3 className="analytics-chart-title">Volume Trend</h3>
        <Line data={volumeTrendData} options={chartOptions} />
      </div>

      <div className="analytics-chart-container">
        <h3 className="analytics-chart-title">Total Metrics Summary</h3>
        <Bar data={totalMetricsData} options={chartOptions} />
      </div>

      <div className="analytics-chart-container">
        <h3 className="analytics-chart-title">Transaction Heatmap</h3>
        <Bar data={transactionHeatmapData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
