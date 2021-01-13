import React from "react";
import PropTypes from "prop-types";
import PageHeader from "../components/PageHeader";
import Posts from "../components/Posts";

import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { showSnackbar } from "../state/actions";

const GET_PAGE_DATA = gql`
  query GetPageData($page_id: ID!) {
    findPage(pageId: $page_id) {
      id
      owner {
        id
        username
        fullname
        profileUrl
      }
      title
      coverUrl
      profileUrl
      createdAt
      followers {
        id
        username
        fullname
        profileUrl
      }
      followersCount
      posts {
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

function Page(props) {
  const { user, showSnackbar } = props;
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_PAGE_DATA, {
    variables: {
      page_id: id,
    },
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
  }

  const findPage = data ? data.findPage : {};
  const savedPosts = dataSaved ? dataSaved.findUser.savedPosts : {};
  const { owner, title, coverUrl, profileUrl, followers, posts } = findPage;

  return (
    <React.Fragment>
      <PageHeader
        id={id}
        admin={owner}
        title={title}
        coverUrl={coverUrl}
        profileUrl={profileUrl}
        followers={followers}
        loading={loading || loadingSaved}
      />
      <br />
      {posts && (
        <Posts type="page" thingId={id} posts={posts} savedPosts={savedPosts} />
      )}
    </React.Fragment>
  );
}

Page.propTypes = {
  user: PropTypes.any,
  showSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

function mapDispatchToProps(dispatch) {
  return {
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
