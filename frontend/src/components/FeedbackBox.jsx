export default function FeedbackBox({ title, text }) {
  const cleanText = (t) => t?.replace(/\\/g, "");

  return (
    <div className="bg-gray-800 p-4 rounded max-h-60 overflow-y-auto">
      <h3 className="mb-2">{title}</h3>
      <p className="text-sm text-gray-300">{cleanText(text)}</p>
    </div>
  );
}