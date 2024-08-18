import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example logic for email validation (you can customize it)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Replace with actual API call to subscribe the user
    console.log('Subscribing email:', email);

    // Reset the form and show success message
    setEmail('');
    setMessage('Thank you for subscribing to our newsletter!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Subscribe to Our Newsletter</h2>
      <p className="text-center text-gray-600 mb-6">Stay updated with our latest news and offers. Enter your email below:</p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
        >
          Subscribe
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
};

export default Newsletter;
