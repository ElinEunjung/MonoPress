import { Outlet } from "react-router";

const ProtectedRoutes = () => {
  // if (!accessToken) {
  //   return <h1>Forbidden</h1>;
  // }

  return <Outlet />;
};

export default ProtectedRoutes;
