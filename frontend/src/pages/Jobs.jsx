import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const Jobs = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Jobs;
