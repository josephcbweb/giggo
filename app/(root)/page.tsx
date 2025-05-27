import { auth } from "@/auth";
import Contact from "@/components/Home/Contact";
import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import HeroFirst from "@/components/Home/HeroFirst";
import How from "@/components/Home/How";
import PlatformAdvantages from "@/components/Home/PlatformAdvantages";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <div className="overflow-x-hidden">
        <HeroFirst username={session?.user?.name || ""} />
        <PlatformAdvantages />
        <How />
        <Features />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
