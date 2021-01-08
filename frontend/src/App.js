import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import MainNav from "./components/MainNav";

import Home from "./pages/Home";
import Profile from "./pages/Profile";

import { useStateValue } from "./state/store";

function App() {
  const [{ user }] = useStateValue();

  const httpLink = createHttpLink({
    uri: "http://localhost:4000/",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: user ? `Bearer ${user.token}` : "",
      },
    };
  });

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={apolloClient}>
      <MainNav>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
        </Switch>
      </MainNav>
    </ApolloProvider>
  );
}

export default App;
