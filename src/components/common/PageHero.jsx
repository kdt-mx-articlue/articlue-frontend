export default function PageHero({
  badge,
  subBadge,

  title,
  description,

  statTitle,
  statValue,
  statDescription,

  progressValue = null,
}) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[36px]
        bg-gradient-to-r
        from-blue-700
        via-blue-600
        to-blue-500
        px-7
        py-6
        text-white
      "
    >
      <div
        className="
          absolute
          right-[-80px]
          top-[-80px]
          h-[220px]
          w-[200px]
          rounded-full
          bg-white/10
        "
      />

      <div
        className="
          absolute
          right-[80px]
          top-[-100px]
          h-[180px]
          w-[180px]
          rounded-full
          bg-white/5
        "
      />

      <div
        className="
          relative
          flex
          items-center
          justify-between
          gap-8
        "
      >
        <div className="max-w-[520px]">

          <div className="mb-4 flex gap-3">

            {badge && (
              <div
                className="
                  rounded-full
                  bg-white/10
                  px-4
                  py-2
                  text-xs
                  font-black
                  backdrop-blur
                "
              >
                {badge}
              </div>
            )}

            {subBadge && (
              <div
                className="
                  rounded-full
                  bg-white/10
                  px-4
                  py-2
                  text-xs
                  font-black
                  backdrop-blur
                "
              >
                {subBadge}
              </div>
            )}

          </div>

          <h1
            className="
              text-[32px]
              font-black
              leading-tight
            "
          >
            {title}
          </h1>

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-blue-50
            "
          >
            {description}
          </p>

        </div>

        <div
          className="
            w-[240px]
            rounded-[28px]
            border
            border-white/20
            bg-white/10
            p-5
            backdrop-blur
          "
        >
          <div
            className="
              text-xs
              font-black
              text-blue-100
            "
          >
            {statTitle}
          </div>

          <div
            className="
              mt-2
              text-[48px]
              font-black
              leading-none
            "
          >
            {statValue}
          </div>

          {progressValue !== null && (
            <div
              className="
                mt-4
                h-3
                rounded-full
                bg-white/20
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-green-200
                "
                style={{
                  width: `${progressValue}%`,
                }}
              />
            </div>
          )}

          <p
            className="
              mt-4
              text-xs
              leading-6
              text-blue-50
            "
          >
            {statDescription}
          </p>

        </div>

      </div>
    </section>
  );
}