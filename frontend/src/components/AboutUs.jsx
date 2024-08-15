import React from 'react';
import About1 from '../assets/images/about1.jpg';
import About2 from '../assets/images/about2.jpeg'

const AboutUs = () => {
  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-600">
            Learn more about our company, mission, and the team that makes it all happen.
          </p>
        </div>

        <div className="mt-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="lg:col-start-1 lg:row-start-1">
              <h3 className="text-2xl font-semibold text-gray-900">Our Company</h3>
              <p className="mt-4 text-lg text-gray-600">
                We are committed to providing the best services to our customers. Our company was founded in 2010 with the goal of delivering high-quality products and outstanding customer service.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-start-2 lg:row-start-1">
              <img
                className="w-full rounded-lg shadow-lg"
                src={About1}
                alt="Company"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="lg:col-start-2 lg:row-start-2">
              <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
              <p className="mt-4 text-lg text-gray-600">
                Our mission is to innovate and lead in the market, providing top-notch services that enhance the lives of our customers and contribute to the community.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-2">
              <img
                className="w-full rounded-lg shadow-lg"
                src= {About2}
                alt="Mission"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-900 text-center">Meet Our Team</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis'].map((name, index) => (
              <div key={index} className="text-center">
                <img
                  className="w-32 h-32 mx-auto rounded-full"
                  src="https://via.placeholder.com/128"
                  alt={name}
                />
                <h4 className="mt-4 text-lg font-medium text-gray-900">{name}</h4>
                <p className="mt-2 text-sm text-gray-600">Position</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-900 text-center">Contact Us</h3>
          <div className="mt-6 flex justify-center">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows="3"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
