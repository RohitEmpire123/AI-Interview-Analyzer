export default function FileUpload({ label, accept, onChange }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px" }}>
        {label}
      </label>

      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
}