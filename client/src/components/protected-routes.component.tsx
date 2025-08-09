import { Outlet } from "react-router";

const ProtectedRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <h1>Forbidden</h1>;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
