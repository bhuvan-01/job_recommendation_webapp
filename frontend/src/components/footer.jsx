import { Link } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import Logo from "./Logo";

const LINKS = [
  {
    title: "Company",
    items: [
      { name: "About us", path: "/aboutus" },
      { name: "Features", path: "/features" },
    
    ],
  },
  {
    title: "Resource",
    items: [
      { name: "Newsletter", path: "/newsletters" },
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

            {/* WhatsApp */}
            <a
              href="https://chat.whatsapp.com/BknCVf4cmxNLl2XMBvwujV"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <svg
                className="h-6 w-6 fill-current text-green-500 hover:text-green-700"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2c5.523 0 10 4.477 10 10 0 2.378-.823 4.566-2.208 6.3L21.95 22l-3.593-.951A9.942 9.942 0 0112 22C6.477 22 2 17.523 2 12S6.477 2 12 2zm.055 2c-4.349 0-7.87 3.537-7.87 7.879 0 1.392.364 2.713 1.056 3.855l-.705 2.579 2.634-.694a7.865 7.865 0 003.872 1.046c4.349 0 7.878-3.53 7.878-7.878S16.404 4 12.055 4zm-.012 2.055c1.79 0 3.576.714 4.878 2.006 1.302 1.292 2.006 3.074 2.006 4.878s-.704 3.586-2.006 4.878c-1.292 1.302-3.074 2.006-4.878 2.006a6.907 6.907 0 01-3.711-1.054l-.236-.141-1.175.311.31-1.173-.141-.237c-.686-1.16-1.06-2.479-1.054-3.711.002-1.804.708-3.586 2.006-4.878 1.302-1.292 3.088-2.006 4.878-2.006zM12.69 6.933c-1.104-.221-2.248.456-2.973 1.13-.724.674-1.203 1.59-1.159 2.549.045.958.55 1.794 1.193 2.594.467.591 1.028 1.122 1.719 1.482.538.283 1.164.491 1.809.45.645-.04 1.214-.389 1.531-.951.316-.563.293-1.317-.074-1.83a6.98 6.98 0 00-.65-.916c-.282-.35-.724-.758-1.142-1.013-.458-.277-.946-.536-1.441-.636-.495-.1-.935.092-1.106.45-.172.359.002.814.224 1.117.223.303.521.57.817.844.396.36.97.667 1.527.558.349-.072.734-.365.875-.695.14-.331.078-.726-.17-1.042-.356-.474-.832-.926-1.317-1.344-.411-.363-.849-.72-1.31-.962-.461-.242-1.044-.273-1.424.071-.38.344-.624.923-.56 1.473.064.55.404 1.053.747 1.479.689.856 1.605 1.571 2.579 2.023.825.39 1.77.465 2.607.199.837-.265 1.533-.946 1.698-1.784.167-.837-.173-1.692-.773-2.25a13.424 13.424 0 00-1.326-1.003 7.537 7.537 0 00-2.01-.955z"
                />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/jobwipe?igsh=Z3EyZm01emRhbDQ5 "
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                className="h-6 w-6 fill-current text-pink-500 hover:text-pink-700"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2.25a2.75 2.75 0 110 5.5 2.75 2.75 0 010-5.5zM18 6.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
                />
              </svg>
            </a>
            <a
              href="https://discord.gg/8Fr4yS7U  "
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <svg
                className="h-6 w-6 fill-current text-indigo-600 hover:text-indigo-800"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2c5.523 0 10 4.477 10 10 0 4.873-3.509 8.913-8.088 9.786l-.096-.11c-.044-.05-.085-.103-.126-.156-.553-.725-.86-1.482-.994-2.296-.032-.187-.06-.374-.08-.562-.062-.617-.06-1.236.01-1.854.127-1.178.445-2.322 1.063-3.352.03-.048.062-.096.095-.144.154-.226.371-.47.636-.71 1.053-.963 2.506-1.492 3.972-1.29l-.045-.19c-.366-.099-.747-.147-1.126-.173-.986-.067-1.963-.014-2.924.25a12.948 12.948 0 00-2.472.911 10.072 10.072 0 00-1.19.611c-.012-.01-.024-.02-.036-.03C10.743 9.833 10 7.978 10 6.75c0-.496.108-.97.3-1.406a2.99 2.99 0 011.756-1.69c.68-.16 1.385-.16 2.066 0a2.989 2.989 0 011.755 1.69c.193.436.301.91.301 1.406 0 1.229-.742 3.083-2.162 4.726-.013.011-.026.022-.04.033-.39-.216-.81-.388-1.245-.512a11.08 11.08 0 00-3.147-.332c-.421.012-.846.063-1.272.145-.426.083-.85.188-1.271.315-2.09.622-3.748 1.577-4.829 2.631-.039.037-.078.076-.115.114C4.45 19.56 4 16.95 4 14.25 4 7.477 7.477 4 12 4zM9.5 13.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm7.5 0a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
