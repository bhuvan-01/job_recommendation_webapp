import React from 'react';
import About1 from '../assets/images/about1.jpg';
import About2 from '../assets/images/about2.jpeg';

const AboutUs = () => {
  return (
    <div className="bg-gray-50 py-10">
      {/* Hero Section */}
      <div className="relative bg-indigo-600">
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-50"
            src={About1}
            alt="Jobwipe"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Welcome to Jobwipe
          </h1>
          <p className="mt-4 text-lg text-indigo-200 sm:max-w-xl sm:mx-auto">
            Discover the power of opportunity. We connect people with their dream jobs, and businesses with their future stars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Jobwipe
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-600">
            At Jobwipe, we are passionate about creating opportunities for job seekers and employers alike. Here’s more about our story.
          </p>
        </div>

        <div className="mt-16">
          <div className="lg:flex lg:gap-16 lg:items-center">
            <div className="lg:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900">Our Company</h3>
              <p className="mt-4 text-lg text-gray-600">
                Founded in 2024, Jobwipe was born out of a desire to bridge the gap between talented job seekers and innovative companies. We are committed to delivering a platform that not only provides jobs but creates lasting career paths.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                With a focus on integrity, innovation, and community, Jobwipe has grown to become a trusted name in the recruitment industry, serving thousands of professionals and organizations globally.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <img
                className="w-full rounded-lg shadow-lg"
                src={About2}
                alt="Company"
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="lg:flex lg:gap-16 lg:items-center lg:flex-row-reverse">
            <div className="lg:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
              <p className="mt-4 text-lg text-gray-600">
                Jobwipe’s mission is simple: to empower every individual and organization to achieve more. We aim to provide the tools, resources, and connections that will lead to successful career journeys and business growth.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We believe in the power of people and are dedicated to creating a marketplace that supports and inspires future leaders, innovators, and changemakers.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <img
                className="w-full rounded-lg shadow-lg"
                src={About1}
                alt="Mission"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
