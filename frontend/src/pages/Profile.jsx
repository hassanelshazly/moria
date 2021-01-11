import React from "react";
import PropTypes from "prop-types";
import ProfileHeader from "../components/ProfileHeader";
import Posts from "../components/Posts";

import { useRouteMatch, Redirect } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { showSnackbar } from "../state/actions";

import useTraceUpdate from "../utils/useTraceUpdate";

const GET_USER_POSTS = gql`
  query GetUserPosts($user_name: String!) {
    findUser(username: $user_name) {
      id
      username
      fullname
      followers {
        id
      }
      following {
        id
      }
      posts {
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
  }
`;

function Profile(props) {
  useTraceUpdate(props);
  const { user, showSnackbar } = props;

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

  if (error) {
    showSnackbar("error", error.message);
    return <Redirect to="/" />;
  }

  const findUser = data ? data.findUser : {};
  const {
    id: user_id,
    username,
    fullname,
    posts,
    followers,
    following,
  } = findUser;

  return (
    <React.Fragment>
      <ProfileHeader
        profile_user={{ id: user_id, username, fullname }}
        loading={loading}
        followingCount={following.length}
        followersCount={followers.length}
        postsCount={posts.length}
      />
      <br />
      {posts && <Posts posts={posts} />}
    </React.Fragment>
  );
}

Profile.propTypes = {
  user: PropTypes.any,
  showSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

function mapDispatchToProps(dispatch) {
  return {
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
