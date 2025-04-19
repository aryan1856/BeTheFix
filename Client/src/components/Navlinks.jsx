import { NavLink } from "react-router-dom";
import useLinks from "../utils/links";
import { useDashboardContext } from "../pages/DashboardLayout";

const Navlinks = ({ isBigSidebar }) => {
  const { toggleSidebar } = useDashboardContext();
  const links = useLinks();
  return (
    <div className="pt-8 flex flex-col">
      {links.map((link) => {
        const { text, path, icon } = link;
        return (
          <NavLink
            to={path}
            key={text}
            className={({ isActive }) =>
              `flex items-center py-4 capitalize transition-all duration-300 ease-in-out hover:text-[#2cb1bc] ${
                isActive ? "text-[#2cb1bc]" : "text-[#64748b]"
              }`
            }
            onClick={isBigSidebar ? null : toggleSidebar}
            end
          >
            <span className="text-xl mr-4 grid place-items-center">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default Navlinks;
