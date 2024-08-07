import React, { useState, useEffect } from 'react';

const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats" },
  { text: "Whether you think you can or you think you can’t, you’re right.", author: "Henry Ford" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" }
];

const Quotes = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <div className="flex items-center justify-center bg-blue-600 py-20">
      <div className="text-center text-white p-6">
        <h2 className="text-2xl font-bold mb-2 text-black">Staff Quotes</h2>
        <hr className="border-blue-400 w-1/3 mx-auto mb-4" />
        <div className="relative inline-block max-w-2xl">
          <span className="text-6xl text-black absolute -left-8 top-0">&ldquo;</span>
          <p className="text-lg md:text-xl font-semibold z-10 px-12">
            {quotes[currentQuoteIndex].text}
          </p>
          <span className="text-6xl text-black absolute -right-8 bottom-0">&rdquo;</span>
        </div>
        <footer className="mt-2 text-lg md:text-xl font-bold text-white">
          - {quotes[currentQuoteIndex].author}
        </footer>
        <div className="flex justify-center mt-2 space-x-2">
          {quotes.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentQuoteIndex ? 'bg-white' : 'bg-gray-600'}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quotes;
