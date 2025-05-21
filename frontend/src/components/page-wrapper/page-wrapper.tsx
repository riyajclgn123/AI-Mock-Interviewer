import { Container } from "@mantine/core";
import { PrimaryNavigation } from "../navigation/navigation";
import { useAuth } from "../../authentication/use-auth";

type PageWrapperProps = {
  children?: React.ReactNode;
};

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="content">
      <PrimaryNavigation  user={user}/>
      <div style={{ marginTop: "20px", padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};