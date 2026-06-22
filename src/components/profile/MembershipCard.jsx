export default function MembershipCard({
  membership,
  usage,
}) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>
          이용권
        </h2>
      </div>

      <div className="repeat-card">
        <div>
          <strong>
            {membership ||
              "FREE"}
          </strong>
        </div>

        <div
          style={{
            marginTop: "12px",
          }}
        >
          남은 무료 자소서
          :
          {" "}
          {
            usage?.remainingCoverLetter ??
            0
          }
          /
          {
            usage?.maxCoverLetter ??
            0
          }
        </div>

        <div>
          남은 무료 면접
          :
          {" "}
          {
            usage?.remainingInterview ??
            0
          }
          /
          {
            usage?.maxInterview ??
            0
          }
        </div>
      </div>
    </section>
  );
}