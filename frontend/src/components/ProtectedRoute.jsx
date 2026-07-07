import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children, role }) => {
  const { user,loading } = useContext(UserContext);
   if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {

    return <Navigate to="/" replace />;
  }

  if (role && user.rol !== role) {

      return <Navigate to="/" replace />;

    }

  return children;
}

export default ProtectedRoute;