import { Outlet } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { setLocation } from "../../store/locationSlice.js";
import { useEffect } from "react";

const HomeLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch(setLocation({ latitude, longitude }));
        },
        (err) => {
          console.error('Location error:', err);
        }
      );
    }
  }, [navigator.geolocation]);
  return (
    <>
        <Outlet />
    </>
  )
}
export default HomeLayout