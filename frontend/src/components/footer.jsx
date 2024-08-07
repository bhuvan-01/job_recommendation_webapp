import { Link } from 'react-router-dom';
import { Typography } from "@material-tailwind/react";
import Logo from "./Logo";

const LINKS = [
  {
    title: "Company",
    items: [
      { name: "About us", path: "/aboutus" },
      { name: "Features", path: "/features" },
      { name: "Careers", path: "/careers" },
      { name: "News", path: "/news" },
    ],
  },
  {
    title: "Resource",
    items: [
      { name: "Blog", path: "/blog" },
      { name: "Newsletter", path: "/newsletter" },
      { name: "Help center", path: "/contactus" },
    ],
  },
];

const currentYear = new Date().getFullYear();

export default function FooterWithSocialLinks() {
  return (
    <footer className="relative w-full bg-gray-100">
      <div className="mx-auto w-full max-w-7xl px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            
            <Typography variant="h6" className="text-lg">
              JOB WIPE
              <Logo />
            </Typography>
          </div>
          {LINKS.map(({ title, items }) => (
            <ul key={title}>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-3 font-semibold"
              >
                {title}
              </Typography>
              {items.map((item) => (
                <li key={item.name}>
                  <Link to={item.path}>
                    <Typography
                      as="span" // Using span inside Link
                      color="gray"
                      className="py-1.5 block hover:text-blue-500 transition-colors"
                    >
                      {item.name}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center border-t border-blue-gray-200 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="text-center text-blue-gray-600 md:mb-0"
          >
            &copy; {currentYear} JobWipe. All Rights Reserved.
          </Typography>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Insert corrected SVGs for social links */}
            <Link to="/facebook" aria-label="Facebook">
              <svg className="h-6 w-6 fill-current text-blue-600 hover:text-blue-800" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </Link>
            <Link to="/twitter" aria-label="Twitter">
              <svg className="h-6 w-6 fill-current text-blue-400 hover:text-blue-600" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </Link>
            {/* Add other social media links here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
