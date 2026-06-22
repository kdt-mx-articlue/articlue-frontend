import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function ReportRadarChart({
  metrics,
}) {
  if (!metrics) {
    return null;
  }

  const data = [
    {
      subject: "비즈니스",
      score:
        metrics.business_fit.score,
    },

    {
      subject: "문제 해결",
      score:
        metrics
          .action_result_fit.score,
    },

    {
      subject: "기술 스택",
      score:
        metrics.tech_stack_fit.score,
    },

    {
      subject: "요구사항",
      score:
        metrics.requirement_fit
          .score,
    },

    {
      subject: "문화 적합도",
      score:
        metrics.culture_fit.score,
    },
  ];

  return (
    <div
      className="
        mt-6
        h-[300px]
        w-full
      "
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <RadarChart data={data}>
          <PolarGrid />

          <PolarAngleAxis
            dataKey="subject"
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={5}
          />

          <Tooltip
            formatter={(value) => [
              `${Number(
                value
              ).toFixed(2)}%`,
              "점수",
            ]}
          />

          <Radar
            name="점수"
            dataKey="score"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}