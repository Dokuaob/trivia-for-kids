import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestions } from "../services/opentdb";
import { decodeHtml } from "../utils/decode";
import { shuffle } from "../utils/shuffle";

export default function Quiz() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const settings = state || { amount: 5, difficulty: "easy", category: 9 };

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let on = true;
    (async () => {
      setErr(""); setLoading(true);
      try {
        const qs = await getQuestions(settings);
        if (on) setQuestions(qs);
      } catch (e) {
        if (on) setErr(e.message || "Failed to load questions");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => (on = false);
  }, [settings]);

  const current = questions[idx];
  const answers = useMemo(() => current ? shuffle([...current.incorrect_answers, current.correct_answer]) : [], [current]);

  function submit() {
    if (chosen == null) return;
    setRevealed(true);
    if (chosen === current.correct_answer) setScore(s => s + 1);
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(i => i + 1);
      setChosen(null);
      setRevealed(false);
    } else {
      navigate("/score", { state: { total: questions.length, score } });
    }
  }

  if (loading) return <div>Loading questions…</div>;
  if (err) return <div className="text-red-600">{err}</div>;
  if (!questions.length) return <div>No questions found. Try different settings.</div>;

  return (
    <div className="max-w-2xl mx-auto grid gap-4">
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="text-sm text-gray-500 mb-2">Question {idx + 1} of {questions.length}</div>
        <h2 className="text-lg font-semibold mb-4">{decodeHtml(current.question)}</h2>

        <div className="grid gap-3 mb-4">
          {answers.map((ans, i) => {
            const isCorrect = ans === current.correct_answer;
            const isChosen = ans === chosen;
            const classes = [
              "border rounded-xl px-4 py-3 text-left focus:outline-none focus:ring",
              isChosen ? "ring-2" : "",
              revealed && isChosen && isCorrect ? "bg-green-100 border-green-400" : "",
              revealed && isChosen && !isCorrect ? "bg-red-100 border-red-400" : "",
              revealed && !isChosen && isCorrect ? "bg-green-50 border-green-300" : "",
            ].join(" ");
            return (
              <button key={i} disabled={revealed} onClick={() => setChosen(ans)} className={classes}>
                {decodeHtml(ans)}
              </button>
            );
          })}
        </div>

        {!revealed ? (
          <button onClick={submit} disabled={chosen == null} className="bg-blue-600 disabled:opacity-60 text-white rounded-xl px-4 py-2">
            Submit
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {chosen === current.correct_answer ? "Correct! 🎉" : "Not quite. Keep going!"}
            </div>
            <button onClick={next} className="border rounded-xl px-4 py-2">Next</button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-700">Score: <b>{score}</b></div>
    </div>
  );
}
