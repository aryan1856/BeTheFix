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
  Login
} from "./pages";
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "report",
            element: <ReportIssue />,
          },
          {
            path: "leaderboard",
            element: <Leaderboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);
import { Toaster } from "react-hot-toast";

import "./index.css";

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="919467792428-imo97sd98mi3ndn7fpc9esb5sb8thn8j.apps.googleusercontent.com">
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
      <Toaster />
    </>
  );
}

export default App;
