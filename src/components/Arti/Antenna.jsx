export default function Antenna() {
  const left = [118, 128, 138];
  const right = [202, 212, 222];

  return (
    <>
      {left.map((x) => (
        <rect
          key={x}
          x={x}
          y="18"
          width="6"
          height="40"
          rx="4"
          fill="#54DBFF"
        />
      ))}

      {right.map((x) => (
        <rect
          key={x}
          x={x}
          y="18"
          width="6"
          height="40"
          rx="4"
          fill="#54DBFF"
        />
      ))}
    </>
  );
}