import { useMemo } from "react";
import { decodeHtml } from "../utils/decode";
import { shuffle } from "../utils/shuffle";

export default function QuestionCard({
  q,
  index,
  total,
  chosen,
  setChosen,
  revealed,
  onSubmit,
  onNext
}) {
  const answers = useMemo(
    () => shuffle([...q.incorrect_answers, q.correct_answer]),
    [q]
  );

  // small helper styles for the buttons
  const baseBtn =
    "w-full text-left px-4 py-3 rounded-2xl border transition " +
    "focus:outline-none focus:ring hover:-translate-y-0.5 duration-200";
  const neutral =
    baseBtn + " bg-white/90 border-gray-200 shadow-sm hover:bg-white";
  const correct =
    baseBtn + " bg-green-100 border-green-300 shadow hover:bg-green-200";
  const wrong =
    baseBtn + " bg-red-100 border-red-300 shadow hover:bg-red-200";

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl"
      /* warm, kid‑friendly background */
      style={{
        background:
          "linear-gradient(180deg, #FFF7CC 0%, #FFF 55%)"
      }}
    >
      {/* subtle confetti dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(#ffc, 1.5px, transparent 1.5px)",
          backgroundSize: "18px 18px"
        }}
      />

      {/* balloons (inline SVGs) */}
      <div className="pointer-events-none absolute -top-6 -right-4 sm:-right-8 opacity-80">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <ellipse cx="40" cy="35" rx="22" ry="28" fill="#FF7AB6"/>
          <path d="M40 63 C38 78, 52 86, 48 98" stroke="#FF7AB6" strokeWidth="3" fill="none"/>
          <ellipse cx="80" cy="30" rx="20" ry="26" fill="#6EC3FF"/>
          <path d="M80 56 C78 70, 92 78, 88 92" stroke="#6EC3FF" strokeWidth="3" fill="none"/>
        </svg>
      </div>
      <div className="pointer-events-none absolute -bottom-6 -left-6 opacity-80">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <ellipse cx="40" cy="35" rx="22" ry="28" fill="#FF9E5E"/>
          <path d="M40 63 C38 78, 52 86, 48 98" stroke="#FF9E5E" strokeWidth="3" fill="none"/>
        </svg>
      </div>

      {/* content */}
      <div className="relative">
        {/* progress pill */}
        <div className="mb-3">
          <span className="inline-block rounded-full bg-purple-600 text-white text-xs font-semibold px-3 py-1 shadow">
            Question {index + 1} / {total}
          </span>
        </div>

        {/* question text */}
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-tight text-gray-900">
          {decodeHtml(q.question)}
        </h2>

        {/* answers */}
        <div className="grid gap-3 mb-5">
          {answers.map((ans, i) => {
            const isCorrect = ans === q.correct_answer;
            const isChosen = ans === chosen;

            let classes = neutral;
            if (revealed && isChosen && isCorrect) classes = correct;
            if (revealed && isChosen && !isCorrect) classes = wrong;
            if (revealed && !isChosen && isCorrect) classes = correct;

            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setChosen(ans)}
                className={classes}
              >
                <span className="text-base sm:text-lg font-semibold">
                  {decodeHtml(ans)}
                </span>
              </button>
            );
          })}
        </div>

        {/* actions */}
        {!revealed ? (
          <button
            onClick={onSubmit}
            disabled={chosen == null}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                       bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                       text-white font-bold rounded-2xl px-6 py-3 shadow-lg
                       active:translate-y-0.5 transition"
          >
            Submit
            <span aria-hidden>⭐</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm sm:text-base font-medium text-gray-700">
              {chosen === q.correct_answer ? "Correct! 🎉 Great job." : "Not quite — you’ve got this! 💪"}
            </div>
            <button
              onClick={onNext}
              className="w-full sm:w-auto inline-flex items-center justify-center
                         border-2 border-blue-600 text-blue-700 font-bold
                         rounded-2xl px-6 py-3 bg-white hover:bg-blue-50
                         transition shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
