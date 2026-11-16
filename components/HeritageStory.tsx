import Image from "next/image";
import { Crown, Sparkles } from "lucide-react";

export default function HeritageStory() {
  return (
    <section id="heritage" className="border-b border-rule bg-paper py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* Photographic Presentation */}
          <div
            data-slot="heritage"
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-gold/50 bg-paper-2 shadow-md"
          >
            <Image
              src="/images/2026-11-03-taj-mahal7409450.jpg"
              alt="Mughal architectural heritage inspiring Sultan's Kacchi Paris culinary craft"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-[var(--radius-card)] border border-gold/30 bg-white/95 p-4 backdrop-blur-md shadow-sm">
              <span className="font-display text-sm font-bold text-accent block">
                The Dum Pukht Royal Tradition
              </span>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Sealed copper degs, pure ghee, and slow steam cooking over wood fire coals without artificial colours.
              </p>
            </div>
          </div>

          {/* Editorial Text */}
          <div className="flex flex-col items-start">
            <h2 className="font-display text-section-head font-bold text-accent">
              Mughal Banquet Heritage in Paris
            </h2>

            <p className="mt-4 text-base leading-relaxed text-ink-2 max-w-[55ch]">
              Kacchi biryani originated in the imperial Mughal courts, where raw cuts of marinated spring lamb were layered under fragrant basmati and sealed with flour dough. Steam alone coaxes tenderness from the meat and perfumed richness from the rice.
            </p>

            <p className="mt-4 text-base leading-relaxed text-ink-2 max-w-[55ch]">
              At Sultan’s Kacchi Paris, we honour this uncompromising culinary manuscript daily. We pair French heritage butchery with hand-ground spices and aged saffron, delivering an authentic feast packaged with care for takeaway dining across Paris.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-rule pt-6 w-full">
              <div className="luxury-card p-4 bg-paper-2">
                <span className="text-xs text-muted block font-medium">Grain Selection</span>
                <span className="font-display text-base font-bold text-accent mt-1 block">Aged Kalijeera & Basmati</span>
              </div>
              <div className="luxury-card p-4 bg-paper-2">
                <span className="text-xs text-muted block font-medium">Halal Purity</span>
                <span className="font-display text-base font-bold text-accent mt-1 block">100% Certified Paris</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
