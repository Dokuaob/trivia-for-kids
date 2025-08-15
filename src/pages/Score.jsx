import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { decodeHtml } from "../utils/decode";

const HISTORY_KEY = "tfk_history_v1";

export default function Score() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const total = state?.total ?? 0;
  const score = state?.score ?? 0;
  const answers = state?.answers ?? [];
  const settings = state?.settings ?? null;
  const percent = total ? Math.round((score / total) * 100) : 0;

  // save one history entry per run (guard dev double-effect)
  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current || !total) return;
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      amount: settings?.amount ?? total,
      difficulty: settings?.difficulty ?? "easy",
      category: settings?.category ?? null,
      score,
      percent,
    };
    const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...list].slice(0, 50)));
    savedRef.current = true;
  }, [total, score, percent, settings]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Congrats card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center mb-6">
        <h1 className="text-3xl font-extrabold mb-2">Congratulations!</h1>
        <p className="text-gray-700 mb-4">You scored <b>{score}</b> out of <b>{total}</b> ({percent}%).</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {settings && (
            <button
              onClick={() => navigate("/quiz", { state: settings })}
              className="bg-blue-600 text-white rounded-2xl px-5 py-3 font-bold"
            >
              Retake Quiz
            </button>
          )}
          <Link to="/" className="border-2 border-blue-600 text-blue-700 rounded-2xl px-5 py-3 font-bold">
            Go to Home
          </Link>
          <Link to="/history" className="border-2 border-emerald-600 text-emerald-700 rounded-2xl px-5 py-3 font-bold">
            View History
          </Link>
        </div>
      </div>

      {/* Review list */}
      <div className="grid gap-3">
        {answers.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold">{decodeHtml(a.q.question)}</div>
              <span className={`text-sm font-bold ${a.correct ? "text-emerald-700" : "text-red-700"}`}>
                {a.correct ? "✓ Correct" : "✗ Incorrect"}
              </span>
            </div>
            <div className="mt-2 text-sm">
              <div>Your answer: <b>{decodeHtml(a.chosen)}</b></div>
              {!a.correct && (
                <div>Correct answer: <b>{decodeHtml(a.q.correct_answer)}</b></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
