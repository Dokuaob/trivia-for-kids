// ...imports stay the same

export default function Quiz() {
  // ...state stays the same

  async function load() {
    setErr(""); setLoading(true);
    try {
      const qs = await getQuestions(settings);
      setQuestions(qs);
      setIdx(0);
      setChosen(null);
      setRevealed(false);
      setScore(0);
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
    return () => (on = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // ...
  if (loading) return <div>Loading questions…</div>;
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
  if (!questions.length) return <div>No questions found. Try different settings.</div>;

  // ...rest of component unchanged
}
