const steps = [
  {
    number: '1',
    title: 'Create an Account',
    description: 'Sign up and create your profile in a few easy steps.',
  },
  {
    number: '2',
    title: 'Search for Jobs',
    description: 'Browse job listings that match your skills and preferences.',
  },
  {
    number: '3',
    title: 'Apply & Get Hired',
    description: 'Submit your applications and get hired by top employers.',
  },
];

const Working = () => {
  return (
    <section className='bg-gray-100 py-12'>
      <div className='max-w-screen-xl mx-auto text-center'>
        <h2 className='text-3xl font-bold mb-6'>How It Works</h2>
        <div className='flex flex-wrap justify-around'>
          {steps.map((step, index) => (
            <div key={index} className='max-w-xs p-4'>
              <div className='text-blue-600 text-4xl mb-4'>{step.number}</div>
              <h3 className='text-xl font-bold mb-2'>{step.title}</h3>
              <p className='text-gray-600'>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Working;
