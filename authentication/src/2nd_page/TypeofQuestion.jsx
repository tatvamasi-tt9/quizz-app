
import { useState } from "react"
import { IoBookOutline } from "react-icons/io5";
import { RiCheckboxMultipleFill } from "react-icons/ri";

const TypeofQuestion = ({select}) => {

    const [selected,setselected]=useState(true);
  return (
    <div className="flex gap-5  w-100 mx-auto  max-h-[7vh] mt-35 dark:border-slate-700">

           <button onClick={()=>{select('MCQ'), setselected(true)}}  className={` py-2 text-lg font-bold flex justify-center items-center gap-5 w-full ${selected?' dark:bg-slate-950 dark:text-white bg-black text-white rounded-lg ':'dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
            <RiCheckboxMultipleFill className="text-3xl "/>Multiple choice</button> 
            <button onClick={()=>{select('opne-ended'), setselected(false)}} className={`text-lg font-bold flex justify-center items-center gap-5 w-full rounded-lg ${selected?'dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200':'bg-black text-white'  }`}>
              <IoBookOutline className="text-3xl " />Open-ended</button>
        
        </div>
  )
}

export default TypeofQuestion