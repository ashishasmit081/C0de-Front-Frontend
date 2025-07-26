import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../authSlice';
import SubmissionHistory from '../Components/SubmissionHistory';
import AIChatbot from '../Components/AIChatbot';
import Editorial from '../Components/editorial';

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let {problemId}  = useParams();

  const { handleSubmit } = useForm();

const darkMode = useSelector((state) => state.auth.darkMode);
const dispatch = useDispatch();


//DRAGGABLE COLUMN
  const containerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(650); // Default left width
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging || !containerRef.current) return;

      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const newWidth = e.clientX - containerLeft;

      // Set bounds
      const containerWidth = containerRef.current.offsetWidth;
      if (newWidth > 100 && newWidth < containerWidth - 100) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        
        const initialCode = response.data.startCode.find((sc) => {
        
        if (sc.language == "C++" && selectedLanguage == 'cpp')
        return true;
        else if (sc.language == "Java" && selectedLanguage == 'java')
        return true;
        else if (sc.language == "Javascript" && selectedLanguage == 'javascript')
        return true;

        return false;
        })?.initialCode || 'Hello';

        
        setProblem(response.data);
        
      
        
        setCode(initialCode);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === selectedLanguage)?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language === 'cpp' ? 'c++' : language); // Map 'cpp' to 'c++' to match backend
    // setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code:code,
        language: selectedLanguage
      });

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'c++': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

const tabs = ['description', 'editorial', 'solutions', 'submissions', 'AI Chatbot'];


  return (
    <div ref={containerRef} className={`h-screen  flex ${darkMode ? 'bg-base-600' : 'bg-gray-100 text-black'}`}>
              
    {/* Toggle Theme Button - Dark mode light mode*/}
      <label className="swap swap-rotate absolute top-0 right-5 ">
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
      {/* Left Panel */}
      <div  className="w-1/2 h-[100%] flex flex-col border-r border-base-300 max-w-[60vw]" style={{ width: `${leftWidth}px` }}>
        {/* Left Tabs */}
        <div className={` tabs tabs-bordered px-4 ${darkMode ? 'bg-base-200 text-white' : 'bg-wheat-100 text-black'}`} style={{ width: `${leftWidth}px` }}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`flex tab  ${activeLeftTab === tab ? ' tab-active border-b-2 border-blue-500 font-bold' : ''} ${darkMode ? 'bg-base-200 !text-white' : 'bg-gray-100 !text-black'}`}
            style={tab === 'AI Chatbot'? {border: '3px solid',borderImage: 'linear-gradient(to right, blue, hotpink, gold) 1'}: {}}

            onClick={() => setActiveLeftTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-primary">{problem.tags}</div>
                  </div>

                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className={` p-4 rounded-lg ${darkMode ? 'bg-base-200 text-white' : 'bg-blue-200 text-black'}`}>
                          <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial TV🕶️🍿</h2>
                  <h3 className='font-bold underline'>Live NOW: {problem?.title}</h3>



                 <div className="pt-10 relative h-120  w-xl aspect-[4/3] mx-auto">
                  {/* TV SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 336"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Outer TV frame */}
                    <rect x="24" y="24" width="420" height="288" rx="16" ry="16" stroke="black" strokeWidth="8" fill="none" />
                    
                    {/* Inner screen area */}
                    <rect x="40" y="56" width="380" height="235" rx="12" ry="12" fill="black" />

                    {/* Legs */}
                    <line x1="64" y1="312" x2="40" y2="336" stroke="black" strokeWidth="8" />
                    <line x1="384" y1="312" x2="408" y2="336" stroke="black" strokeWidth="8" />

                    {/* Antenna */}
                    <line x1="224" y1="0" x2="180" y2="48" stroke="black" strokeWidth="4" />
                    <line x1="224" y1="0" x2="268" y2="48" stroke="black" strokeWidth="4" />
                    <circle cx="224" cy="0" r="8" fill="black" />
                  </svg>

                  {/* Responsive overlay  editorial inside TV svg*/}
                  <div className="absolute left-[10.36%] top-[22.07%] w-[82.29%] h-[60.06%]">
                    <div className="w-full h-full shadow-amber-50 overflow-hidden bg-black text-white text-xs p-2 rounded">
                      {problem.secureUrl ? (
                        <Editorial
                          secureUrl={problem.secureUrl}
                          thumbnailUrl={problem.thumbnailUrl}
                          duration={problem.duration}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          Video coming soon...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className={` border rounded-lg ${darkMode ? 'border-base-300 bg-base-200 text-white' : 'border-blue-500 bg-white text-black'}`}>
                        <div className={` px-4 py-2 rounded-t-lg ${darkMode ? ' bg-base-200 text-white' : ' bg-white text-black'}`}>
                          <h3 className={` font-semibold ${darkMode ? ' bg-base-200 text-white' : ' bg-white text-black'}`}>{problem?.title} - {solution?.language}</h3>
                        </div>
                        <div className="p-4">
                        <Editor
                          height="300px"
                          defaultLanguage={solution?.language === 'c++' ? 'cpp' : solution?.language || 'cpp'}

                          value={solution?.completeCode}
                          theme={darkMode ? "vs-dark" : "light"}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            lineNumbers: "on",
                            wordWrap: "on",
                          }}
                        />
                      </div>

                      </div>
                    )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className="text-gray-500">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === 'AI Chatbot' && (
                <div className='prose max-w-none'>
                  <h2 className='text-xl font-bold mb-4'>CHAT with BRO😎</h2>
                  <div className='whitespace-pre-wrap text-sm leading-relaxed'>
                    {'You can chat with AI here'}
                    <div className={`border rounded-xl p-4 ${darkMode ? 'border-blue-500/0 bg-gradient-to-br from-gray-800/40 to-black/40' : 'border-white bg-gradient-to-br from-gray-300/50 to-blue-400/30'}`}>
                        <AIChatbot problem = {problem}></AIChatbot>
                    </div>
                    
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
      


  {/* Resizer handle */}
    <div
    onMouseDown={() => setDragging(true)}
    className="w-2 cursor-col-resize bg-gray-300 hover:bg-blue-500 transition-all duration-200 ease-in-out relative group"
    >
    {/* Visual bar */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-10 bg-gray-600 group-hover:bg-white rounded-full shadow-md transition-all duration-300" />
    </div>


      {/* Right Panel */}
      <div className="w-1/3 min-w-1/3 flex-1 flex-col flex h-screen"  >
        {/* Right Tabs */}
        <div className={`tabs px-4 flex space-x-2 ${darkMode ? 'bg-base-200' : 'bg-blue-200'}`}>
          {['code', 'testcase', 'result'].map((tab) => {
            const isActive = activeRightTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveRightTab(tab)}
                className={`
                  tab 
                  ${isActive ? 'tab-active border-b-2 border-blue-500 font-semibold' : ''}
                  ${darkMode 
                    ? '!text-white bg-base-200 hover:!text-white' 
                    : '!text-black bg-blue-200 hover:!text-black'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>


        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <div className="flex gap-2">
                  {['javascript', 'java', 'c++'].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'c++' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 h-screen">
                <Editor
                  height="99%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme={darkMode ? "vs-dark" : "vs-light"}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-base-300 flex justify-between">
                <div className="flex gap-2">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  {/* Run Button */}
                  <button
                    className={`relative btn btn-outline btn-sm flex items-center justify-center gap-2 px-4 py-2 transition-all duration-200
                      ${loading ? 'cursor-not-allowed opacity-70' : ''}
                      ${darkMode ? 'text-white border-white' : 'text-gray-800 border-gray-500'}
                    `}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></span>
                    ) : (
                      'Run'
                    )}
                  </button>

                  {/* Submit Button */}
                  <button
                    className={`relative btn btn-primary btn-sm flex items-center justify-center gap-2 px-4 py-2 transition-all duration-200
                      ${loading ? 'cursor-not-allowed opacity-70' : ''}
                    `}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-t-transparent border-purple-700 rounded-full animate-spin"></span>
                    ) : (
                      'Submit'
                    )}
                  </button>

                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult ? (
                <div
                  className={`p-4 rounded-xl border shadow transition-colors mb-4 ${
                    runResult.success
                      ? darkMode
                        ? 'bg-green-900 border-green-700 text-green-100'
                        : 'bg-green-50 border-green-300 text-green-800'
                      : darkMode
                      ? 'bg-red-900 border-red-700 text-red-100'
                      : 'bg-red-50 border-red-300 text-red-800'
                  }`}
                >
                  {runResult.success ? (
                    <>
                      <h4 className="text-lg font-semibold mb-2">✅ All test cases passed!</h4>
                      <p className="text-sm">Runtime: {runResult.runtime + " sec"}</p>
                      <p className="text-sm mb-4">Memory: {runResult.memory + " KB"}</p>

                      <div className="space-y-2">
                        {runResult.testCases.map((tc, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg text-xs font-mono transition-colors ${
                              darkMode
                                ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                                : 'bg-blue-100 text-gray-800 hover:bg-blue-200'
                            }`}
                          >
                            <div><strong>Input:</strong> {tc.stdin}</div>
                            <div><strong>Expected:</strong> {tc.expected_output}</div>
                            <div><strong>Output:</strong> {tc.stdout}</div>
                            <div className="text-green-500 font-semibold">✓ Passed</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="text-lg font-semibold mb-4">❌ Some test cases failed</h4>

                      <div className="space-y-2">
                        {runResult.testCases.map((tc, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg text-xs font-mono transition-colors ${
                              darkMode
                                ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            <div><strong>Input:</strong> {tc.stdin}</div>
                            <div><strong>Expected:</strong> {tc.expected_output}</div>
                            <div><strong>Output:</strong> {tc.stdout}</div>
                            <div className={`${tc.status_id == 3 ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                              {tc.status_id == 3 ? '✓ Passed' : '✗ Failed'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Run" to test your code with the example test cases.
                </div>
              )}

            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
                {submitResult ? (
                  <div
                  
                    className={`relative overflow-hidden p-6 rounded-2xl border-2 shadow-xl mb-6 transition-all duration-500 transform animate-slide-in
                      ${submitResult.status === "accepted"
                        ? darkMode
                          ? "bg-gradient-to-br from-green-900 via-green-700 to-green-800 text-green-100 border-green-600"
                          : "bg-gradient-to-br from-green-100 via-green-50 to-white text-green-800 border-green-300"
                        : darkMode
                        ? "bg-gradient-to-br from-red-900 via-red-700 to-red-800 text-red-100 border-red-600"
                        : "bg-gradient-to-br from-red-100 via-red-50 to-white text-red-800 border-red-300"
                      }
                    `}
                  >
                    {/* Animated Border Glow (pseudo-effect) */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none animate-glow-border"></div>

                    {/* Floating Celebration/Warning Icon */}
                    <div className="absolute -top-4 -right-4 text-6xl opacity-10 pointer-events-none animate-float">
                      {submitResult.status === "accepted" ? "🎊" : "⚠️"}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-4xl">
                        {submitResult.status === "accepted" ? "✅" : "❌"}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold tracking-wide">
                          {submitResult.status === "accepted" ? "Accepted!" : submitResult.status || "Error"}
                        </h4>
                        <p className="text-sm mt-1 opacity-80">
                          {submitResult.status === "accepted"
                            ? "All test cases passed. You're crushing it! 🚀"
                            : "Some test cases failed. Check your logic and try again."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2 text-sm font-semibold">
                      <div className="flex justify-between">
                        <span>Test Cases Passed</span>
                        <span>{submitResult.testCasesPassed}/{submitResult.testCasesTotal}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Runtime</span>
                        <span>{submitResult.runtime} sec</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Memory</span>
                        <span>{submitResult.memory} KB</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Click "Submit" to submit your solution for evaluation.
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ProblemPage;