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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-white px-8 py-6 rounded-xl shadow-xl w-80">
    <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

    <form onSubmit={handlelogup}>
      <div className="mb-3">
        <label className="font-semibold block mb-1">Email</label>
        <input
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="Enter email"
          className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mb-3">
        <label className="font-semibold block mb-1">Password</label>
        <input
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="Enter password"
          className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <button className="bg-green-500 w-full hover:bg-green-600 transition duration-200 text-white font-semibold py-2 rounded-xl mt-2">
        Login
      </button>

      <p className="text-sm text-center mt-3">
        Don't have an account?
      </p>

      <Link
        to="/signup"
        className="bg-gray-200 flex justify-center items-center hover:bg-gray-300 w-full py-2 rounded mt-2"
      >
        Register
      </Link>
    </form>

    <ToastContainer />
  </div>
</div></>
  )
}

export default Login