import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const user = useSelector((store) => store.user.loggedinUser);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = user?.isAdmin;

  // If admin and trying to access any route other than /dashboard/admindashboard, redirect
  if (isAdmin && location.pathname !== "/dashboard/admindashboard") {
    return <Navigate to="/dashboard/admindashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
