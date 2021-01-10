import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import InfoHeader from "../components/InfoHeader";
import Posts from "../components/Posts";
import Skeleton from "@material-ui/lab/Skeleton";

import { useRouteMatch, Redirect } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useStateValue } from "../state/store";
import { showSnackbar } from "../state/actions";

const GET_USER_POSTS = gql`
  query GetUserPosts($user_name: String!) {
    findUser(username: $user_name) {
      id
      username
      fullname
      posts {
        id
        user {
          id
          username
          fullname
        }
        body
        createdAt
        likes
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
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($user_id: ID!) {
    follow(id: $user_id) {
      id
    }
  }
`;

const useStyles = makeStyles(() => ({
  media: {
    height: 190,
  },
}));

function Profile() {
  // eslint-disable-next-line no-empty-pattern
  const [{ user }, dispatch] = useStateValue();
  const [followUser] = useMutation(FOLLOW_USER, {
    onCompleted() {
      dispatch(showSnackbar("success", "Successfully followed"));
    },
    onError(error) {
      dispatch(showSnackbar("error", error.message));
    },
  });

  const match = useRouteMatch("/profile/:user_name");
  let user_name = null;
  if (match && match.params && match.params.user_name) {
    user_name = match.params.user_name;
  }

  const { loading, error, data } = useQuery(GET_USER_POSTS, {
    variables: {
      user_name: user_name ? user_name : user ? user.username : undefined,
    },
    skip: !user,
  });

  const classes = useStyles();

  if (loading)
    return (
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
        <Skeleton animation="wave" variant="rect" className={classes.media} />
        <CardContent>
          <React.Fragment>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        </CardContent>
      </Card>
    );

  if (error) {
    dispatch(showSnackbar("error", error.message));
    return <Redirect to="/" />;
  }

  if (!data) {
    return null;
  }

  const { id: user_id, username, fullname, posts } = data.findUser;

  return (
    <React.Fragment>
      <InfoHeader
        title={fullname}
        label="Profile"
        profile_user={{ id: user_id, username }}
        action={followUser}
        checked={
          user_name
            ? user.following.some((el) => el.username === user_name)
            : null
        }
      />
      <br />
      <Posts posts={posts} />
    </React.Fragment>
  );
}

export default Profile;
