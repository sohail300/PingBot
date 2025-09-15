export function RenderShowcase() {
  return (
    <section className="w-full bg-black border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Say bye to screens like these
          </h2>
        </div>

        <div className="relative rounded-2xl border border-[#00e0ff] bg-neutral-900/40 p-2 overflow-hidden">
          <img
            src="/render.png"
            alt="Render warm-up logs — service waking up prevented"
            className="w-full h-auto rounded-xl"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
