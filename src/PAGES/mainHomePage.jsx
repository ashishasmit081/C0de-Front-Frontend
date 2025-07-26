import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser, toggleDarkMode } from '../authSlice';
import ParticleEffect from '../utils/particleEffect';
import { Video, LockKeyhole, BarChart3, Trash } from 'lucide-react';


export default function Home() {
const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.auth.darkMode);


  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };



  return (
    <div
      className={`min-h-screen relative font-inter transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white'
          : 'bg-gradient-to-br from-blue-300 via-white to-blue-300 text-black'
      }`}
    >
      <ParticleEffect darkMode={darkMode} />

      {/* Theme Toggle Button */}
      <label className="swap swap-rotate fixed bottom-4 left-5 z-50">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => dispatch(toggleDarkMode())}
        />
        <svg
          className="swap-off h-10 w-10 fill-yellow-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
        <svg
          className="swap-on h-10 w-10 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>

      {/* Navigation Bar */}
      <nav className={`navbar shadow-lg px-6 py-4 ${darkMode ? 'bg-black/80' : 'bg-white/80'}`}>
        <div className="flex-1">
          <NavLink
            to="/"
            className="btn btn-ghost text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
          >
            C0de Front
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          {user && (
            <div className="dropdown dropdown-end">
            <div
              style={{
                padding: '2px',
                borderRadius: '8px',
                background: 'linear-gradient(270deg, purple, blue, purple)',
                backgroundSize: '400% 400%',
                animation: 'gradientMove 6s ease infinite',
                display: 'inline-block', // make sure border wraps snugly
              }}
            >
              <div
                tabIndex={0}
                className={`btn btn-ghost text-xl font-semibold ${
                  darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-200'
                }`}
                style={{
                  borderRadius: '6px',
                  backgroundColor: darkMode ? '#000' : '#fff',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = darkMode ? '#1f2937' : '#e5e7eb')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = darkMode ? '#000' : '#fff')
                }
              >
                {user.firstName}
              </div>

              {/* Inline animation keyframes */}
              <style>
                {`
                  @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                `}
              </style>
            </div>

              <ul
                className={`mt-3 p-2 shadow-lg menu menu-sm dropdown-content rounded-xl w-52 ${
                  darkMode
                    ? 'bg-gray-900 text-purple-300 border border-gray-700'
                    : 'bg-white text-purple-700 border border-gray-300'
                }`}
              >
                <li>
                  <button onClick={handleLogout} className="hover:bg-gray-700 dark:hover:bg-gray-600">
                    Logout
                  </button>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <NavLink to="/admin" className="hover:bg-gray-700 dark:hover:bg-gray-600">
                      Admin
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/profile" className="hover:bg-gray-700 dark:hover:bg-gray-600">
                    Profile
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Welcome to C0de Front
        </h1>
        <p className="text-xl mb-6  ">
          Master coding with interactive problems and video solutions.
        </p>
        <NavLink
          to="/problemmenu"
          className="btn btn-primary px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
        >
          Explore Problems
        </NavLink>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Why C0de Front?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className={`card shadow-xl p-6 rounded-lg transform hover:-translate-y-2 transition-all duration-300 ${darkMode ? 'border-8 border-base-100 bg-gradient-to-r from-base-200 via-base-300 to-base-100' : 'border-8 border-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'} `}>
            <Video className="w-10 h-10 mb-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-semibold mb-2 text-white">Video Solutions</h3>
            <p className={` ${darkMode ? 'text-gray-400 ' : 'text-white'} `}>
              Learn with step-by-step video tutorials integrated into problem editorials.
            </p>
          </div>
          <div className={`card shadow-xl p-6 rounded-lg transform hover:-translate-y-2 transition-all duration-300 ${darkMode ? 'border-8 border-base-100 bg-gradient-to-r from-base-200 via-base-300 to-base-100' : 'border-8 border-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'} `}>
            <LockKeyhole className="w-10 h-10 mb-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-semibold mb-2 text-white">Secure Uploads</h3>
            <p className={` ${darkMode ? 'text-gray-400 ' : 'text-white'} `}>
              Upload your solutions securely to Cloudinary with signature verification.
            </p>
          </div>
          <div className={`card shadow-xl p-6 rounded-lg transform hover:-translate-y-2 transition-all duration-300 ${darkMode ? 'border-8 border-base-100 bg-gradient-to-r from-base-200 via-base-300 to-base-100' : 'border-8 border-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'} `}>
            <BarChart3 className="w-10 h-10 mb-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-semibold mb-2 text-white">Progress Tracking</h3>
            <p className={` ${darkMode ? 'text-gray-400 ' : 'text-white'} `}>
              Track your solved problems and view detailed progress stats.
            </p>
          </div>
          <div className={`card shadow-xl p-6 rounded-lg transform hover:-translate-y-2 transition-all duration-300 ${darkMode ? 'border-8 border-base-100 bg-gradient-to-r from-base-200 via-base-300 to-base-100' : 'border-8 border-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'} `}>
            <Trash className="w-10 h-10 mb-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-semibold mb-2 text-white">Easy Deletion</h3>
            <p className={` ${darkMode ? 'text-gray-400 ' : 'text-white'} `}>
              Delete your videos and metadata with a single click.
            </p>
          </div>
        </div>
      </div>



      {/* Footer */}
      <footer className=" footer footer-center p-6 bg-base-300 text-base-content absolute bottom-0">
        <div >
          <p>© 2025 C0de Front. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

