import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../authSlice';
import ParticleEffect from '../utils/particleEffect';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['c++', 'java', 'javascript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['c++', 'java', 'javascript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const darkMode = useSelector((state) => state.auth.darkMode);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const languageMap = ['cpp', 'java', 'javascript']; // Monaco language identifiers

  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'c++', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'c++', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axiosClient.post('/problem/create', data);
      setAlert({ type: 'success', message: 'Problem created successfully!' });
      setTimeout(() => navigate('/admin'), 1500); // wait for alert to show
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 relative ${darkMode ? 'bg-[#121212] text-white' : 'bg-white text-black'}`}>
      <ParticleEffect darkMode={darkMode}></ParticleEffect>
      {/* Toggle Theme Button - Dark mode light mode */}
      <label className="swap swap-rotate absolute top-4 right-5 ">
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
          viewBox="0 0 24 24"
        >
          <path
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
          />
        </svg>

        {/* Moon icon */}
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
      {/* 🔔 Alert at the bottom */}
      {alert.message && (
        <div
          role="alert"
          className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} mb-4 absolute bottom-2.5`}
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

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* --- Basic Information --- */}
          <div className={`card shadow-lg p-6 border-l-4 ${darkMode ? 'bg-[#1a1a1a] border-gray-600 text-white' : 'bg-blue-100 border-gray-400 text-black'}`}>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className={`${darkMode ? 'text-white' : 'text-black'} label-text`}>Title</span>
                </label>
                <input
                  {...register('title')}
                  className={`input ml-5 border border-blue-600 input-bordered ${errors.title ? 'input-error' : ''} ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                />
                {errors.title && <span className="text-error">{errors.title.message}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className={`${darkMode ? 'text-white' : 'text-black'} label-text`}>Description</span>
                </label>
                <textarea
                  {...register('description')}
                  className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''} ml-5 border-blue-600 ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                />
                {errors.description && <span className="text-error">{errors.description.message}</span>}
              </div>

              <div className="flex gap-4">
                <div className="form-control w-1/2">
                  <label className="label">
                    <span className={`${darkMode ? 'text-white' : 'text-black'} label-text`}>Difficulty</span>
                  </label>
                  <select
                    {...register('difficulty')}
                    className={`select select-bordered ${errors.difficulty ? 'select-error' : ''} ml-5 border-purple-600 ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-control w-1/2">
                  <label className="label">
                    <span className={`${darkMode ? 'text-white' : 'text-black'} label-text`}>Tag</span>
                  </label>
                  <select
                    {...register('tags')}
                    className={`select select-bordered ${errors.tags ? 'select-error' : ''} ml-5 border-purple-600 ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* --- Test Cases --- */}
          <div className={`card shadow-lg p-6 border-l-4 ${darkMode ? 'bg-[#1a1a1a] border-gray-600 text-white' : 'bg-blue-100 border-gray-400 text-black'}`}>
            <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

            {/* Visible */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Visible Test Cases</h3>
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-primary">
                  Add Visible Case
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div key={field.id} className={`border p-4 rounded-lg space-y-2 ${darkMode ? 'bg-[#2a2a2a] text-white border-gray-600' : ''}`}>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error">
                      Remove
                    </button>
                  </div>
                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input"
                    className={`input input-bordered w-full border-blue-600 ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                  />
                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Output"
                    className={`input input-bordered w-full border-blue-600 ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                  />
                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    className={`textarea textarea-bordered w-full border-blue-600 ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                  />
                </div>
              ))}
            </div>

            {/* Hidden */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Hidden Test Cases</h3>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-primary">
                  Add Hidden Case
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div key={field.id} className={`border p-4 rounded-lg space-y-2 ${darkMode ? 'bg-[#2a2a2a] text-white border-gray-600' : ''}`}>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-error">
                      Remove
                    </button>
                  </div>
                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className={`input input-bordered w-full border-blue-600 ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                  />
                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Output"
                    className={`input input-bordered w-full border-blue-600 ${darkMode ? 'bg-[#2a2a2a] text-white' : 'bg-white text-black'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- Code Templates --- */}
          <div className={`card shadow-lg p-6 border-l-4 ${darkMode ? 'bg-[#1a1a1a] border-gray-600 text-white' : 'bg-blue-100 border-gray-400 text-black'}`}>
            <h2 className="text-xl font-semibold mb-4">Code Templates</h2>

            <div className="space-y-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">
                    {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                  </h3>

                  {/* Initial Code Editor */}
                  <div className="form-control">
                    <label className="label">
                      <span className={`${darkMode ? 'text-white' : 'text-black'} label-text`}>Initial Code</span>
                    </label>
                    <div className={`${darkMode ? 'bg-[#2a2a2a]' : 'bg-base-300'} rounded-lg`}>
                      <Controller
                        name={`startCode.${index}.initialCode`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="200px"
                            language={languageMap[index]}
                            theme={darkMode ? "vs-dark" : "vs-light"}
                            value={field.value}
                            onChange={(val) => field.onChange(val ?? '')}
                            options={{ fontSize: 16, minimap: { enabled: false }, automaticLayout: true }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Reference Solution Editor */}
                  <div className="form-control">
                    <label className="label">
                      <span className={`${darkMode ? 'text-white' : 'text-black'} label-text`}>Reference Solution</span>
                    </label>
                    <div className={`${darkMode ? 'bg-[#2a2a2a]' : 'bg-base-300'} rounded-lg`}>
                      <Controller
                        name={`referenceSolution.${index}.completeCode`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="200px"
                            language={languageMap[index]}
                            theme={darkMode ? "vs-dark" : "vs-light"}
                            value={field.value}
                            onChange={(val) => field.onChange(val ?? '')}
                            options={{ fontSize: 16, minimap: { enabled: false }, automaticLayout: true }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-bars loading-md"></span> : 'Create Problem'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;