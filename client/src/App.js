import React, { Fragment, Suspense, lazy} from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";

const SignInComponent = lazy(() => import("./sign_in/components/Main"));
const SignOutComponent = lazy(() => import("./sign_out/components/Main"));

function App() {
  
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Suspense fallback={<Fragment />}>
          <Switch>
            <Route path="/c">
              <SignInComponent />
            </Route>
            <Route>
              <SignOutComponent />
            </Route>
          </Switch>
        </Suspense>
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default App;
