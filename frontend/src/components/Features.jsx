const featuresData = [
  {
    id: 1,
    title: 'Smart Job Matching',
    desc: `
    Our advanced algorithms match you with jobs that fit your
    skills, experience, and preferences, making your job search
    efficient and targeted.
    `,
    imgURL:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 2,
    title: 'Easy Application Process',
    desc: `Apply to multiple jobs with a single click. Keep track of your
    applications and manage your job search effortlessly through
    your dashboard.`,
    imgURL:
      'https://images.pexels.com/photos/627533/pexels-photo-627533.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 3,
    title: 'Top Employers',
    desc: `Connect with leading companies across various industries. Our
    platform features verified employers, ensuring you apply to
    reputable and reliable companies.`,
    imgURL:
      'https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 4,
    title: 'Career Resources',
    desc: `Access a wealth of resources to enhance your career, including resume
    building tips, interview preparation guides, and professional
    development courses.`,
    imgURL:
      'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const Features = () => (
  <section className='bg-white py-16'>
    <div className='container w-[95%] max-w-[1200px] mx-auto p-0'>
      <h2 className='text-4xl font-semibold text-center mb-12'>
        Why Choose Our Platform?
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {featuresData.map((feature) => (
          <div
            key={feature.id}
            className='mb-8 rounded-md shadow-sm hover:shadow-md'
          >
            <div className='bg-gray-50 p-4 rounded-lg shadow-md h-full flex flex-col'>
              <div className='mb-4'>
                <img
                  src={feature.imgURL}
                  alt='Smart Job Matching'
                  className='mx-auto rounded-md'
                />
              </div>

              <div>
                <h3 className='text-xl font-bold mb-2'>{feature.title}</h3>
                <p className='text-gray-500'>{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
