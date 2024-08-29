import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Working from '@/components/Working';
import HiringSectors from '@/components/HiringSectors';
import Quotes from '@/components/quotes';
import FeaturedJobs from '@/components/FeaturedJobs';
// import ApplicationProcess from '@/components/ApplicationProcess';
 import FooterWithSocialLinks from '@/components/Footer'
// import AnimatedCanvas from '@/components/AnimatedCanvas';
 import ApplicationProcess from '@/components/Application';

const Home = () => {
  return (
    <>
      
      <Hero />
      <Features />
      <Quotes/>
      <HiringSectors/>
      <ApplicationProcess/>
      <FeaturedJobs/>  
      <FooterWithSocialLinks />
    </>
  );
};

export default Home;
