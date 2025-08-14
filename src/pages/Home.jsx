import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/opentdb";
import FunTitle from "../components/FunTitle";
import DecorBalloons from "../components/DecorBalloons";

export default function Home() {
  const [amount, setAmount] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let on = true;
    (async () => {
      setErr(""); setLoading(true);
      try {
        const list = await getCategories();
        if (on) setCategories(list);
      } catch {
        if (on) setErr("Could not load categories. Check your connection.");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => (on = false);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  function start(e) {
    e.preventDefault();
    if (amount < 3 || amount > 20) return alert("Choose between 3 and 20 questions.");
    if (!category) return alert("Please select a category.");
    navigate("/quiz", { state: { amount, difficulty, category: Number(category) } });
  }

  return (
    <div className="relative min-h-[85vh] polka-bg">
      <DecorBalloons />
      <div className="max-w-3xl mx-auto px-4 pt-8 md:pt-14">
        <FunTitle />
        <p className="text-center text-gray-800 font-semibold mt-2">
          Fun learning through play! ✨
        </p>

        <div className="mt-6 md:mt-10 max-w-xl mx-auto card-soft p-6 md:p-8">
          {loading && <div>Loading categories…</div>}
          {err && <div className="text-red-600">{err}</div>}
          {!loading && !err && (
            <form onSubmit={start} className="grid gap-4">
              <label className="grid gap-1">
                <span className="text-sm font-bold text-gray-700">Number of Questions (3–20)</span>
                <input
                  type="number" min="3" max="20"
                  value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                  className="border rounded-2xl px-4 py-3 shadow-sm focus:ring focus:outline-none"
                  required
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-bold text-gray-700">Difficulty</span>
                <select
                  value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                  className="border rounded-2xl px-4 py-3 shadow-sm focus:ring focus:outline-none"
                >
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                </select>
              </label>

              <div className="grid gap-2">
                <span className="text-sm font-bold text-gray-700">Category</span>
                <input
                  placeholder="Search categories (e.g., science)"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-2xl px-4 py-3 shadow-sm focus:ring focus:outline-none"
                />
                <select
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="border rounded-2xl px-4 py-3 shadow-sm focus:ring focus:outline-none"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {filtered.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {filtered.length === 0 && (
                  <div className="text-sm text-gray-600">No topics found. Try another keyword.</div>
                )}
              </div>

              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center gap-2
                           bg-blue-600 hover:bg-blue-700 text-white text-lg font-extrabold
                           rounded-2xl px-6 py-3 shadow-lg active:translate-y-0.5 transition"
              >
                Start Quiz 🎈
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
