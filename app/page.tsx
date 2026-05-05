import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
        {/* Public Chat Widget Preview Section could go here */}
        <section id="demo" className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Experience the AI</h2>
            <p className="text-slate-600 mb-10">
              Our AI doesn't just book appointments—it handles conversations like a human expert.
              Try our demo agent below.
            </p>
            <div className="aspect-video rounded-3xl gradient-brand flex items-center justify-center text-white text-xl font-bold shadow-2xl">
              [ Interactive AI Booking Widget Placeholder ]
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
