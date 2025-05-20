import { Container } from "@mantine/core";
import { UserDto } from "../../constants/types";
import { PrimaryNavigation } from "../navigation/navigation";

type PageWrapperProps = {
  user?: UserDto;
  children?: React.ReactNode;
};

//This is the wrapper that surrounds every page in the app.  Changes made here will be reflect all over.
export const PageWrapper: React.FC<PageWrapperProps> = ({ user, children }) => {
  return (
    <div className="content">
      <PrimaryNavigation user={user} />
      <Container style={{ marginTop: "0px" }}>
        {children}
      </Container>
    </div>
  );
};