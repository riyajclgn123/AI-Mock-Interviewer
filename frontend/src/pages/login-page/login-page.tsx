import { useForm } from "@mantine/form";
import { Button, Card, Container, Input, Text, useMantineColorScheme } from "@mantine/core";
import { useAuth } from "../../authentication/use-auth";
import { Navigate, useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { createStyles } from "@mantine/emotion";

type LoginRequest = {
  userName: string;
  password: string;
};

export const LoginPage = ({ fetchCurrentUser }: { fetchCurrentUser: () => void }) => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {classes} = useStyles();
 
  const loginForm = useForm<LoginRequest>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: {
      userName: (value) => value.length <= 0 ? "Username must not be empty" : null,
      password: (value) => value.length <= 0 ? "Password must not be empty" : null,
    },
  });

  const handleLogin = (values: LoginRequest) => {
    login(values.userName, values.password);
    fetchCurrentUser();
    navigate(routes.home);
  };

  if (isAuthenticated) {
    return <Navigate to={routes.home} />;
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}>
      <Card
        shadow="sm"
        padding="lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <form onSubmit={loginForm.onSubmit(handleLogin)}>
          <Text className={classes.box} size="xl" style={{ marginBottom: "20px" }}>
            Welcome Back
          </Text>

          <Input.Wrapper label="Username" style={{ marginBottom: "15px" }}>
            <Input
              placeholder="Enter your username"
              {...loginForm.getInputProps("userName")}
            />
            {loginForm.errors.userName && (
              <Text color="red" size="sm">
                {loginForm.errors.userName}
              </Text>
            )}
          </Input.Wrapper>

          <Input.Wrapper label="Password" style={{ marginBottom: "25px" }}>
            <Input
              type="password"
              placeholder="Enter your password"
              {...loginForm.getInputProps("password")}
            />
            {loginForm.errors.password && (
              <Text color="red" size="sm">
                {loginForm.errors.password}
              </Text>
            )}
          </Input.Wrapper>

          <Button
            type="submit"
            fullWidth
            style={{ marginTop: "10px" }}
            variant="gradient"
            gradient={{ from: 'indigo', to: 'violet' }}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

const useStyles = createStyles((theme) => {
   const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  return {
    box:{
      display:"flex",
    },
  }
})