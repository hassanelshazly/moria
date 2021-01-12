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

function Home(props) {
  const { user, showSnackbar, setDialog, fillForm } = props;
  const { error, data } = useQuery(GET_FEED_POSTS, {
    skip: !user,
  });

  if (error) {
    showSnackbar("error", error.message);
  }

  const handleAction = () => {
    if (user) {
      fillForm("post", { type: "profile", id: user.username });
      setDialog("create-post");
    } else {
      setDialog("sign-in");
    }
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
          <Posts type="profile" posts={data.findTimeline} />
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
