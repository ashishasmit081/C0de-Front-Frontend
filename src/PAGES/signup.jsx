import { useState, useEffect } from "react"
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // or 'zod/v4'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../authSlice";

//Creating schema validation for signup form
const signupSchema = z.object({
    firstName: z.string().min(2, "Name should contain at least 2 characters"),
    lastName: z.string().min(2, "Name should contain at least 2 characters"),
    emailID: z.string().email("Invalid email address"),
    password: z.string()
                .min(8, "Password must be at least 8 characters")
                .regex(/[A-Z]/, "Must include an uppercase letter")
                .regex(/[a-z]/, "Must include a lowercase letter")
                .regex(/[0-9]/, "Must include a number")
                .regex(/[^A-Za-z0-9]/, "Must include a special character")
})



export default function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuthenticated, loading, error} = useSelector((state)=> state.auth);
  //redirect to homepage
    useEffect(()=>{
      if(isAuthenticated){
        navigate('/');
      }
    }, [isAuthenticated]);

    //sending the info from form
    const onSubmit = (data) =>{
      console.log("userData", data, Object.keys(data));
      dispatch(registerUser(data));
    };


    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });

    return (
  <div className="relative min-h-screen  bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center px-4 py-20 text-white overflow-hidden">

    {/* Background Circle */}
    <div className="absolute top-1/2 left-1/2 w-[150vh] h-[150vh] -translate-x-1/2 -translate-y-1/2 bg-white/1 rounded-full blur-xl z-0" />

    {/* Page Heading */}
    <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide text-primary-content drop-shadow-lg mb-12 text-center">
      <code>C0de Front</code>
    </h1>

    {/* Signup Form */}
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card w-full max-w-md bg-black/50 shadow-2xl p-8 space-y-5 rounded-xl backdrop-blur-sm z-10 border-0 border-b-[5px] border-b-gray-300"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-10 tracking-wide">
        Signup
      </h2>

      <input
        {...register('firstName')}
        placeholder="Enter first name"
        className="input input-bordered w-full text-white placeholder-white/60 input-lg"
      /> {errors.firstName && <p className="text-error text-sm">{errors.firstName.message}</p>}

      <input
        {...register('lastName')}
        placeholder="Enter last name"
        type="text"
        className="input input-bordered w-full text-white placeholder-white/60 input-lg"
      /> {errors.firstName && <p className="text-error text-sm">{errors.lastName.message}</p>}

      <input
        {...register('emailID')}
        placeholder="Enter email address"
        type="email"
        className="input input-bordered w-full text-white placeholder-white/60 input-lg"
      /> {errors.emailId && <p className="text-error text-sm">{errors.emailID.message}</p>}

      <input
        {...register('password')}
        placeholder="Enter your password"
        type="password"
        className="input input-bordered w-full text-white placeholder-white/60 input-lg"
      /> {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}

      <button
        type="submit"
        className="btn btn-primary w-full hover:scale-[1.02] transition-transform duration-200 tracking-wide btn-lg"
        disabled = {loading}
      >
        {loading ? 'Signing up...' : 'Signup'}
      </button>

      {/* Login Redirect */}
      <div className="text-center mt-4 text-base md:text-lg"> {/* Increased mt for spacing */}
        <span >
          Already have an account?{' '}
          <NavLink to="/login" className="link link-primary">
            Login
          </NavLink>
        </span>
      </div>

    </form>
  </div>
);

}

