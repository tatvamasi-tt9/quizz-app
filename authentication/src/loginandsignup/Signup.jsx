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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-white px-8 py-6 rounded-xl shadow-xl w-80">
    <h1 className="text-2xl font-bold text-center mb-4">Register</h1>

    <form onSubmit={handlesignup}>
      
      <div className="mb-3">
        <label htmlFor="name" className="font-semibold block mb-1">Name</label>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          id="name"
          placeholder="Enter name"
          className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="font-semibold block mb-1">Email</label>
        <input
          onChange={handleChange}
          type="email"
          name="email"
          id="email"
          placeholder="Enter email"
          className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="font-semibold block mb-1">Password</label>
        <input
          onChange={handleChange}
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <button className="bg-green-500 w-full hover:bg-green-600 transition duration-200 text-white font-semibold py-2 rounded-xl mt-2">
        Register
      </button>

      <p className="text-sm text-center mt-3">
        Already have an account?
      </p>

      <Link
        to="/login"
        className="bg-gray-200 flex justify-center items-center hover:bg-gray-300 w-full py-2 rounded mt-2"
      >
        Login
      </Link>
    </form>

    <ToastContainer />
  </div>
</div></>
  )
}

export default Signup