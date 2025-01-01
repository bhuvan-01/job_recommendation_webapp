import React from "react";
import { FaWhatsapp, FaDiscord, FaInstagram } from "react-icons/fa";

const Community = () => {
  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Join the Jobwipe Community
          </h1>
          <p className="mt-4 text-lg leading-6 text-gray-600">
            Connect with us on our social media platforms and be part of our
            growing community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WhatsApp */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaWhatsapp className="mx-auto text-green-500 h-16 w-16" />
            <h3 className="mt-6 text-2xl font-semibold text-gray-900">
              WhatsApp
            </h3>
            <p className="mt-4 text-gray-600">
              Stay connected with us through our WhatsApp group. Get the job
              alerts and updates directly on your phone.
            </p>
            <a
              href="https://chat.whatsapp.com/BknCVf4cmxNLl2XMBvwujV"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Join Our WhatsApp
            </a>
          </div>

          {/* Discord */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaDiscord className="mx-auto text-indigo-600 h-16 w-16" />
            <h3 className="mt-6 text-2xl font-semibold text-gray-900">
              Discord
            </h3>
            <p className="mt-4 text-gray-600">
              Join our Discord server for live chats, discussions, and
              networking with fellow job seekers and professionals.
            </p>
            <a
              href="https://discord.gg/EGqBm3kV"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Join Our Discord
            </a>
          </div>

          {/* Instagram */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaInstagram className="mx-auto text-pink-500 h-16 w-16" />
            <h3 className="mt-6 text-2xl font-semibold text-gray-900">
              Instagram
            </h3>
            <p className="mt-4 text-gray-600">
              Follow us on Instagram to get behind-the-scenes insights, career
              tips, and more visual content.
            </p>
            <a
              href="https://www.instagram.com/jobwipe?igsh=Z3EyZm01emRhbDQ5"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Follow Us on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
