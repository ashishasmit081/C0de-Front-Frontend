import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { toggleDarkMode } from '../authSlice';
import ParticleEffect from '../utils/particleEffect';
import { NavLink } from 'react-router'; // Fixed import

function Profile(){
    const [user, setUser] = useState()
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const darkMode = useSelector((state) => state.auth.darkMode);
    const dispatch = useDispatch();
    const [refreshKey, setRefreshKey] = useState(0);

    const [showToast, setShowToast] = useState(false);
    // Calculate totals and solved counts
    const easyTotal = problems.filter(p => p.difficulty === 'easy').length;
    const mediumTotal = problems.filter(p => p.difficulty === 'medium').length;
    const hardTotal = problems.filter(p => p.difficulty === 'hard').length;

    const easySolved = solvedProblems.filter(p => p.difficulty === 'easy').length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === 'medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'hard').length;


  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); // Your existing refresh logic
    setShowToast(true);


    setTimeout(() => {
      setShowToast(false);
    }, 1000); // auto-hide after 3 seconds
 
  };

    // Runs only once when component mounts
    useEffect(() => {
    const fetchProfile = async () => {
        try {
        const userDetails = await axiosClient.get('/user/profile');
        
        setUser(userDetails.data);
        } catch (error) {
        console.error('Error fetching Profile:', error);
        }
    };

    fetchProfile();
    }, []); // ⬅️ empty dependency array: only runs once

  useEffect(()=>{
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, [user])
    
    
    useEffect(() => {
    const fetchSolvedProblems = async () => {
        try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
        } catch (error) {
        console.error('Error fetching solved problems:', error);
        }
    };

    if (user) {
        fetchSolvedProblems();
    }
    }, [user, refreshKey]); 

    const handleDeleteProfile = async(user) => {
    // Add your confirmation + API call here
    if (confirm(`This action is irreversible ${user.firstName} ${user.lastName} bro. Profile deletion has been disabled to protect the account, as the login credentials (email and password) shared in my resume are same everywhere. `)) {
    //     try {
    //     await axiosClient.delete(`/user/deleteprofile /${user._id}`);
    //     setAlert({ type: 'success', message: 'Problem deleted successfully!' });
    //     fetchProblems();
    // } catch (error) {
    //     setAlert({ type: 'error', message: error.response?.data?.message || error.message });
    //     console.error('Delete error:', error);
    // }
    }
    };
  return (
    <div
    className={`min-h-screen p-6 transition-all duration-300 flex justify-center items-center ${
        darkMode
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-black'
    }`}
    >
    <ParticleEffect darkMode={darkMode} />

    {/* Theme Toggle Button */}
          <label className="swap swap-rotate fixed bottom-4 left-5 z-50">
            {/* Hidden checkbox that toggles theme */}
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => dispatch(toggleDarkMode())}
            />
    
            {/* Sun icon */}
            <svg
              className="swap-off h-10 w-10 fill-yellow-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
    
                  {/* Moon icon */}
            <svg
              className="swap-on h-10 w-10 fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

    {/* Main Card Container */}
<div
  className={`w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-6 p-6 md:p-10 transition-all duration-300 ${
    darkMode
      ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white'
      : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-black'
  }`}
>
  {/* Sidebar with Profile Info */}
  <div className="col-span-1 flex flex-col justify-between space-y-6 border-r border-opacity-20 border-white dark:border-gray-700 pr-6 ">
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-purple-600 dark:bg-purple-400 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          User Profile
        </h2>
      </div>
      {user ? (
        <div className="space-y-6 text-lg ">
          <p className="flex items-center">
            <span className="w-20 font-semibold opacity-80">First Name:</span>
            <span className="ml-2">{user.firstName}</span>
          </p>
                    <p className="flex items-center">
            <span className="w-20 font-semibold opacity-80">Last Name:</span>
            <span className="ml-2">{user.lastName}</span>
          </p>
          <p className="flex items-center">
            <span className="w-20 font-semibold opacity-80">Email:</span>
            <span className="ml-2 break-all">{user.emailID}</span>
          </p>
          <p className="flex items-center">
            <span className="w-20 font-semibold opacity-80">Role:</span>
            <span
              className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                user.role === 'admin'
                  ? 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-white hover:scale-105'
                  : 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-white hover:scale-105'
              }`}
            >
              {user.role || 'User'}
            </span>
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <span className="loading loading-spinner loading-lg text-purple-600 dark:text-purple-400"></span>
        </div>
      )}
    </div>

    {/* Delete Profile Button */}
    <button
      onClick={() => handleDeleteProfile(user)}
      className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
        darkMode
          ? 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950'
          : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900'
      }`}
    >
      <span className="flex items-center justify-center space-x-2">
        <span>🗑️ Delete Profile</span>
      </span>
    </button>
  </div>

  {/* Right Side - Problem Table */}

        {showToast && (
        <div className="toast toast-top toast-end fixed z-[9999] opacity-80">
          <div className="alert alert-info">
            <span>Refreshed!</span>
          </div>
        </div>
      )}
  <div className="col-span-3 space-y-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
      {/* Progress Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Easy Progress */}
        <div className={`flex flex-col items-center  p-4 rounded-xl shadow-md ${darkMode ? 'bg-gray-800 ' : 'bg-white'} `}>
          <div
            className="radial-progress text-green-500 "
            style={{ "--value": easyTotal ? (easySolved / easyTotal) * 100 : 0 }}
            aria-valuenow={easyTotal ? (easySolved / easyTotal) * 100 : 0}
            role="progressbar"
          >
            {easySolved}/{easyTotal}
          </div>
          <span className="mt-2 font-semibold text-green-600 dark:text-green-300">Easy</span>
        </div>

        {/* Medium Progress */}
        <div className={`flex flex-col items-center  p-4 rounded-xl shadow-md ${darkMode ? 'bg-gray-800 ' : 'bg-white'} `}>
          <div
            className="radial-progress text-yellow-500"
            style={{ "--value": mediumTotal ? (mediumSolved / mediumTotal) * 100 : 0 }}
            aria-valuenow={mediumTotal ? (mediumSolved / mediumTotal) * 100 : 0}
            role="progressbar"
          >
            {mediumSolved}/{mediumTotal}
          </div>
          <span className="mt-2 font-semibold text-yellow-500 ">Medium</span>
        </div>

        {/* Hard Progress */}
        <div className={`flex flex-col items-center  p-4 rounded-xl shadow-md ${darkMode ? 'bg-gray-800 ' : 'bg-white'} `}>
          <div
            className="radial-progress text-red-500"
            style={{ "--value": hardTotal ? (hardSolved / hardTotal) * 100 : 0 }}
            aria-valuenow={hardTotal ? (hardSolved / hardTotal) * 100 : 0}
            role="progressbar"
          >
            {hardSolved}/{hardTotal}
          </div>
          <span className="mt-2 font-semibold text-red-500 ">Hard</span>
        </div>
      </div>

      
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Problems Solved
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Explore your solved problems and track your progress.
        </p>
      </div>
      <button
        onClick={() => handleRefresh()}
        className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 ${
          darkMode
            ? 'bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950'
            : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
        }`}
      >
        Refresh
      </button>
    </div>

    <div className="overflow-x-auto rounded-xl shadow-inner border border-opacity-10 border-white dark:border-gray-700">
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 text-purple-900 dark:text-white">
            <th className="px-6 py-3 font-semibold">#</th>
            <th className="px-6 py-3 font-semibold">Title</th>
            <th className="px-6 py-3 font-semibold">Difficulty</th>
            <th className="px-6 py-3 font-semibold">Tag</th>
          </tr>
        </thead>
        <tbody>
          {solvedProblems.length > 0 ? (
            solvedProblems.map((problem, index) => (
              <tr
                key={problem._id}
                className={`  transition-colors duration-200 ${
                  index % 2 === 0
                    ? darkMode
                      ? 'bg-gray-800 hover:bg-gray-600 transition-colors duration-200'
                      : 'bg-white hover:bg-gray-300 transition-colors duration-200'
                    : darkMode
                    ? 'bg-gray-900 hover:bg-gray-600 transition-colors duration-200'
                    : 'bg-gray-50 hover:bg-gray-300 transition-colors duration-200'
                }`}
              >
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4">
                  <NavLink
                    to={`/problem/${problem._id}`}
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {problem.title}
                  </NavLink>
                </td>
                <td className="px-6 py-4 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      problem.difficulty === 'easy'
                        ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : problem.difficulty === 'medium'
                        ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize">{problem.tags}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>No problems solved yet. Start solving!</span>
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>

  );

}

export default Profile;