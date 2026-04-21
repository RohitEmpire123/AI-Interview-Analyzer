export default function AnalyticsCards({ summary, progress }) {
  if (!summary) return null;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-gray-800 p-4 rounded">
        <p>Total Reports</p>
        <h2 className="text-xl font-bold">{summary.totalReports}</h2>
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <p>Average Score</p>
        <h2 className="text-xl font-bold">{summary.averageScore}</h2>
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <p>Improvement</p>
        <h2 className="text-xl font-bold">
          {progress?.improvement || "N/A"}
        </h2>
      </div>
    </div>
  );
}