// Decode HTML entities returned by the API (e.g., &quot; → ")
export function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
