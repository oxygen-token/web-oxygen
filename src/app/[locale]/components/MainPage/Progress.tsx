import { useTranslations } from "next-intl";

export function Progress() {
  const hometokens = useTranslations("homeTokens");

  const progress = 0; // TODO

  return (
    <section className="bg-white flex flex-col items-center text-center lg:text-start px-5 lg:px-20 pb-16 lg:pb-32">
      <p className="text-base/5 uppercase font-bold">
        {hometokens("progress-subtitle")}
      </p>
      <h2 className="text-2xl md:text-3xl/10 uppercase text-center font-bold text-teal-medium my-6 lg:my-10 lg:mb-20">
        {hometokens("progress-title")}
      </h2>

      <div className="flex flex-col lg:flex-row items-center lg:justify-center gap-20">
        <div className="relative w-[300px] min-w-[300px] aspect-square rounded-full shadow-inner p-6 bg-neutral-200">
          <div className="w-full h-full shadow-lg rounded-full bg-white flex flex-col gap-4 items-center justify-center">
            <div className="text-6xl font-bold">
              {(progress * 100).toFixed(0)}%
            </div>
            <div className="text-lg font-medium">
              {hometokens("progress-circle")}
            </div>
          </div>

          <svg
            className="absolute inset-0 mix-blend-multiply"
            width={300}
            height={300}
          >
            <circle
              cx={150}
              cy={150}
              r={150 - 12}
              className="stroke-green-light fill-none"
              strokeWidth={24}
              strokeLinecap="round"
              strokeDasharray="1 1"
              strokeDashoffset={1 - progress}
              pathLength={1}
            />
          </svg>
        </div>

        <div>
          <p className="text-base max-w-md">{hometokens("progress-text")}</p>
          <p className="mt-6">
            {hometokens("progress-span")}:{" "}
            <strong className="font-bold">
              000 {hometokens("progress-span-2")}
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}
