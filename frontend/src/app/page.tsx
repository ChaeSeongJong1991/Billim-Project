import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import UnitManagementSection from "@/components/landing/UnitManagementSection";
import LedgerSection from "@/components/landing/LedgerSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <UnitManagementSection />
        <LedgerSection />
      </main>
      <Footer />
    </div>
  );
}
