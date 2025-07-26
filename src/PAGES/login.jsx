import { useState, useEffect } from "react"
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { loginUser } from "../authSlice";

//Creating schema validation for signup form
const signupSchema = z.object({
    emailID: z.string().email("Invalid email address"),
    password: z.string()
                .min(8, "Password must be at least 8 characters")
                .regex(/[A-Z]/, "Must include an uppercase letter")
                .regex(/[a-z]/, "Must include a lowercase letter")
                .regex(/[0-9]/, "Must include a number")
                .regex(/[^A-Za-z0-9]/, "Must include a special character")
})



export default function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuthenticated, loading, error} = useSelector((state)=> state.auth);

    const [showPassword, setShowPassword] = useState(false);

    //redirect to homepage
    useEffect(() => {
      if (isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);

    //sending the info from form
    const onSubmit = (data) =>{
      dispatch(loginUser(data));
    };

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });

    return (
  <div className="relative min-h-screen h-1 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center px-4 py-20 text-white overflow-hidden">

    {/* Background Circle */}
    <div className="absolute top-1/2 left-1/2 w-[150vh] h-[150vh] -translate-x-1/2 -translate-y-1/2 bg-white/1 rounded-full blur-xl z-0" />

    {/* Page Heading */}
    <h1 className="text-7xl md:text-7xl font-extrabold tracking-wide text-primary-content drop-shadow-lg mb-24 text-center">
      <code>C0de Front</code>
    </h1>

    {/* Signup Form */}
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card w-full max-w-md bg-black/50 shadow-2xl p-8 space-y-5 rounded-xl backdrop-blur-sm z-10 border-0 border-b-[5px] border-b-gray-300"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-10 tracking-wide ">
        Login
      </h2>

      <input
        {...register('emailID')}
        placeholder="Enter email address"
        className="input input-bordered w-full text-white placeholder-white/60 input-lg"
      />
      {errors.emailID && <p className="text-error text-sm">{errors.emailID.message}</p>}

      <div className="relative">
        <input
          {...register('password')}
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          className="input input-bordered w-full text-white placeholder-white/60 input-lg pr-10"
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white/70 hover:text-white"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}

      <button
        type="submit"
        className="btn btn-primary w-full hover:scale-[1.02] transition-transform duration-200 tracking-wide btn-lg"
        disabled = {loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {/* Moved signup prompt here */}
      <div className="text-center mt-4 text-base md:text-lg">
        <span>
          Don't have an account?{' '}
          <NavLink to="/signup" className="link link-primary">
            Sign Up
          </NavLink>
        </span>
      </div>
    </form>
  </div>
);
}