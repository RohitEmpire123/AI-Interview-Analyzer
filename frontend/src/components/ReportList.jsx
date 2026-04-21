export default function ReportList({ reports = [], onDelete, onDownload }) {
  
  if (reports.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded text-center text-gray-400">
        No reports yet. Analyze your first interview 🚀
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="mb-4 text-lg font-semibold">Past Reports</h3>

      {reports.map((r) => (
        <div
          key={r._id}
          className="flex justify-between items-center bg-gray-700 p-3 rounded mb-3 hover:bg-gray-600 transition"
        >
          {/* Left Section */}
          <div>
            <p className="text-sm">
              Score:{" "}
              <span
                className={`font-bold ${
                  r.finalScore >= 80
                    ? "text-green-400"
                    : r.finalScore >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {r.finalScore ?? "N/A"}
              </span>
            </p>

            <p className="text-xs text-gray-400">
              {r.createdAt
                ? new Date(r.createdAt).toLocaleString()
                : "Unknown date"}
            </p>
          </div>

          {/* Right Section */}
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(r._id)}
              className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Download
            </button>

            <button
              onClick={() => {
                if (confirm("Delete this report?")) {
                  onDelete(r._id);
                }
              }}
              className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}