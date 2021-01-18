import React from "react";
import PropTypes from "prop-types";
import CallToAction from "../components/CallToAction";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Posts from "../components/Posts";
import Skeleton from "@material-ui/lab/Skeleton";

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
      meta {
        type
        parentId
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
  const { error, data, loading } = useQuery(GET_FEED_POSTS, {
    skip: !user,
  });
  const {
    error: errorSaved,
    data: dataSaved,
    loading: loadingSaved,
  } = useQuery(GET_SAVED_POSTS, {
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

  const savedPosts =
    dataSaved && dataSaved.findUser ? dataSaved.findUser.savedPosts : [];

  function displayLoadingPosts() {
    return [0, 1, 2, 3].map((id) => (
      <Grid key={id} item xs={12}>
        <Card>
          <CardHeader
            avatar={
              <Skeleton
                animation="wave"
                variant="circle"
                width={40}
                height={40}
              />
            }
            title={
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ marginBottom: 6 }}
              />
            }
            subheader={<Skeleton animation="wave" height={10} width="40%" />}
          />
          <Skeleton animation="wave" variant="rect" style={{ height: 190 }} />
          <CardContent>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </CardContent>
        </Card>
      </Grid>
    ));
  }

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
      {data && dataSaved && (
        <Grid item xs={12}>
          <Posts
            type="profile"
            posts={data.findTimeline}
            savedPosts={savedPosts}
          />
        </Grid>
      )}
      {(loading || loadingSaved) && displayLoadingPosts()}
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
