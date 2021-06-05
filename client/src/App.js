import React, { Fragment, Suspense, lazy } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import ErrorPage from "./ErrorPage";
// import Pace from "./shared/components/Pace";

const SignInComponent = lazy(() => import("./sign_in/components/Main"));

const SignOutComponent = lazy(() => import("./sign_out/components/Main"));

function App() {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {/* <Pace color={theme.palette.primary.light} /> */}
        <Suspense fallback={<Fragment />}>
          <Switch>
            <Route path="/c">
              <SignInComponent />
            </Route>
            <Route>
              <SignOutComponent />
            </Route>
            <Route component={ErrorPage} />
          </Switch>
        </Suspense>
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default App;
