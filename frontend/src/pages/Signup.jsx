import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import apiClient from "@/services/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/auth/authSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import signUpImage from "../assets/images/loginImage3.png";

const Signup = () => {
  const [isEmployer, setIsEmployer] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...data } = values;
        const res = await apiClient.post("/auth/signup", {
          ...data,
          role: isEmployer ? "employer" : "user",
        });
        console.log(res);

        if (res.status === 201) {
          dispatch(login({ token: res.data.token }));
          toast.success("Login successful!");
          localStorage.setItem("token", JSON.stringify(res.data.token));
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error.response);
      }
    },
  });

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "user":
          navigate("/dashboard/user");
          break;
        case "employer":
          navigate("/dashboard/employer");
          break;
        case "admin":
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/dashboard/user");
      }
    }
  }, [user]);

  return (
    <section className="relative bg-cover bg-center bg-fixed min-h-screen bg-black">
      <img
        alt=""
        loading="lazy"
        src={signUpImage}
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="absolute inset-0 "></div>
      <div className="flex justify-end items-center min-h-screen">
        <form
          onSubmit={formik.handleSubmit}
          className="relative w-full max-w-[480px] p-8 bg-white bg-opacity-100 rounded-md mr-60"
          style={{ paddingRight: "60px" }}
        >
          <h1 className="text-4xl col-span-12 mt-8">Sign up</h1>
          <small className="text-gray-500 mb-8">
            Create an account to get started
          </small>
          <div className="flex gap-4 my-4">
            <div className="basis-full md:basis-1/2">
              <Label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-600 text-sm">
                  {formik.errors.firstName}
                </div>
              ) : null}
            </div>

            <div className="basis-full md:basis-1/2">
              <Label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-red-600 text-sm">
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>
          </div>

          <div className="my-4">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-600 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="my-4">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-600 text-sm">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <div className="my-4">
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password Confirmation
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-600 text-sm">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <div className="my-4 flex items-center">
            <input
              type="checkbox"
              id="isEmployer"
              name="isEmployer"
              checked={isEmployer}
              onChange={() => setIsEmployer(!isEmployer)}
              className="mr-2"
            />
            <Label
              htmlFor="isEmployer"
              className="text-sm font-medium text-gray-700"
            >
              Are you an employer?
            </Label>
          </div>

          <div className="my-4">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our
              <a href="#" className="text-gray-700 underline">
                terms and conditions
              </a>
              and
              <a href="#" className="text-gray-700 underline">
                privacy policy
              </a>
              .
            </p>
          </div>

          <button
            type="submit"
            className="inline-block mb-4 shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
          >
            Create an account
          </button>

          <div className="flex items-center justify-between flex-wrap">
            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              Already have an account?
              <Link to="/login" className="text-gray-700 underline ml-2">
                Log in
              </Link>
              .
            </p>

            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              <Link to="/forgot-password">Forget Password</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signup;
