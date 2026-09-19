import { FaTrophy, FaStar, FaBullseye } from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";

function getFeedback(accuracy) {
  if (accuracy >= 90) {
    return {
      title: "Outstanding",
      message: "Elite performance. You absolutely nailed it.",
      Icon: FaTrophy,
      iconColor: "text-yellow-500 dark:text-red-400",

  // text gradient (text-only)
  textColor:
    "bg-red-500 dark:from-red-400 dark:to-violet-400 bg-clip-text text-transparent"
    };
  } 
  if (accuracy >= 75) {
    return {
      title: "Impressive",
      message: "Great job! You're very close to perfection.",
      Icon: FaStar,
      iconColor: "text-amber-400 dark:text-red-400",

  // text gradient (text-only)
  textColor:
    "bg-red-500  dark:from-red-400 dark:to-violet-400 bg-clip-text text-transparent"
    };
  } 
  if (accuracy >= 50) {
    return {
      title: "Keep it up",
      message: "Good effort. You're on the right track.",
      Icon: MdTrendingUp,
      iconColor: "text-blue-400 dark:text-red-400",

  // text gradient (text-only)
  textColor:
    "bg-red-500 dark:from-red-400 dark:to-violet-400 bg-clip-text text-transparent"
    };
  }
  return {
    title: "Nice Try",
    message: "Focus and practice — improvement is guaranteed.",
    Icon: FaBullseye,
    iconColor: "text-red-500 dark:text-red-500",

  // text gradient (text-only)
  textColor:
    "bg-red-500 dark:from-violet-500 dark:to-violet-100 bg-clip-text text-transparent"

  };
}



const Score = ({accuracy}) => {

    const feedback=getFeedback(accuracy);
    const Icon = feedback.Icon;
    
  return (
   
   <div className="flex flex-col items-center text-center">
  <div
    className={`text-7xl mb-4 transition-transform duration-200 hover:scale-110 ${feedback.iconColor}`}
  >
    <Icon />
  </div>

  <h1 className={`text-3xl font-bold ${feedback.textColor}`}>
    {feedback.title}!
  </h1>

  <p className="text-gray-600 text-lg mt-3 max-w-md">
    {feedback.message}
  </p>
</div>


   
   
  )
}

export default Score