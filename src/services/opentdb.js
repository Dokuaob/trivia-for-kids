const BASE = "https://opentdb.com";

const RESP_MSG = {
  0: "OK",
  1: "No questions for that selection. Try fewer questions or a different difficulty/category.",
  2: "Invalid parameter sent to the API.",
  3: "Session token not found (not used in this app).",
  4: "Session token empty (not used in this app).",
};

export async function getCategories() {
  const res = await fetch(`${BASE}/api_category.php`);
  if (!res.ok) throw new Error("Network error while fetching categories.");
  const data = await res.json();
  return data.trivia_categories || [];
}

export async function getQuestions({ amount = 5, category, difficulty = "easy" }) {
  const url = new URL(`${BASE}/api.php`);
  url.searchParams.set("amount", amount);
  url.searchParams.set("type", "multiple");
  if (category) url.searchParams.set("category", Number(category));
  if (difficulty) url.searchParams.set("difficulty", difficulty);

  let res;
  try {
    res = await fetch(url.toString());
  } catch {
    throw new Error("Network error while fetching questions. Check your internet and try again.");
  }
  if (!res.ok) throw new Error("Bad response from the API. Please try again.");

  const data = await res.json();
  if (data.response_code !== 0) {
    const msg = RESP_MSG[data.response_code] || "Unknown API error.";
    throw new Error(msg);
  }
  return data.results || [];
}
