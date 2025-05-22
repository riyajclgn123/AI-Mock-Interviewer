import { useForm } from "@mantine/form";
import { Button, Card, Container, Input, Text, useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import api from "../../config/axios";
import { createStyles } from "@mantine/emotion";

const useStyles = createStyles((theme, { isDark }: { isDark: boolean }) => ({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: isDark
      ? "linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%)"
      : "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: isDark ? "rgba(30, 30, 40, 0.95)" : "rgba(255, 255, 255, 0.95)",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 16,
  },
}));

export const SignupPage = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { classes } = useStyles({ isDark });
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    validate: {
      username: (val) => (!val ? "Required" : null),
      password: (val) => (!val ? "Required" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await api.post("/api/signup", values);
      alert("Signup successful. Please login.");
      navigate(routes.login);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Signup failed. Try a different username.");
    }
  };

  return (
    <div className={classes.wrapper}>
      <Card className={classes.card} shadow="sm">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Text className={classes.title}>Create Account</Text>

          <Input.Wrapper label="Username" required>
            <Input {...form.getInputProps("username")} />
          </Input.Wrapper>

          <Input.Wrapper label="Password" required mt="md">
            <Input type="password" {...form.getInputProps("password")} />
          </Input.Wrapper>

          <Input.Wrapper label="First Name" mt="md">
            <Input {...form.getInputProps("firstName")} />
          </Input.Wrapper>

          <Input.Wrapper label="Last Name" mt="md">
            <Input {...form.getInputProps("lastName")} />
          </Input.Wrapper>

          <Button type="submit" fullWidth mt="xl">
            Sign Up
          </Button>

          <Button
            fullWidth
            mt="sm"
            variant="subtle"
            color="blue"
            onClick={() => navigate(routes.login)}
          >
            Already have an account? Go to Login
          </Button>
        </form>
      </Card>
    </div>
  );
};
