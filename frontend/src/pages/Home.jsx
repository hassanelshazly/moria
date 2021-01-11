import React from "react";
import CallToAction from "../components/CallToAction";
import Grid from "@material-ui/core/Grid";
import Posts from "../components/Posts";

import { Redirect } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useStateValue } from "../state/store";
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

function Home() {
  const [{ user }, dispatch] = useStateValue();
  const { error, data } = useQuery(GET_FEED_POSTS, {
    skip: !user,
  });

  if (error) {
    dispatch(showSnackbar("error", error.message));
    return <Redirect to="/" />;
  }

  const handleAction = () => {
    if (user) dispatch(setDialog("create-post"));
    else dispatch(setDialog("sign-in"));
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

export default Home;
