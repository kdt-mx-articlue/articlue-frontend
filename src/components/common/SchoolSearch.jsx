export default function SchoolSearch({
  value,
  onChange,
  placeholder,
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }
    />
  );
}