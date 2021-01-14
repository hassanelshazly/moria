import React from "react";
import PropTypes from "prop-types";
import Posts from "../components/Posts";

import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { showSnackbar } from "../state/actions";

const GET_SAVED_POSTS = gql`
  query GetSavedPosts($user_name: String!) {
    findUser(username: $user_name) {
      savedPosts {
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
        meta {
          type
          parentId
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

function SavedPosts(props) {
  const { user, showSnackbar } = props;
  const { error, data } = useQuery(GET_SAVED_POSTS, {
    variables: { user_name: user ? user.username : undefined },
    skip: !user,
  });

  if (error) {
    showSnackbar("error", error.message);
    return null;
  }

  if (!data) return null;

  const posts = data.findUser.savedPosts;

  return <Posts type="profile" posts={posts} savedPosts={posts} />;
}

SavedPosts.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SavedPosts);
