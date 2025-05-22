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

// ✅ Fix: Accept isDark from outside and use that inside createStyles
const useStyles = createStyles((theme, { isDark }: { isDark: boolean }) => ({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: isDark
      ? "linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: isDark ? "rgba(30, 30, 40, 0.95)" : "rgba(255, 255, 255, 0.95)",
    padding: 24,
  },
  box: {
    display: "flex",
    justifyContent: "center",
    fontWeight: 600,
  },
}));

export const LoginPage = ({ fetchCurrentUser }: { fetchCurrentUser: () => void }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { classes } = useStyles({ isDark });

  const form = useForm<LoginRequest>({
    initialValues: { userName: "", password: "" },
    validate: {
      userName: (value) => (!value ? "Username must not be empty" : null),
      password: (value) => (!value ? "Password must not be empty" : null),
    },
  });

  const handleLogin = async (values: LoginRequest) => {
    try {
      await login(values.userName, values.password);
      fetchCurrentUser();
      navigate(routes.home);
    } catch {
      alert("Invalid login. Please check your username and password.");
    }
  };

  if (isAuthenticated) return <Navigate to={routes.home} />;

  return (
    <div className={classes.wrapper}>
      <Card className={classes.card} shadow="sm">
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Text className={classes.box} size="xl" mb="md">
            Welcome Back
          </Text>

          <Input.Wrapper label="Username" mb="sm">
            <Input placeholder="Enter your username" {...form.getInputProps("userName")} />
          </Input.Wrapper>

          <Input.Wrapper label="Password" mb="lg">
            <Input
              type="password"
              placeholder="Enter your password"
              {...form.getInputProps("password")}
            />
          </Input.Wrapper>

          <Button type="submit" fullWidth variant="gradient" gradient={{ from: "indigo", to: "violet" }}>
            Sign In
          </Button>

          <Button
            fullWidth
            mt="sm"
            variant="subtle"
            color="blue"
            onClick={() => navigate(routes.signup)}
          >
            Don't have an account? Sign Up
          </Button>
        </form>
      </Card>
    </div>
  );
};
