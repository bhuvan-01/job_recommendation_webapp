import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Working from '@/components/Working';
import FooterWithSocialLinks from '@/components/footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Working />
      <FooterWithSocialLinks/>
    </>
  );
};

export default Home;
