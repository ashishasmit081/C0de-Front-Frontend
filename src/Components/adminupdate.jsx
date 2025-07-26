import { useNavigate, NavLink } from 'react-router';
import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../authSlice';
import ParticleEffect from '../utils/particleEffect';

function AdminUpdate() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const darkMode = useSelector((state) => state.auth.darkMode);
  const dispatch = useDispatch();
  const [problems, setProblems] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  // Fetch all problems for the table
  const fetchProblems = async () => {
    try {
      setFetchLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      console.log('Fetched all problems:', data);
      setProblems(data);
    } catch (err) {
      setFetchError('Failed to fetch problems');
      console.error('Error fetching problems:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (problemId) => {
    try {
      await axiosClient.delete(`/problem/delete/${problemId}`);
      setAlert({ type: 'success', message: 'Problem deleted successfully!' });
      fetchProblems();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || error.message });
      console.error('Delete error:', error);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col pt-20 border-blue-700   ${darkMode ? 'bg-[#121212] text-white' : 'bg-white text-black'} p-4 relative`}>
      <ParticleEffect darkMode={darkMode}></ParticleEffect>

      {/* Alert */}
      {alert.message && (
        <div
          role="alert"
          className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} mb-4 absolute bottom-4 right-4 max-w-sm`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                alert.type === 'success'
                  ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
              }
            />
          </svg>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Toggle Theme Button */}
      <label className="swap swap-rotate absolute top-4 right-4">
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
          <path
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
          />
        </svg>
        <svg
          className="swap-on h-10 w-10 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
          />
        </svg>
      </label>

      <div className="container mx-auto p-3 ">
        <div className="flex justify-between -mb-20">
          <h1 className="text-3xl font-bold top-0">Problem List</h1>
        </div>
        <div className="flex items-start mt-4">
          <div className="border-l-2 border-blue-500 h-64 mr-2 ml-50"></div>
          {fetchLoading ? (
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : fetchError ? (
            <div className="flex justify-center items-center">
              <div className="alert alert-error max-w-md">{fetchError}</div>
            </div>
          ) : problems.length === 0 ? (
            <div className="flex justify-center items-center">
              <div className="text-center text-lg max-w-md">No problems available to update.</div>
            </div>
          ) : (
            <table className="table w-full max-w-4xl mx-auto">
              <thead>
                <tr>
                  <th className="w-1/12 text-blue-500">#</th>
                  <th className="w-8/12 text-blue-500">Title</th>
                  <th className="w-3/12 text-blue-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr
                    key={problem._id}
                    className={` ${darkMode ? 'hover:bg-gray-700 transition-all duration-200' : 'hover:bg-gray-100 transition-all duration-200'}`}
                  >
                    <th>{index + 1}</th>
                    <td>
                      <NavLink
                        to={`/problem/update/${problem._id}`}
                        onClick={() => console.log('Navigating to:', `/problem/update/${problem._id}`)}
                      >
                        {problem.title}
                      </NavLink>
                    </td>
                    <td>
                      <NavLink
                        to={`/problem/update/${problem._id}`}
                        className="btn btn-sm btn-primary btn-outline hover:bg-primary hover:text-white"
                      >
                        Update
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUpdate;