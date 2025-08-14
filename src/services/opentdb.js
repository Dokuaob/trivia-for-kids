const BASE = "https://opentdb.com";

export async function getCategories() {
  const res = await fetch(`${BASE}/api_category.php`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.trivia_categories || [];
}

export async function getQuestions({ amount = 5, category, difficulty = "easy" }) {
  const url = new URL(`${BASE}/api.php`);
  url.searchParams.set("amount", amount);
  url.searchParams.set("type", "multiple");
  if (category) url.searchParams.set("category", category);
  if (difficulty) url.searchParams.set("difficulty", difficulty);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch questions");
  const data = await res.json();
  if (data.response_code !== 0) throw new Error("No questions found. Try different settings.");
  return data.results || [];
}
