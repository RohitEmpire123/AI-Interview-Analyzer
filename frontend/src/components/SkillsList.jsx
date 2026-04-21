export default function SkillsList({ skills }) {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="mb-3">Skills</h3>

      <div className="flex flex-wrap gap-2">
        {skills?.map((s, i) => (
          <span
            key={i}
            className="bg-blue-500 px-2 py-1 rounded text-sm"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}