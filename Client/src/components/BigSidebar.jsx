import { useDashboardContext } from "../pages/DashboardLayout";
import Logo from "./Logo";
import Navlinks from "./Navlinks";

const BigSidebar = () => {
  const { showSidebar } = useDashboardContext();
  return (
    <aside className="hidden md:block md:shadow-[1px_0px_0px_0px_rgba(0,0,0,0.1)]">
      <div
        className={`bg-white min-h-screen h-full w-[250px] transition-all duration-300 ease-in-out hidden md:block ${
          showSidebar ? "md:-ml-[250px]" : "md:ml-0"
        }`}
      >
        <div className="sticky top-0">
          <header className="h-24 flex items-center pl-10">
            <Logo />
          </header>
          <div className="flex justify-center">
            <Navlinks isBigSidebar />
          </div>
        </div>
      </div>
    </aside>
  );
};
export default BigSidebar;
