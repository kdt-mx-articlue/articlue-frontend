export default function ArtiParticles() {
  return (
    <>
      {[...Array(10)].map(
        (_, index) => (
          <span
            key={index}
            className="arti-particle"
            style={{
              left: `${10 + index * 8}%`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        )
      )}
    </>
  );
}