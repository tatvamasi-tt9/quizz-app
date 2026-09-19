import { useEffect,useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "./toast";
import { ToastContainer } from "react-toastify";

import Second_page from "../2nd_page/Second_page";
const Home = () => {

  const navigate= useNavigate();
 

  return (
    <div>
      <Second_page  />
      <ToastContainer/>
      </div>
  )
}

export default Home