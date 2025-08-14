import { useMemo } from "react";
import { decodeHtml } from "../utils/decode";
import { shuffle } from "../utils/shuffle";

export default function QuestionCard({
  q,               // current question object
  index,           // index of current question (0-based)
  total,           // total number of questions
  chosen,          // chosen answer
  setChosen,       // setter for chosen answer
  revealed,        // whether feedback is shown
  onSubmit,        // function to call when Submit is clicked
  onNext           // function to call when Next is clicked
}) {
  const answers = useMemo(
    () => shuffle([...q.incorrect_answers, q.correct_answer]),
    [q]
  );

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      {/* Progress */}
      <div className="text-sm text-gray-500 mb-2">
        Question {index + 1} of {total}
      </div>

      {/* Question text */}
      <h2 className="text-lg font-semibold mb-4">{decodeHtml(q.question)}</h2>

      {/* Answer buttons */}
      <div className="grid gap-3 mb-4">
        {answers.map((ans, i) => {
          const isCorrect = ans === q.correct_answer;
          const isChosen = ans === chosen;
          const classes = [
            "border rounded-xl px-4 py-3 text-left focus:outline-none focus:ring transition-colors duration-200",
            isChosen ? "ring-2" : "",
            revealed && isChosen && isCorrect ? "bg-green-100 border-green-400" : "",
            revealed && isChosen && !isCorrect ? "bg-red-100 border-red-400" : "",
            revealed && !isChosen && isCorrect ? "bg-green-50 border-green-300" : "",
            !revealed && "hover:bg-gray-50"
          ].join(" ");

          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => setChosen(ans)}
              className={classes}
            >
              {decodeHtml(ans)}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      {!revealed ? (
        <button
          onClick={onSubmit}
          disabled={chosen == null}
          className="bg-blue-600 disabled:opacity-60 text-white rounded-xl px-4 py-2"
        >
          Submit
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {chosen === q.correct_answer ? "Correct! 🎉" : "Not quite. Keep going!"}
          </div>
          <button
            onClick={onNext}
            className="border rounded-xl px-4 py-2 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
