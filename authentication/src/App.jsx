import Signup from './loginandsignup/Signup';
import Login from './loginandsignup/Login';
import Home from './loginandsignup/Home';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { RefreshHandler } from './loginandsignup/RefreshHandler';
import Result from './Result_page/Result'
import Question from './quiz_page/question'
import History from './History.jsx/History'
import Firstpage from './loginandsignup/1st_page/Firstpage'
import ClusterTopics from './KnowledgeGraph/ClusterTopics'
function App() {

  const [authenticated,setauthenticated]=useState(false)

  
  const PrivateRoute=({element})=>{
    return authenticated?element:<Navigate to='/login'/>
  };




  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900
                 text-black dark:text-white transition-colors">
      <RefreshHandler setauthenticated={setauthenticated}/>
      <Routes>
        <Route path="/" element={ authenticated? <Navigate to="/home" />: <Firstpage/>} />
        <Route path="/login" element={<Login setauthenticated={setauthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/questions" element={<PrivateRoute element={<Question/>}/>}/>
        <Route path="/login/result/:resultId" element={<Result />} />
        <Route path="/login/history" element={<PrivateRoute element={<History />}/>} />
        <Route path="/questions/:sessionId" element={<PrivateRoute element={<Question/>}/>}/>
        <Route path="/cluster-topics" element={<PrivateRoute element={<ClusterTopics/>}/>}/>
      </Routes>
    </div>
  );
}

export default App;
