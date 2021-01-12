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
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import Chat from "./pages/Chat";
import Discovery from "./pages/Discovery";

import { connect } from "react-redux";
// TODO: Revise useMemo() and useCallback(). Should we use React.memo(). Correct data after network.

function App(props) {
  const { token } = props;

  const httpLink = createHttpLink({
    uri: "http://localhost:4000/",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
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
          <Route exact path="/group/">
            <Groups />
          </Route>
          <Route path="/group/:id/">
            <Group />
          </Route>
          <Route path="/chat/">
            <Chat />
          </Route>
          <Route path="/discovery/">
            <Discovery />
          </Route>
        </Switch>
      </MainNav>
    </ApolloProvider>
  );
}

App.propTypes = {
  token: PropTypes.any,
};

const mapStateToProps = (state) => {
  return { token: state.user ? state.user.token : null };
};

export default connect(mapStateToProps)(App);
