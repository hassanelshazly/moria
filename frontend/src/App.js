import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

import MainNav from "./components/MainNav";

const Home = React.lazy(() => import("./pages/Home"));
const Profile = React.lazy(() => import("./pages/Profile"));
const SavedPosts = React.lazy(() => import("./pages/SavedPosts"));
const Pages = React.lazy(() => import("./pages/Pages"));
const Page = React.lazy(() => import("./pages/Page"));
const Groups = React.lazy(() => import("./pages/Groups"));
const Group = React.lazy(() => import("./pages/Group"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Discovery = React.lazy(() => import("./pages/Discovery"));

import { connect } from "react-redux";
// TODO: Revise useMemo() and useCallback(). Should we use React.memo(). Correct data after network.

function App(props) {
  const { token } = props;

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_HTTP_SCHEME}://${
      process.env.REACT_APP_HOSTNAME
    }${process.env.REACT_APP_PORT ? process.env.REACT_APP_PORT : ""}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const wsLink = new WebSocketLink({
    uri: `${process.env.REACT_APP_WEBSOCKETS_SCHEME}://${
      process.env.REACT_APP_HOSTNAME
    }${process.env.REACT_APP_PORT ? process.env.REACT_APP_PORT : ""}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );

  const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={apolloClient}>
      <MainNav>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/profile/">
              <Profile />
            </Route>
            <Route path="/saved/">
              <SavedPosts />
            </Route>
            <Route exact path="/page/">
              <Pages />
            </Route>
            <Route path="/page/:id/">
              <Page />
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
        </React.Suspense>
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
