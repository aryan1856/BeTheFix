import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const GoogleAuthButton = () => {
  const [formExtras, setFormExtras] = useState({
    age: '',
    gender: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const [locationFetched, setLocationFetched] = useState(false);

  // Get browser location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormExtras((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setLocationFetched(true);
        },
        (error) => {
          toast.error("Location permission denied");
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  }, []);

  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);

      console.log("Google Decoded:", decoded);

      const { age, gender, address, latitude, longitude } = formExtras;

      if (!age || !gender || !address || !latitude || !longitude) {
        toast.error("All fields including location are required!");
        return;
      }

      const res = await axios.post('http://localhost:8000/api/users/google-login', {
        token,
        age,
        gender,
        address,
        latitude,
        longitude,
      },{
        withCredentials:true
      });

      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Age input */}
      <input
        type="number"
        placeholder="Age"
        value={formExtras.age}
        onChange={(e) => setFormExtras({ ...formExtras, age: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {/* Gender selection */}
      <select
        value={formExtras.gender}
        onChange={(e) => setFormExtras({ ...formExtras, gender: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      {/* Address input */}
      <input
        type="text"
        placeholder="Address"
        value={formExtras.address}
        onChange={(e) => setFormExtras({ ...formExtras, address: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Location display */}
      <div className="text-sm text-gray-500">
        {locationFetched
          ? `Location fetched: (${formExtras.latitude}, ${formExtras.longitude})`
          : "Fetching location..."}
      </div>

      {/* Google Login Button */}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          toast.error("Google Sign-In failed");
        }}
        useOneTap
        theme="filled_blue"
      />
    </div>
  );
};

export default GoogleAuthButton;
