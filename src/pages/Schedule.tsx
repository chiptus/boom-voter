import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main page with timeline view
    navigate('/?mainView=timeline', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center">
      <div className="text-white text-xl">Redirecting to timeline...</div>
    </div>
  );
};

export default Schedule;