import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { FiUser, FiMapPin, FiCalendar, FiNavigation } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { setLoggedinUser } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const GoogleAuthButton = () => {
  const [formExtras, setFormExtras] = useState({
    age: '',
    gender: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const [locationFetched, setLocationFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate()
  const dispatch=useDispatch()

  // Get browser location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormExtras((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(4),
            longitude: position.coords.longitude.toFixed(4),
          }));
          setLocationFetched(true);
          toast.success("Location fetched successfully!", {
            icon: '📍',
          });
        },
        (error) => {
          toast.error("Location permission denied", {
            icon: '❌',
          });
        }
      );
    } else {
      toast.error("Geolocation not supported", {
        icon: '⚠️',
      });
    }
  }, []);

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);

      console.log("Google Decoded:", decoded);

      const { age, gender, address, latitude, longitude } = formExtras;

      if (!age || !gender || !address || !latitude || !longitude) {
        toast.error("Please fill all fields including location!", {
          icon: '✏️',
        });
        setIsLoading(false);
        return;
      }
      const BACKEND_URI=import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(`${BACKEND_URI}/api/auth/google-login`, {
        token,
        age,
        gender,
        address,
        latitude,
        longitude,
      }, {
        withCredentials: true
      });
      console.log(res.data.createdUser)
      dispatch(setLoggedinUser(res.data.createdUser))
      navigate('/dashboard')
      toast.success(res.data.message, {
        icon: '🎉',
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Google login failed", {
        icon: '😢',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Complete Your Profile</h2>
      <p className="text-center text-gray-500">Sign in with Google</p>

      <div className="space-y-4">
        {/* Age input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiCalendar className="text-gray-400" />
          </div>
          <input
            type="number"
            placeholder="Age"
            min="13"
            max="120"
            value={formExtras.age}
            onChange={(e) => setFormExtras({ ...formExtras, age: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Gender selection */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="text-gray-400" />
          </div>
          <select
            value={formExtras.gender}
            onChange={(e) => setFormExtras({ ...formExtras, gender: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            
          </select>
        </div>

        {/* Address input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Full Address"
            value={formExtras.address}
            onChange={(e) => setFormExtras({ ...formExtras, address: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Location display */}
        <div className={`flex items-center p-3 rounded-lg ${locationFetched ? 'bg-blue-50 text-blue-800' : 'bg-gray-50 text-gray-500'}`}>
          <FiNavigation className="mr-2" />
          {locationFetched ? (
            <span>Location: {formExtras.latitude}, {formExtras.longitude}</span>
          ) : (
            <span>Fetching your location...</span>
          )}
        </div>

        {/* Google Login Button */}
        <div className="pt-2">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              toast.error("Google Sign-In failed", {
                icon: '❌',
              });
            }}
            useOneTap
            theme="filled_blue"
            size="large"
            shape="pill"
            text="signup_with"
            width="100%"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GoogleAuthButton;