const Avatar = ({ size = 40 }) => {
  const seed = localStorage.getItem("loggedInUser") || "quizzer";

  return (
    <img
      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
      alt="avatar"
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;