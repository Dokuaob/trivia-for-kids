// src/pages/Quiz.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestions } from "../services/opentdb";
import QuestionCard from "../components/QuestionCard";

export default function Quiz() {
  // settings passed from Home (fallbacks for direct URL entry)
  const { state } = useLocation();
  const navigate = useNavigate();
  const settings = state || { amount: 5, difficulty: "easy", category: 9 };

  // data & ui state
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  // per-question UI state
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);

  // NEW: store answers for review on the Score page
  // each entry: { q, chosen, correct }
  const [answers, setAnswers] = useState([]);

  // load questions for current settings
  async function load() {
    setErr("");
    setLoading(true);
    try {
      const qs = await getQuestions(settings);
      setQuestions(qs);
      // reset run state
      setIdx(0);
      setChosen(null);
      setRevealed(false);
      setScore(0);
      setAnswers([]);
    } catch (e) {
      setErr(e.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let on = true;
    (async () => {
      if (!on) return;
      await load();
    })();
    return () => {
      on = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  function submit() {
    if (chosen == null) return;
    setRevealed(true);
    const q = questions[idx];
    const isCorrect = chosen === q.correct_answer;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((a) => [...a, { q, chosen, correct: isCorrect }]);
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1);
      setChosen(null);
      setRevealed(false);
    } else {
      // finished — go to Score with review + settings so user can retake
      navigate("/score", {
        state: {
          total: questions.length,
          score,
          answers,
          settings,
        },
        replace: true,
      });
    }
  }

  // render states
  if (loading) return <div className="text-center">Loading questions…</div>;

  if (err) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="text-red-600 mb-4">{err}</div>
        <button
          onClick={load}
          className="bg-blue-600 text-white rounded-xl px-4 py-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="max-w-xl mx-auto text-center">
        No questions found. Try different settings.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto grid gap-4">
      <QuestionCard
        q={questions[idx]}
        index={idx}
        total={questions.length}
        chosen={chosen}
        setChosen={setChosen}
        revealed={revealed}
        onSubmit={submit}
        onNext={next}
      />
      <div className="text-sm text-gray-700">
        Score: <b>{score}</b>
      </div>
    </div>
  );
}
