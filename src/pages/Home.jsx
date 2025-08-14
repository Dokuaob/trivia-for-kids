import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/opentdb";

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
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-bold mb-1">Trivia for Kids</h1>
      <p className="text-gray-600 mb-5">Pick your settings to start a quiz.</p>

      {loading && <div>Loading categories…</div>}
      {err && <div className="text-red-600">{err}</div>}

      {!loading && !err && (
        <form onSubmit={start} className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Number of Questions (3–20)</span>
            <input
              type="number" min="3" max="20"
              value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              className="border rounded-lg px-3 py-2" required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Difficulty</span>
            <select
              value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </label>

          <div className="grid gap-2">
            <span className="text-sm font-medium">Category</span>
            <input
              placeholder="Search categories (e.g., science)"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-3 py-2" required
            >
              <option value="" disabled>Select a category</option>
              {filtered.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {filtered.length === 0 && (
              <div className="text-sm text-gray-500">No topics found. Try another keyword.</div>
            )}
          </div>

          <button type="submit" className="mt-2 bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700">
            Start Quiz
          </button>
        </form>
      )}
    </div>
  );
}
