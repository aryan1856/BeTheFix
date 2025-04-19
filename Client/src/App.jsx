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
import Login from "./pages/Login.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google"

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
            ],
          },
        ],
      },
    ],
  },
]);


import { Toaster } from "react-hot-toast"

import './index.css'

function App() {
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
