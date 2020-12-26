import React from "react";
import { Switch, Route } from "react-router-dom";
import MainNav from "./components/MainNav";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <MainNav>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/sign-in">
          <SignIn />
        </Route>
      </Switch>
    </MainNav>
  );
}

export default App;
