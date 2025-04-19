import { useState } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoggedinUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

const LogoutContainer = () => {
  const [showLogout, setShowLogout] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.user.loggedinUser);
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {
        withCredentials: true,
      });
      dispatch(setLoggedinUser(null));
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="cursor-pointer text-white bg-[#2cb1bc] border border-transparent rounded px-3 py-1.5 tracking-wide shadow-md transition-all duration-300 ease-in-out capitalize hover:bg-[#0e7c86] hover:shadow-2xl flex items-center justify-center gap-x-2"
        onClick={() => setShowLogout(!showLogout)}
      >
        {loggedInUser.avatar ? (
          <img
            src={loggedInUser.avatar}
            alt="avatar"
            className="w-[25px] h-[25px] rounded-full"
          />
        ) : (
          <FaUserCircle />
        )}
        {loggedInUser?.fullName.split(" ")[0]}
        <FaCaretDown />
      </button>

      <div
        className={`absolute top-[45px] left-0 w-full text-center ${
          showLogout ? "visible" : "invisible"
        } rounded bg-[#2cb1bc] shadow-md`}
      >
        <button
          type="button"
          className="w-full h-full px-2 py-2 bg-transparent border border-transparent text-white tracking-wide capitalize cursor-pointer rounded"
          onClick={logoutUser}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default LogoutContainer;
