import React, { useState } from 'react';
import axios from 'axios'
import toast from 'react-hot-toast'
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useDispatch } from 'react-redux';
import { setLoggedinUser } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    latitude: '',
    longitude: '',
    gender: '',
    age: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setFormData(prev => ({
        ...prev,
        avatar: files[0],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    console.log(formData);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      const loadingToastId = toast.loading(isLogin ? 'Signing in...' : 'Signing up...');
  
      try {
        const url = isLogin
? loginAsAdmin
  ? `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`
  : `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`
: `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`;

  
        let payload;
        let config;
  
        if (isLogin) {
          payload = {
            email: formData.email,
            password: formData.password,
          };
          config = { headers: { 'Content-Type': 'application/json' } };
        } else {
          // Convert JS object to FormData for file upload
          payload = new FormData();
          for (const key in formData) {
            if (formData[key]) {
              payload.append(key, formData[key]);
            }
          }
          config = { headers: { 'Content-Type': 'multipart/form-data' } };
        }
  
        // Add withCredentials to allow cookies to be sent
        const response = await axios.post(url, payload, { ...config, withCredentials: true });
  
        console.log(response);
  
        // Handle success
        toast.success(response.data.message, { id: loadingToastId });
        dispatch(setLoggedinUser({
          ...response.data.createdUser,
          isAdmin: loginAsAdmin
        }));
        
        if(loginAsAdmin) navigate('/dashboard/admindashboard')
        else navigate('/dashboard')
  
        if (!isLogin) {
          setIsLogin(true);
        }
  
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message || 'An error occurred',
          { id: loadingToastId }
        );
      }
    } else {
      setErrors(validationErrors);
    }
  };
  

  const validateForm = () => {
    const errors = {};
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.avatar && !isLogin) errors.avatar = 'Avatar is required';

    if (!isLogin) {
      if (!formData.fullname) errors.fullname = 'Full name is required';
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
      }
      if (!formData.address) errors.address = 'Address is required';
      if (!formData.gender) errors.gender = 'Gender is required';
      if (!formData.age || isNaN(formData.age) || formData.age <= 0) errors.age = 'Age is required';
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    return errors;
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleLocationClick = () => {
    const permission = window.confirm('Do you allow this application to access your location?');
    if (permission) {
      getLocation();
    }
  };

  return (
    <>
      {showGoogleForm ? (
        <GoogleAuthButton />
      ) : (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label
                        htmlFor="fullname"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          id="fullname"
                          name="fullname"
                          type="text"
                          value={formData.fullname}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm"
                        />
                        {errors.fullname && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.fullname}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm"
                        />
                        {errors.address && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.address}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location Coordinates
                      </label>
                      <div className="mt-1 flex space-x-2">
                        <input
                          id="latitude"
                          name="latitude"
                          type="text"
                          placeholder="Latitude"
                          value={formData.latitude}
                          readOnly
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm bg-gray-100"
                        />
                        <input
                          id="longitude"
                          name="longitude"
                          type="text"
                          placeholder="Longitude"
                          value={formData.longitude}
                          readOnly
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm bg-gray-100"
                        />
                        <button
                          type="button"
                          onClick={handleLocationClick}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
                        >
                          Get Location
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender
                      </label>
                      <div className="mt-1">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.gender}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Age
                      </label>
                      <div className="mt-1">
                        <input
                          id="age"
                          name="age"
                          type="number"
                          min="1"
                          value={formData.age}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm"
                        />
                        {errors.age && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.age}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="avatar"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Upload Avatar
                      </label>
                      <div className="mt-1">
                        <input
                          id="avatar"
                          name="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-[#0e7c86] hover:file:bg-[#bef8fd]"
                        />
                        {errors.avatar && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.avatar}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm"
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-600 focus:border-slate-600 sm:text-sm"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                )}

{isLogin && (
<div className="flex items-center">
  <input
    id="loginAsAdmin"
    name="loginAsAdmin"
    type="checkbox"
    checked={loginAsAdmin}
    onChange={(e) => setLoginAsAdmin(e.target.checked)}
    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
  />
  <label htmlFor="loginAsAdmin" className="ml-2 block text-sm text-gray-900">
    Login as Admin
  </label>
</div>
)}

                <div>
                  
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2cb1bc] hover:bg-[#0e7c86] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2cb1bc]"
                  >
                    {isLogin ? "Sign in" : "Sign up"}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {isLogin ? "New to us?" : "Already have an account?"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2cb1bc]"
                  >
                    {isLogin ? "Create a new account" : "Sign in instead"}
                  </button>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowGoogleForm(true);
                      }}
                      className="w-full py-2 px-4 border border-[#2cb1bc] rounded-md shadow-sm text-sm font-medium text-[#2cb1bc] bg-white hover:bg-[#e0fcff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2cb1bc]"
                    >
                      SignIn with Google
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

