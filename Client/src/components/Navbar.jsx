import { FaAlignLeft } from "react-icons/fa";
import Logo from "./Logo";
import { useDashboardContext } from "../pages/DashboardLayout";
import LogoutContainer from "./LogoutContainer";

const Navbar = () => {
  const { toggleSidebar } = useDashboardContext();
  return (
    <nav className="h-24 flex items-center justify-center shadow-[0_1px_0_0_rgba(0,0,0,0.1)] bg-white md:sticky md:top-0 md:z-[1]">
      <div className="flex w-[90vw] items-center justify-between md:w-[90%]">
        <button
          type="button"
          className="bg-transparent border-transparent text-[1.75rem] text-[#2cb1bc] cursor-pointer flex items-center"
          onClick={toggleSidebar}
        >
          <FaAlignLeft />
        </button>
        <div className="flex items-center w-[100px] hide-logo-custom">
          <Logo />
        </div>

        <h4 className="hidden md:block md:capitalize text-3xl">dashboard</h4>
        <div className="flex items-center">
          <LogoutContainer />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
