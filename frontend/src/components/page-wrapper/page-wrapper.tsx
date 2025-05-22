import { Navigate } from "react-router-dom"; // ✅ import Navigate
import { Container } from "@mantine/core";
import { PrimaryNavigation } from "../navigation/navigation";
import { useAuth } from "../../authentication/use-auth";
import { routes } from "../../routes"; // ✅ make sure you have routes.login

type PageWrapperProps = {
  children?: React.ReactNode;
};

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // ✅ Redirect if user not logged in
  if (!isAuthenticated) {
    return <Navigate to={routes.login} />;
  }

  return (
    <div className="content">
      <PrimaryNavigation user={user} />
      <div style={{ marginTop: "20px", padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};
