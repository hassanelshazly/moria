import React from "react";
import PropTypes from "prop-types";
import CallToAction from "../components/CallToAction";
import Grid from "@material-ui/core/Grid";
import Posts from "../components/Posts";

import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog, showSnackbar, fillForm } from "../state/actions";

const GET_FEED_POSTS = gql`
  query GetFeedPosts {
    findTimeline {
      id
      user {
        id
        username
        fullname
        profileUrl
      }
      meta{
        type
        parentId
      }
      body
      imageUrl
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
          profileUrl
        }
      }
      likeCount
      commentCount
    }
  }
`;

const GET_SAVED_POSTS = gql`
  query GetSavedPosts($user_name: String!) {
    findUser(username: $user_name) {
      savedPosts {
        id
      }
    }
  }
`;

function Home(props) {
  const { user, showSnackbar, setDialog, fillForm } = props;
  const { error, data } = useQuery(GET_FEED_POSTS, {
    skip: !user,
  });
  const { error: errorSaved, data: dataSaved } = useQuery(GET_SAVED_POSTS, {
    variables: {
      user_name: user ? user.username : undefined,
    },
    skip: !user,
  });

  if (error) {
    showSnackbar("error", error.message);
  }
  if (errorSaved) {
    showSnackbar("error", errorSaved.message);
  }

  const handleAction = () => {
    if (user) {
      fillForm("post", { type: "profile", id: user.username });
      setDialog("create-post");
    } else {
      setDialog("sign-in");
    }
  };

  const savedPosts = dataSaved ? dataSaved.findUser.savedPosts : {};

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
          <Posts
            type="profile"
            posts={data.findTimeline}
            savedPosts={savedPosts}
          />
        </Grid>
      )}
    </Grid>
  );
}

Home.propTypes = {
  user: PropTypes.any,
  setDialog: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  fillForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

function mapDispatchToProps(dispatch) {
  return {
    setDialog: (dialog) => dispatch(setDialog(dialog)),
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
    fillForm: (form, fields) => dispatch(fillForm(form, fields)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
