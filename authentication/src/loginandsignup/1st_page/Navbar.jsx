import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDarkMode, MdHistory, MdLogout,MdLightMode } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FaBrain } from "react-icons/fa";
import Avatar from "./Avatar";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const menuRef = useRef();
  const navigate = useNavigate();


  const handleLogout = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    navigate("/login");
  };



 let seed = localStorage.getItem("avatarSeed");

if (!seed) {
  seed = Math.random().toString(36);
  localStorage.setItem("avatarSeed", seed);
}


  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);



  // dark mode
const [dark, setDark] = useState(
  localStorage.getItem("theme") === "dark"
);

useEffect(() => {
  if (dark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [dark]);









  return (
    <nav className="w-full border-b border-gray-200 dark:border-slate-800
                    bg-white dark:bg-slate-950
                    px-6 py-3 flex justify-between items-center
                    transition-colors duration-300">

      {/* Logo */}
     

<h1
  className="text-2xl font-extrabold tracking-tight ml-10 bg-gradient-to-r from-gray-600 to-stone-600
     dark:from-white to-violet-600 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]
    hover:drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition"
>
  Quizzer
</h1>



      {/* Profile */}
      <div className="relative" ref={menuRef}>
        <button onClick={()=>setOpen(!open)} className="w-10 h-10 rounded-full overflow-hidden">
          <Avatar size={40} />
        </button>


        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-60 rounded-xl shadow-2xl 
                          bg-white dark:bg-slate-900 
                          border border-gray-200 dark:border-slate-800 
                          py-2 z-50 animate-fadeIn">

            {/* Brand */}
            <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
              🧠 QUIZZER
            </div>

            <div className="border-t border-gray-400" />

           <button onClick={() => navigate("/home")}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                <FaHome className="text-blue-500"/> Return to Dashboard</button>


            {/* History */}
            <button
              onClick={() => navigate("/login/history")}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              <MdHistory className="text-purple-500"/>
              <span>History</span>
            </button>

            {/* Dark Mode */}
            <button onClick={() => setDark(!dark)}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
              {dark ? <MdLightMode className="text-yellow-500" /> : <MdDarkMode className="text-slate-700" />}
              <span>{dark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <div className="my-1 border-t border-gray-100 dark:border-slate-800" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <MdLogout />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
