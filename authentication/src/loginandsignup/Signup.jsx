import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {ToastContainer} from 'react-toastify'
import { handleSuccess , handleError } from "./toast"

const Signup = () => {
   
  const navigate=useNavigate();
  const [signupdata,setsignupdata]=useState({
    name:"",
    email:"",
    password:""

  })

  function handleChange(e){
         
    const {name,value}=e.target;
    const copysignupdata={...signupdata};     // this is shallow copy 
    copysignupdata[name]=value;
    setsignupdata(copysignupdata);
  }

  
const handlesignup=async (e)=>{ 
    e.preventDefault();                     // e.preventDefault() stops the browser from executing its default built-in behavior for a specific event .The default browser behavior reloads the entire page. Using e.preventDefault() stops the reload so you can validate inputs or send data silently using an API (like fetch or AJAX
    const {name,email,password }=signupdata;
    if(!name || !email || !password)
    {
       return handleError('name, email and password are required')
    }

    try{
      const url='http://localhost:8080/auth/signup';
      const response=await fetch(url,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(signupdata)
      });
    
    const result =await response.json();
    const {success,message,error}=result;
    if(success){
      handleSuccess(message);
      setTimeout(()=>{
        navigate('/login')
      },1000)
    }
    else if(error){
      const details = error?.details?.[0]?.message || message;
      handleError(details);
    }else if(!success){
      handleError(message)
    }


    }
    catch(err){
        handleError(err.message || "Something went wrong");
    }
  }







  return (

<>
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4">

    <div className="w-full max-w-md">

      {/* Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] px-8 py-9">

        {/* Header */}
        <div className="text-center mb-8">
         

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign up to get started with your account
          </p>
        </div>

        <form onSubmit={handlesignup} className="space-y-5">

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Full name
            </label>

            <input
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              placeholder="John Doe"
              className="
                w-full rounded-lg border border-slate-300
                bg-white px-4 py-3 text-sm text-slate-900
                placeholder:text-slate-400
                outline-none
                transition-all duration-200
                focus:border-emerald-500
                focus:ring-4 focus:ring-emerald-500/10
                hover:border-slate-400
              "
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email address
            </label>

            <input
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              className="
                w-full rounded-lg border border-slate-300
                bg-white px-4 py-3 text-sm text-slate-900
                placeholder:text-slate-400
                outline-none
                transition-all duration-200
                focus:border-emerald-500
                focus:ring-4 focus:ring-emerald-500/10
                hover:border-slate-400
              "
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Password
            </label>

            <input
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="
                w-full rounded-lg border border-slate-300
                bg-white px-4 py-3 text-sm text-slate-900
                placeholder:text-slate-400
                outline-none
                transition-all duration-200
                focus:border-emerald-500
                focus:ring-4 focus:ring-emerald-500/10
                hover:border-slate-400
              "
            />
          </div>

          {/* Register button */}
          <button
            type="submit"
            className="
              w-full rounded-lg
              bg-emerald-600
              px-4 py-3
              text-sm font-semibold text-white
              shadow-sm
              transition-all duration-200
              hover:bg-emerald-700
              hover:shadow-md
              active:scale-[0.98]
              focus:outline-none
              focus:ring-4 focus:ring-emerald-500/20
            "
          >
            Create account
          </button>

          {/* Login */}
          <p className="text-center text-sm text-slate-500 pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Sign in
            </Link>
          </p>

        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-6">
        By creating an account, you agree to our terms and privacy policy.
      </p>

    </div>

    <ToastContainer />
  </div>
</>

  )
}

export default Signup