import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestions } from "../services/opentdb";
import QuestionCard from "../components/QuestionCard";

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

  function submit() {
    if (chosen == null) return;
    setRevealed(true);
    if (chosen === questions[idx].correct_answer) setScore(s => s + 1);
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
      <div className="text-sm text-gray-700">Score: <b>{score}</b></div>
    </div>
  );
}
