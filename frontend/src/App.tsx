import React from "react";
import { MantineProvider, Container, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import { Routes } from "./routes/config";
import { AuthProvider } from "./authentication/use-auth";

const theme = createTheme({});

//This is almost the base level of your app.  You can also put global things here.
function App() {
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Notifications
                position="top-right"
                autoClose={3000}
                limit={5}
            />
            <Container
                px={0}
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
              <AuthProvider>
                <Routes />
              </AuthProvider>
            </Container>
        </MantineProvider>
    );
}
export default App;
