import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { routes } from ".";
import { LandingPage } from "../pages/landing-page/landing-page";
import { UserPage } from "../pages/user-page/user-page";
import { NotFoundPage } from "../pages/not-found-page/not-found";
import { useAuth, useUser } from "../authentication/use-auth";
import { FeedbackPage } from "../pages/feedback-page/feedback";
import { PracticePage } from "../pages/practice-page/practice";
import { HistoryPage } from "../pages/history-page/history";
import { InteractingPage } from "../pages/interacting-page/interacting";

export const Routes = () => {
  const { isAuthenticated } = useAuth();
  const user = useUser();
  
  return (
    <>
      <PageWrapper >
        <Switch>
          <Route path={routes.home} element={<LandingPage />} />
          <Route 
            path={routes.user} 
            element={isAuthenticated ? <UserPage /> : <LandingPage/>} 
          />
          <Route path={routes.root} element={<LandingPage />} />
          <Route path={routes.practice} element={<PracticePage />} />
          <Route path={routes.feedback} element={<FeedbackPage />} />
          <Route path={routes.history} element={<HistoryPage />} />
          <Route path={routes.interacting} element={<InteractingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Switch>
      </PageWrapper>
    </>
  );
};