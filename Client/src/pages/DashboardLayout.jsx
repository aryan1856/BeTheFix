import { Outlet } from "react-router-dom";
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { createContext, useState, useContext } from "react";

const DashboardContext = createContext();

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };


  return (
    <DashboardContext.Provider
      value={{
        showSidebar,
        toggleSidebar,
      }}
    >
      <section>
        <main className="grid grid-cols-1 md:grid-cols-[auto_1fr]">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="w-[90vw] mx-auto py-8 md:w-[90%]">
              <Outlet />
            </div>
          </div>
        </main>
      </section>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
