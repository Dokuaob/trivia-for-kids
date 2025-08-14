export default function DecorBalloons() {
  return (
    <>
      {/* top-right */}
      <div className="pointer-events-none absolute -top-4 right-4 sm:right-10 opacity-90">
        <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
          <ellipse cx="50" cy="38" rx="24" ry="30" fill="#FF9E5E"/>
          <path d="M50 66 C48 84, 62 92, 58 108" stroke="#FF9E5E" strokeWidth="3" fill="none"/>
          <ellipse cx="110" cy="34" rx="22" ry="28" fill="#6EC3FF"/>
          <path d="M110 60 C108 74, 122 84, 118 100" stroke="#6EC3FF" strokeWidth="3" fill="none"/>
          <path d="M145 18 l6 4 -2 7 -6 4 -6 -4 2 -7z" fill="#F59E0B"/>
          <path d="M15 10 l6 4 -2 7 -6 4 -6 -4 2 -7z" fill="#10B981"/>
        </svg>
      </div>
      {/* left side balloon */}
      <div className="pointer-events-none absolute bottom-20 left-6 opacity-80">
        <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
          <ellipse cx="30" cy="35" rx="18" ry="24" fill="#FF7AB6"/>
          <path d="M30 58 C28 74, 40 82, 36 100" stroke="#FF7AB6" strokeWidth="3" fill="none"/>
        </svg>
      </div>
    </>
  );
}
