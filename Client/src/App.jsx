import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  DashboardLayout,
  Error,
  HomeLayout,
  HomePage,
  Landing,
  Leaderboard,
  Profile,
  ReportIssue,
  AdminDashboard,
  ResolvedIssues
} from "./pages";
import axios from 'axios'
import Login from "./pages/Login.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { setLoggedinUser } from "../store/userSlice.js";

import { ComplaintProvider } from './pages/ComplaintContext.jsx'

import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Login /> },

      {
        path: "dashboard",
        element: <PrivateRoute />, // Protect everything under /dashboard
        children: [
          {
            element: <DashboardLayout />, // Dashboard layout wraps all child pages
            children: [
              { index: true, element: <HomePage /> },
              { path: "report", element: <ReportIssue /> },
              { path: "leaderboard", element: <Leaderboard /> },
              { path: "profile", element: <Profile /> },
              { path: "admindashboard", element: <AdminDashboard /> },
              {path: "resolved", element: <ResolvedIssues />}
            ],
          },
        ],
      },
    ],
  },
]);


import { Toaster } from "react-hot-toast"

import './index.css'
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const loggedInUser = useSelector((store) => store.user.loggedinUser);
   const dispatch=useDispatch();
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    axios.get(`${BACKEND_URL}/api/auth/get-user`, { withCredentials: true }) 
        .then(res => {
            if (res.data && !loggedInUser) {
                dispatch(setLoggedinUser(res.data));
            }
        })
        .catch(() => dispatch(setLoggedinUser(null)))
        .finally(()=>{
          setLoading(false);
        })
}, [dispatch]);

    if (loading) return <h2>Connecting to server,Please wait...</h2>;

  return (
    <>
    <ComplaintProvider>
    <GoogleOAuthProvider clientId="919467792428-imo97sd98mi3ndn7fpc9esb5sb8thn8j.apps.googleusercontent.com">
      <RouterProvider router={router} />
      </GoogleOAuthProvider>
      <Toaster />
    </ComplaintProvider>
    </>
  )
}

export default App;
