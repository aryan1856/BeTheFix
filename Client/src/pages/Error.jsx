import { Link, useRouteError } from "react-router-dom";

import img from "../assets/images/not-found.svg";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  if (error.status === 404) {
    return (
      <main className="min-h-screen text-center flex items-center justify-center">
        <div>
          <img
            src={img}
            alt="not found"
            className="w-[90vw] max-w-[600px] block mb-8 -mt-12"
          />
          <h3 className="mb-2">Ohh! Page not found</h3>
          <p
            className="leading-relaxed mt-2 mb-4 text-slate-500
"
          >
            We can't seem to find the page you are looking for
          </p>
          <Link to="/dashboard" className="text-[#2cb1bc] capitalize">
            back home
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen text-center flex items-center justify-center">
      <div>
        <h3>Something went wrong</h3>
      </div>
    </main>
  );
};
export default Error;
