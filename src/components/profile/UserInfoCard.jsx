export default function UserInfoCard({
  member,
}) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>
          사용자 정보
        </h2>
      </div>

      <div className="repeat-card">
        <div>
          <strong>
            {member?.name ||
              "-"}
          </strong>
        </div>

        <div>
          닉네임 :
          {" "}
          {member?.nickname ||
            "-"}
        </div>

        <div>
          이메일 :
          {" "}
          {member?.email ||
            "-"}
        </div>

        <div>
          가입일 :
          {" "}
          {member?.joinedAt ||
            "-"}
        </div>

        <div>
          멤버십 :
          {" "}
          {member?.membership ||
            "FREE"}
        </div>
      </div>
    </section>
  );
}