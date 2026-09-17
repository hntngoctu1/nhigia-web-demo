import Hero from "@/components/Hero";
import AudienceSplit from "@/components/AudienceSplit";
import ServiceSections from "@/components/ServiceSections";
import VisaCountries from "@/components/VisaCountries";
import Process from "@/components/Process";
import Trust from "@/components/Trust";
import Testimonials from "@/components/Testimonials";
import News from "@/components/News";
import HomeFaq from "@/components/HomeFaq";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  return (
    <>
      <main id="main-content">
        <Hero />
        <AudienceSplit />
        <ServiceSections />
        <VisaCountries />
        <Process />
        <Trust />
        <Testimonials />
        <News />
        <HomeFaq />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
