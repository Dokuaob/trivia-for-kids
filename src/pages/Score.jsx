import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Score() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const total = state?.total ?? 0;
  const score = state?.score ?? 0;
  const pct = total ? Math.round((score / total) * 100) : 0;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">Congratulations!</h1>
      <p className="text-gray-700 mb-6">You scored <b>{score}</b> out of <b>{total}</b> ({pct}%).</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white rounded-xl px-4 py-2">Retake Quiz</button>
        <Link to="/" className="border rounded-xl px-4 py-2">Go to Home</Link>
      </div>
    </div>
  );
}
