import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { toggleDarkMode } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

const darkMode = useSelector((state) => state.auth.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        // Ensure it's always an array
        setSubmissions(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'badge-success';
      case 'wrong answer': return 'badge-error';
      case 'error': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div >
        <div>
          <div>
            <span>No submissions found for this problem</span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Submission History</h2>
      
      {submissions.length === 0 ? (
        <div>
          <div>
            <span>No submissions found for this problem</span>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className={`text-blue-600 `}>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody >
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className={`h-auto ${darkMode ? 'hover:bg-gray-700 transition-all duration-200' : 'hover:bg-gray-300 transition-all duration-200'}`}>
                    <td>{index + 1}</td>
                    <td className="font-mono">{sub.language}</td>
                    <td>
                      <span className={`h-auto badge ${getStatusColor(sub.status)}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="font-mono">{sub.runtime}sec</td>
                    <td className="font-mono">{formatMemory(sub.memory)}</td>
                    <td className="font-mono">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td>{formatDate(sub.createdAt)}</td>
                    <td>
                      <button 
                        className="btn btn-s btn-outline"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className={`modal-box w-11/12 max-w-5xl  ${darkMode ? 'bg-gray-700 text-white transition-all duration-200' : 'bg-gray-300 text-black transition-all duration-200'}`}>
            <h3 className="font-bold text-lg mb-4">
              Submission Details: {selectedSubmission.language}
            </h3>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`badge ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </span>
                <span className="badge badge-outline">
                  Runtime: {selectedSubmission.runtime}s
                </span>
                <span className="badge badge-outline">
                  Memory: {formatMemory(selectedSubmission.memory)}
                </span>
                <span className="badge badge-outline">
                  Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
                </span>
              </div>
              
              {selectedSubmission.errorMessage && (
                <div className="alert alert-error mt-2">
                  <div>
                    <span>{selectedSubmission.errorMessage}</span>
                  </div>
                </div>
              )}
            </div>
            
            <pre className={`p-4 rounded overflow-x-auto ${darkMode ? 'bg-black transition-all duration-200' : 'bg-gray-100 text-black'}`}>
              <code>{selectedSubmission.code}</code>
            </pre>
            
            <div className="modal-action">
              <button 
                className="btn"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;