import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { toggleDarkMode } from '../authSlice';
import ParticleEffect from '../utils/particleEffect';

function ProblemMenu() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
const darkMode = useSelector((state) => state.auth.darkMode);
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem', {
          withCredentials: true
        });
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser', {
          withCredentials: true
        });
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user){
      fetchSolvedProblems();
    }}, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear solved problems on logout
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  // THIS WILL JUST TRACK THE PROGRESS OF NUMBER OF QUESTIONS SOLVED
  const totalVisible = filteredProblems.length;
  const solvedVisible = filteredProblems.filter(p =>
    solvedProblems.some(sp => sp._id === p._id)
  ).length;

  const solvedPercentage = totalVisible > 0 ? Math.round((solvedVisible / totalVisible) * 100) : 0;

  //TO GROUP THE QUESTIONS OF SAME TOPIC UNDER THE TOPIC NAME
  const groupedByTag = filteredProblems.reduce((acc, problem) => {
    const tag = problem.tags || 'Untagged';
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(problem);
    return acc;
  }, {});



//----------------------------------------------------------------------------------------------

  return (

  <div   className={`relative min-h-screen font-inter transition-colors duration-300 ease-in-out ${darkMode? 'bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white': 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-black'}`}>
        {/* ✨ Particle stars layer */}
        <ParticleEffect darkMode={darkMode}></ParticleEffect>

        {/* Toggle Theme Button - Dark mode light mode*/}
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
    
    {/* ---------------------------- Navigation Bar ---------------------------- */}
    <nav className={`navbar  shadow-lg px-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost text-3xl font-extrabold bg-purple-900 bg-clip-text text-transparent">
          <code >C0de Front</code>
        </NavLink>
      </div>

      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className={`btn btn-ghost text-xl ${darkMode ? 'text-white hover:bg-[#1c1323]' : 'text-black hover:bg-gray-200'}`}>
            {user?.firstName}
          </div>
            {/* LOGOUT */}
          <ul className={`mt-3 p-2 shadow menu menu-md dropdown-content rounded-xl w-52 font-bold ${darkMode ? 'text-purple-400 bg-[#111111] border border-white/10' 
    : 'text-purple-700 bg-white border border-gray-300'}`}>
            <li><button onClick={handleLogout}>Logout</button></li>
            {user && user?.role == 'admin' && <li><NavLink to="/admin">Admin</NavLink></li>}
            {user && <li><NavLink to="/profile">Profile</NavLink></li>}
          </ul>
        </div>
      </div>
    </nav>



    {/* ---------------------------- Main Content ---------------------------- */}
    <div className="container mx-auto p-4">
      <h1 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Problems: {totalVisible}</h1>



      {/* ---------------------------- Filters ---------------------------- */}
      <div className="flex flex-wrap gap-4 mb-6">

        {/* Status Filter */}
        <select 
          className={`rounded-lg px-4 py-2 min-w-[180px] shadow-inner focus:outline-none focus:ring-2 transition duration-200 text-md ${darkMode? 'bg-[#1a1a1a] text-white border border-[#2e2e2e] focus:ring-purple-600/60' : 'bg-white text-black border border-gray-300 focus:ring-purple-500/40'}`}
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">All Problems</option>
          <option value="solved">Solved Problems</option>
        </select>

        {/* Difficulty Filter */}
        <select 
          className={`rounded-lg px-4 py-2 min-w-[180px] shadow-inner focus:outline-none focus:ring-2 transition duration-200 text-md ${darkMode? 'bg-[#1a1a1a] text-white border border-[#2e2e2e] focus:ring-purple-600/60' : 'bg-white text-black border border-gray-300 focus:ring-purple-500/40'}`}
          value={filters.difficulty}
          onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Tag Filter */}
        <select 
          className={`rounded-lg px-4 py-2 min-w-[180px] shadow-inner focus:outline-none focus:ring-2 transition duration-200 text-md ${darkMode? 'bg-[#1a1a1a] text-white border border-[#2e2e2e] focus:ring-purple-600/60' : 'bg-white text-black border border-gray-300 focus:ring-purple-500/40'}`}
          value={filters.tag}
          onChange={(e) => setFilters({...filters, tag: e.target.value})}
        >
          <option value="all">All Tags</option>
          <option value="array">Array</option>
          <option value="linkedList">Linked List</option>
          <option value="graph">Graph</option>
          <option value="dp">DP</option>
        </select>



        {/* ---------------------------- Global Solved Percentage ---------------------------- */}
        <div className="absolute right-20 mb-6 -mt-3">
          <div className={`text-lg mb-3 ${darkMode ? 'text-green-400' : 'text-blue-500'}`}>Progress</div>
          <div
            className={`radial-progress transition-all duration-[1.4s] ease-out ${darkMode ? 'text-green-400' : 'text-blue-400'}`}
            style={{ "--value": solvedPercentage }}
            aria-valuenow={solvedPercentage}
            role="progressbar"
          >
            {solvedPercentage}%
          </div>
        </div>

      </div>



      {/* ---------------------------- Problems List Grouped by Tag ---------------------------- */}
      <div className="space-y-6 mt-20">
        {Object.entries(groupedByTag).map(([tag, problems]) => (
          <div key={tag} className={`collapse collapse-arrow rounded-xl ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-[#e6f0fa] border-[wheat]'}`}>
            <input type="checkbox" className="peer" />



            {/* ------------------------ Tag Header with Progress Bar ------------------------ */}
            <div className={` collapse-title flex items-center justify-between gap-4 text-lg font-bold
  ${darkMode ? 'text-blue-300 peer-checked:text-blue-200' : 'text-blue-700 peer-checked:text-blue-500'}`}
>
              <span>
                {tag.toUpperCase()} ({problems.length})
              </span>

              {/* Per-Tag Progress */}
              <div className="flex items-center gap-2 min-w-[160px]">
                <progress
                  className="progress progress-primary w-40"
                  value={problems.filter(p => solvedProblems.some(sp => sp._id === p._id)).length}
                  max={problems.length}
                ></progress>
                <span className={`text-sm ${darkMode ? 'text-white peer-checked:text-blue-200' : 'text-black peer-checked:text-blue-500'}`}>
                  {problems.filter(p => solvedProblems.some(sp => sp._id === p._id)).length}/{problems.length}
                </span>
              </div>
            </div>



            {/* ------------------------ Tag-wise Collapsed Problem Cards ------------------------ */}
            <div className="collapse-content space-y-4">
              {problems.map(problem => (
                <div
                  key={problem._id}
className={`border border-white/10 rounded-xl shadow-sm hover:shadow-md hover:shadow-gray-700 transition-shadow duration-300 p-4 
  ${darkMode 
    ? 'bg-[#141414] border-white/10 shadow-sm hover:shadow-md hover:shadow-gray-700' 
    : 'bg-white border-gray-300 shadow-sm hover:shadow-md hover:shadow-blue-200'}`}
                >

                  {/* Title + Solved badge */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      <NavLink to={`/problem/${problem._id}`} className="hover:text-blue-400 transition">
                        {problem.title}
                      </NavLink>
                    </h2>

                    {solvedProblems.some(sp => sp._id === problem._id) && (
                      <span className="text-green-400 text-lg flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Solved
                      </span>
                    )}
                  </div>

                  
                  {/* Difficulty and Tag Badges */}
                  <div className="mt-2 flex gap-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${getDifficultyBadgeColor(problem.difficulty)} bg-opacity-20 mr-2`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-700">
                      {problem.tags}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);

}



const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-900 font-bold bg-green-400';
    case 'medium':
      return 'text-yellow-900 font-bold bg-yellow-400';
    case 'hard':
      return 'text-red-900 font-bold bg-red-400';
    default:
      return 'text-gray-900 font-bold bg-gray-400';
  }
};

export default ProblemMenu;