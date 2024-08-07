import React, { useState } from 'react';

// Import images from the assets folder
import technologyImage from '../assets/images/technology.jpg';
import healthcareImage from '../assets/images/healthcare.jpg';
import financeImage from '../assets/images/finance.jpg';
import educationImage from '../assets/images/education.jpg';
import retailImage from '../assets/images/retail.jpg';
import hospitalityImage from '../assets/images/hospitality.jpg';

const sectors = [
  { name: 'Technology', image: technologyImage, description: 'We are looking for skilled software engineers, data scientists, and IT professionals.' },
  { name: 'Healthcare', image: healthcareImage, description: 'Join our team of doctors, nurses, and healthcare administrators to make a difference in patient care.' },
  { name: 'Finance', image: financeImage, description: 'We need financial analysts, accountants, and auditors to help manage and grow our financial operations.' },
  { name: 'Education', image: educationImage, description: 'Become a part of our educational staff, including teachers, administrators, and counselors.' },
  { name: 'Retail', image: retailImage, description: 'We are hiring retail managers, sales associates, and customer service representatives.' },
  { name: 'Hospitality', image: hospitalityImage, description: 'Join our hospitality team as chefs, hotel managers, and event coordinators.' },
];

const HiringSectors = () => {
  const [hoveredSector, setHoveredSector] = useState(null);

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-center mb-8">We are Hiring in the Following Sectors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {sectors.map((sector, index) => (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setHoveredSector(index)}
            onMouseLeave={() => setHoveredSector(null)}
          >
            <img
              src={sector.image}
              alt={sector.name}
              className="w-full h-60 object-cover rounded-lg"
            />
            <div className={`absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-75 text-white text-center py-2 transition-opacity duration-300 ${hoveredSector === index ? 'opacity-0' : 'opacity-100'}`}>
              <h2 className="text-xl font-bold">{sector.name}</h2>
            </div>
            <div className="absolute inset-0 bg-blue-500 bg-opacity-75 flex flex-col justify-center items-center text-white text-center p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h2 className="text-2xl font-bold mb-2">{sector.name}</h2>
              <p className="text-lg">{sector.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiringSectors;