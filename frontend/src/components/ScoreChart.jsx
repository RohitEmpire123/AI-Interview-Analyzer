import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ScoreChart({ reports }) {
  const data = {
    labels: reports?.map((_, i) => `Attempt ${i + 1}`),
    datasets: [
      {
        label: "Final Score",
        data: reports?.map((r) => r.finalScore),
      },
    ],
  };

  return <Bar data={data} />;
}