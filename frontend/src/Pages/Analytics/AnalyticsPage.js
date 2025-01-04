import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const AnalyticsPage = ({ contractAddress }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `https://api.unleashnfts.com/api/v2/nft/collection/analytics?blockchain=ethereum&contract_address=${contractAddress}&offset=0&limit=30&sort_by=sales&time_range=24h&sort_order=desc`,
          {
            headers: {
              accept: "application/json",
              "x-api-key": "316dd88ae8840897e1f61160265d1a3f",
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

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  const { block_dates, volume_trend, sales, transactions, assets, transactions_trend } = analyticsData;

  // Prepare data for charts
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
    maintainAspectRatio: false, // Ensures the size is manageable
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time / Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Analytics for {contractAddress}</h2>

      <div style={{ marginBottom: "30px", height: "300px" }}>
        <h3>Volume Trend</h3>
        <Line data={volumeTrendData} options={chartOptions} />
      </div>
    <br />
      <div style={{ marginBottom: "30px", height: "800px" }}>
        <h3>Total Metrics Summary</h3>
        <Bar data={totalMetricsData} options={chartOptions} />
      </div>
<br />
      <div style={{ height: "300px" }}>
        <h3>Transaction Heatmap</h3>
        <Bar data={transactionHeatmapData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
