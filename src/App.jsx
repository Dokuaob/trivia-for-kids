import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Score from "./pages/Score";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
<header className="bg-white/90 backdrop-blur border-b">
  <div className="max-w-4xl mx-auto px-4 py-3">
    <a href="/" className="text-lg font-extrabold tracking-tight">
      <span className="text-purple-700">Trivia</span>{" "}
      <span className="text-yellow-600">for</span>{" "}
      <span className="text-emerald-600">Kids</span>
    </a>
  </div>
</header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/score" element={<Score />} />
        </Routes>
      </main>
    </div>
  );
}
