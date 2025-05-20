import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { routes } from ".";
import { useUser } from "../authentication/use-auth";
import { LandingPage } from "../pages/landing-page/landing-page";
import { UserPage } from "../pages/user-page/user-page";
import { NotFoundPage } from "../pages/not-found-page/not-found";

//This is where you will tell React Router what to render when the path matches the route specified.
export const Routes = () => {
  //Calling the useUser() from the use-auth.tsx in order to get user information
  const user = useUser();
  return (
    <>
      {/* The page wrapper is what shows the NavBar at the top, it is around all pages inside of here. */}
      <PageWrapper user={user}>
        <Switch>
          {/* When path === / render LandingPage */}
          <Route path={routes.home} element={<LandingPage />} />
          {/* When path === /user render UserPage */}
          <Route path={routes.user} element={<UserPage />} />
          {/* This is the default route, it will redirect to the homepage */}
          {/* If you go to "localhost:5001/user" it will go to homepage */}
          {/* Going to route "localhost:5001/" will go to homepage */}
          <Route path={routes.root} element={<Navigate to={routes.home} />} />
          {/* This should always come last.  
            If the path has no match, show page not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Switch>
      </PageWrapper>
    </>
  );
};
