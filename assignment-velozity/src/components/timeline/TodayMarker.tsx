export function TodayMarker({ year, month }: { year: number, month: number }) {
  const today = new Date();
  
  if (today.getFullYear() !== year || today.getMonth() !== month) return null;
  
  const dayOffset = today.getDate() - 1;
  const DAY_WIDTH = 40;
  
  const leftPos = dayOffset * DAY_WIDTH + (DAY_WIDTH / 2);
  
  return (
    <div 
      className="absolute top-0 bottom-0 pointer-events-none z-10"
      style={{ left: `${leftPos}px` }}
    >
      <div className="w-px h-full border-l-2 border-dashed border-red-500" />
      <div className="absolute top-1 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
        TODAY
      </div>
    </div>
  );
}
