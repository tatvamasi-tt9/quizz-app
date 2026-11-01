import Navbar from "./Navbar"
import Introduction from "./Introduction"
import { Link } from "react-router-dom";

const Firstpage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Landing Navbar */}
      <nav className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>

            <span className="text-xl font-bold tracking-tight">
              QUIZZR
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <Introduction />

    </div>
  );
};

export default Firstpage;