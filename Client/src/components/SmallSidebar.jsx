import { FaTimes } from "react-icons/fa";
import { useDashboardContext } from "../pages/DashboardLayout";
import Navlinks from "./Navlinks";

const SmallSidebar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext();

  return (
    <aside className="md:hidden">
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center transition-all duration-300 ease-in-out ${
          showSidebar
            ? "z-[99] opacity-100 visible"
            : "z-[-1] opacity-0 invisible"
        }`}
      >
        <div className="bg-white w-[90vw] h-[95vh] rounded p-16 px-8 relative flex items-center flex-col">
          <button
            type="button"
            className="absolute top-[10px] left-[10px] bg-transparent border-transparent text-[2rem] text-[#842029] cursor-pointer"
            onClick={toggleSidebar}
          >
            <FaTimes />
          </button>
          <Navlinks />
        </div>
      </div>
    </aside>
  );
};
export default SmallSidebar;
