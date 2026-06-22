export default function PaymentHistorySection({
  payments,
}) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>
          결제 내역
        </h2>
      </div>

      {payments?.length > 0 ? (
        payments.map(
          (payment) => (
            <div
              key={
                payment.paymentId
              }
              className="repeat-card"
            >
              <div>
                결제일 :
                {" "}
                {
                  payment.paymentDate
                }
              </div>

              <div>
                멤버십 :
                {" "}
                {
                  payment.membershipName
                }
              </div>

              <div>
                금액 :
                {" "}
                {
                  payment.amount
                }
                원
              </div>
            </div>
          )
        )
      ) : (
        <div className="repeat-card">
          결제 내역이
          없습니다.
        </div>
      )}
    </section>
  );
}