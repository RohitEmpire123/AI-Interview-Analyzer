export default function ScoreCard({ title, score }) {
  return (
    <div className="bg-gray-800 p-4 rounded text-center shadow">
      <h3 className="text-lg">{title}</h3>
      <p className="text-2xl font-bold mt-2">{score}</p>
    </div>
  );
}