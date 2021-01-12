/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
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
import Chat from "./pages/Chat";
import Discovery from './components/Discovery';
import { connect } from "react-redux";
// TODO: Revise useMemo() and useCallback(). Should we use React.memo(). Correct data after network.

function App(props) {
  const { user } = props;

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
          <Route path="/profile/">
            <Profile />
          </Route>
          <Route path="/chat/">
            <Chat />
          </Route>
          <Route path="/discovery">
             <Discovery />
          </Route>
        </Switch>
      </MainNav>
    </ApolloProvider>
  );
}

App.propTypes = {
  user: PropTypes.any,
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(App);
