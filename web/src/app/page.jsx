import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";

export default function Portfolio() {
  return (
    <div
      style={{
        background: "#050508",
        minHeight: "100vh",
        scrollPaddingTop: "80px",
      }}
    >
      <NavigationBar />
      <HeroSection />
      <main id="main-content">
        <WorkSection />
      </main>
    </div>
  );
}
