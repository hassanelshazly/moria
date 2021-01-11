import React from "react";
import PropTypes from "prop-types";
import CallToAction from "../components/CallToAction";
import Grid from "@material-ui/core/Grid";
import Posts from "../components/Posts";

import { Redirect } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog, showSnackbar } from "../state/actions";

const GET_FEED_POSTS = gql`
  query GetFeedPosts {
    findTimeline {
      id
      user {
        id
        username
        fullname
      }
      body
      createdAt
      likes {
        id
      }
      comments {
        id
        body
        user {
          id
          username
          fullname
        }
      }
      likeCount
      commentCount
    }
  }
`;

function Home(props) {
  const { user, showSnackbar, setDialog } = props;
  const { error, data } = useQuery(GET_FEED_POSTS, {
    skip: !user,
  });

  if (error) {
    showSnackbar("error", error.message);
    return <Redirect to="/" />;
  }

  const handleAction = () => {
    if (user) setDialog("create-post");
    else setDialog("sign-in");
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CallToAction
          headerTitle="Moria Social Media Platform"
          subheaderTitle="Connect with the people you care about"
          subtitle={
            user ? `Start posting now` : "Sign in and start posting now"
          }
          primaryActionText={user ? "Post" : "Sign in"}
          handlePrimaryAction={handleAction}
        />
      </Grid>
      {data && (
        <Grid item xs={12}>
          <Posts posts={data.findTimeline} />
        </Grid>
      )}
    </Grid>
  );
}

Home.propTypes = {
  user: PropTypes.any,
  setDialog: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

function mapDispatchToProps(dispatch) {
  return {
    setDialog: (dialog) => dispatch(setDialog(dialog)),
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
