import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to timeline tab
    navigate("../timeline", { replace: true, relative: "path" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center">
      <div className="text-white text-xl">Redirecting to timeline...</div>
    </div>
  );
};

export default Schedule;
