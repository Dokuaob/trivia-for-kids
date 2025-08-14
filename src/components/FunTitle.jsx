export default function FunTitle() {
  const base = "inline-block font-extrabold tracking-tight drop-shadow";
  const outline = {
    textShadow:
      "-2px -2px 0 #1f2937, 2px -2px 0 #1f2937, -2px 2px 0 #1f2937, 2px 2px 0 #1f2937",
  };
  return (
    <h1 className="text-4xl sm:text-6xl leading-tight text-center">
      <span className={`${base} text-purple-500`} style={outline}>TRIVIA</span>{" "}
      <span className={`${base} text-yellow-500`} style={outline}>FOR</span>{" "}
      <span className={`${base} text-emerald-500`} style={outline}>KIDS</span>
    </h1>
  );
}
