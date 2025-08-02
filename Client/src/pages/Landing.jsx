import { Link, Navigate } from "react-router-dom";
import img from "../assets/images/landing.svg";
import { Logo } from "../components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Landing = () => {
  const user = useSelector((store) => store.user.loggedinUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for redux-persist to rehydrate if needed
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  if (user) {
    return user.isAdmin
      ? <Navigate to="/dashboard/admindashboard" replace />
      : <Navigate to="/dashboard" replace />;
  }
  return (
    <section className="bg-gradient-to-br from-[#f0f4f8] to-white min-h-screen">
      <Logo />

      <div className="w-[90vw] max-w-[1120px] mx-auto grid items-center min-h-[calc(100vh-6rem)] gap-12 md:grid-cols-2">
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Complaint <span className="text-[#2cb1bc]">Registering</span>{" "}
            Platform
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Easily file and track complaints within your organization. Our
            platform ensures that your voice is heard and issues are resolved
            efficiently.
          </p>
          <div className="flex justify-center md:justify-start gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-[#2cb1bc] hover:bg-[#0e7c86] text-white font-medium px-6 py-2 rounded-md shadow-md transition-all duration-300"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="bg-white border border-[#2cb1bc] hover:bg-[#2cb1bc] hover:text-white text-[#2cb1bc] font-medium px-6 py-2 rounded-md shadow-md transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </div>

        <img
          src={img}
          alt="landing"
          className="w-full hidden md:block animate-fade-in"
        />
      </div>
    </section>
  );
};

export default Landing;
