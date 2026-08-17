export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-5">
        <span className="font-serif text-2xl tracking-[0.3em] text-ink">AURELIA</span>
        <span className="h-px w-24 overflow-hidden bg-line">
          <span className="block h-full w-1/2 animate-[marquee_1.2s_linear_infinite] bg-gold" />
        </span>
      </div>
    </div>
  );
}
