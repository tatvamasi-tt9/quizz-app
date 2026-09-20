import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {ToastContainer} from 'react-toastify'
import { handleSuccess , handleError } from "./toast"

const Login = ({setauthenticated}) => {
   
  const navigate=useNavigate();
  const [logindata,setlogindata]=useState({
    email:"",
    password:""

  })

  function handleChange(e){
         
    const {name,value}=e.target;
    const copylogindata={...logindata};
    copylogindata[name]=value;
    setlogindata(copylogindata);
  }

  
const handlelogup=async (e)=>{
    e.preventDefault();
    const {email,password }=logindata;
    if( !email || !password)
    {
       return handleError('name, email and password are required')
    }

    try{
      const url='http://localhost:8080/auth/login';
      const response=await fetch(url,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        credentials: "include", //  for cookies
        body: JSON.stringify(logindata)
      });
     
    const result =await response.json();
    const {success,message,name,error}=result;
    if(success){
      handleSuccess(message);
      
      localStorage.setItem('loggedInUser',name);
      setauthenticated(true);
      setTimeout(()=>{
        navigate('/home')
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
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to your account
          </p>

        </div>

        <form onSubmit={handlelogup} className="space-y-5">

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
                hover:border-slate-400
                focus:border-emerald-500
                focus:ring-4 focus:ring-emerald-500/10
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
                hover:border-slate-400
                focus:border-emerald-500
                focus:ring-4 focus:ring-emerald-500/10
              "
            />
          </div>

          {/* Login button */}
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
            Sign in
          </button>

          {/* Register */}
          <p className="text-center text-sm text-slate-500 pt-2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Create an account
            </Link>
          </p>

        </form>

      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-6">
        Securely sign in to access your account.
      </p>

    </div>

    <ToastContainer />
  </div>
</>

  )
}

export default Login