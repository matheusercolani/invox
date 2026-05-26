export function NoirBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Dark mode background */}
      <div className="absolute inset-0 bg-[#070a14] light:bg-[#f8fafc]" />
      {/* Subtle glow — hidden in light mode */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/6 blur-[100px] light:hidden" />
    </div>
  );
}
