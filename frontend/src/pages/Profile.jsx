import React from "react";
import PropTypes from "prop-types";
import ProfileHeader from "../components/ProfileHeader";
import Posts from "../components/Posts";

import { useRouteMatch } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { showSnackbar } from "../state/actions";

const GET_USER_POSTS = gql`
  query GetUserPosts($user_name: String!) {
    findUser(username: $user_name) {
      id
      username
      fullname
      profileUrl
      coverUrl
      followers {
        id
      }
      following {
        id
      }
      posts {
        id
        isShared
        meta{
          type
          parentId
        }
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

function Profile(props) {
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
  const {
    loading: loadingSaved,
    error: errorSaved,
    data: dataSaved,
  } = useQuery(GET_SAVED_POSTS, {
    variables: {
      user_name: user ? user.username : undefined,
    },
    skip: !user,
  });

  if (error) {
    showSnackbar("error", error.message);
    return null;
  }
  if (errorSaved) {
    showSnackbar("error", errorSaved.message);
    return null;
  }

  const findUser = data ? data.findUser : {};
  const savedPosts = dataSaved ? dataSaved.findUser.savedPosts : {};
  const {
    id,
    username,
    fullname,
    profileUrl,
    coverUrl,
    posts,
    followers,
    following,
  } = findUser;

  return (
    <React.Fragment>
      <ProfileHeader
        profile_user={{
          id,
          username,
          fullname,
          followers,
          profileUrl,
          coverUrl,
        }}
        loading={loading || loadingSaved}
        followingCount={following ? following.length : 0}
        followersCount={followers ? followers.length : 0}
        postsCount={posts ? posts.length : 0}
      />
      <br />
      {posts && <Posts type="profile" posts={posts} savedPosts={savedPosts} />}
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
