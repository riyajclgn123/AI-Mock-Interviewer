import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { routes } from ".";
import { LandingPage } from "../pages/landing-page/landing-page";
import { UserPage } from "../pages/user-page/user-page";
import { NotFoundPage } from "../pages/not-found-page/not-found";
import { useAuth } from "../authentication/use-auth";
import { FeedbackPage } from "../pages/feedback-page/feedback";
import { PracticePage } from "../pages/practice-page/practice";
import { HistoryPage } from "../pages/history-page/history";
import { InteractingPage } from "../pages/interacting-page/interacting";
import { SignupPage } from "../pages/login-page/signup";
import { LoginPage } from "../pages/login-page/login-page";

export const Routes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Public Routes - no PageWrapper */}
      <Route path={routes.login} element={<LoginPage fetchCurrentUser={() => {}} />} />
      <Route path={routes.signup} element={<SignupPage />} />
      <Route path={routes.root} element={<LandingPage />} />

      {/* Protected Routes - wrapped in PageWrapper */}
      <Route
        path={routes.home}
        element={
          <PageWrapper>
            <LandingPage />
          </PageWrapper>
        }
      />
      <Route
        path={routes.user}
        element={
          <PageWrapper>
            <UserPage />
          </PageWrapper>
        }
      />
      {/* <Route
        path={routes.practice}
        element={
          <PageWrapper>
            <PracticePage />
          </PageWrapper>
        }
      /> */}
      <Route
        path={routes.feedback}
        element={
          <PageWrapper>
            <FeedbackPage />
          </PageWrapper>
        }
      />
      <Route
        path={routes.history}
        element={
          <PageWrapper>
            <HistoryPage />
          </PageWrapper>
        }
      />
      <Route
        path={routes.interacting}
        element={
          <PageWrapper>
            <InteractingPage />
          </PageWrapper>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Switch>
  );
};
