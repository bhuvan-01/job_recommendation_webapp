import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/images/bgimage.jpg";
import Navbar from "./Navbar";

const Hero = () => {
  const { user, token } = useSelector((state) => state.auth);

  return (
    <section
      className="bg-gray-50 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})`, height: "100vh" }}
    >
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Land Your Dream Job
            <strong className="font-extrabold text-white sm:block">
              {" "}
              with Top Companies
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Find the best job opportunities or hire top talent. Whether you're a
            job seeker or an employer, we've got you covered.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {token ? (
              <Link
                className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                to={
                  user?.role === "employer"
                    ? "/dashboard/employer"
                    : "/dashboard/user"
                }
              >
                {user?.role === "employer" ? "Go to dashboard" : "Explore Jobs"}
              </Link>
            ) : (
              <Link
                className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                to="/signup"
              >
                Get started
              </Link>
            )}

            <a
              className="block w-full rounded  bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:text-blue-700 focus:outline-none focus:ring active:text-blue-500 sm:w-auto"
              href="#learn-more"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
