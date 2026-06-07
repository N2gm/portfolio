import NavigationBar from "./components/NavigationBar";
import HeroSection from "./components/HeroSection";
import MobileHeroSection from "./components/MobileHeroSection";
import WorkSection from "./components/WorkSection";

export default function App() {
  return (
    <div style={{ background: "#050508", minHeight: "100vh", scrollPaddingTop: "80px" }}>
      <NavigationBar />
      {/* Desktop hero — ≥768px */}
      <div className="hero-desktop" style={{ display: "none" }}>
        <HeroSection />
      </div>
      {/* Mobile hero — <768px */}
      <div className="hero-mobile">
        <MobileHeroSection />
      </div>
      <style>{`
        @media (min-width: 768px) {
          .hero-desktop { display: block !important; }
          .hero-mobile  { display: none !important; }
        }
        @media (max-width: 767px) {
          .hero-desktop { display: none !important; }
          .hero-mobile  { display: block !important; }
        }
      `}</style>
      <main id="main-content">
        <WorkSection />
      </main>
    </div>
  );
}
