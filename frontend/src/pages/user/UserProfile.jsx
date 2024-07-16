import Header from '@/components/Header';
import useUser from '@/hooks/useUser';
import EducationSection from '@/components/user/Education';
import Certifications from '@/components/user/Certifications';
import Achievements from '@/components/user/Achievements';
import Experience from '@/components/user/Experience';
import Projects from '@/components/user/Projects';
import Skills from '@/components/user/Skills';
import Resume from '@/components/user/Resume';
import Languages from '@/components/user/Languages';
import Contact from '@/components/user/Contact';
import Intro from '@/components/user/Intro';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const isLoading = useSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className='container px-0 mx-auto my-4 md:my-8 max-w-[1400px] w-[95%]'>
        <div className='block md:flex gap-4'>
          <div className='basis-full md:basis-9/12 mb-4 md:mb-0'>
            <Intro />
            <Skills skills={[]} />
            <Projects projects={[]} />
            <Experience experience={[]} />
            <EducationSection education={[]} />
            <Certifications certificationsAwards={[]} />
            <Achievements achievements={[]} />
          </div>
          <div className='basis-full md:basis-3/12'>
            <Resume />
            <Languages />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
