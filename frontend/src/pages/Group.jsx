import React from "react";
import PropTypes from "prop-types";
import GroupHeader from "../components/GroupHeader";
import GroupRequests from "../components/GroupRequests";
import Posts from "../components/Posts";

import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { showSnackbar } from "../state/actions";

const GET_GROUP_DATA = gql`
  query GetGroupData($group_id: ID!) {
    findGroup(groupId: $group_id) {
      id
      admin {
        id
        username
        fullname
        profileUrl
      }
      title
      coverUrl
      profileUrl
      createdAt
      members {
        id
        username
        fullname
        profileUrl
      }
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
      requests {
        id
        username
        fullname
        profileUrl
      }
    }
  }
`;

function Group(props) {
  const { user, showSnackbar } = props;
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_GROUP_DATA, {
    variables: {
      group_id: id,
    },
  });

  if (error) {
    showSnackbar("error", error.message);
    return null;
  }

  const findGroup = data ? data.findGroup : {};
  const {
    admin,
    title,
    coverUrl,
    profileUrl,
    members,
    posts,
    requests,
  } = findGroup;

  const isAnAdmin = user && admin ? admin.id === user.id : null;

  return (
    <React.Fragment>
      <GroupHeader
        id={id}
        admin={admin}
        title={title}
        coverUrl={coverUrl}
        profileUrl={profileUrl}
        members={members}
        requests={requests}
        loading={loading}
      />
      {isAnAdmin && requests.length > 0 && (
        <React.Fragment>
          <br />
          <GroupRequests group_id={id} requests={requests} loading={loading} />
        </React.Fragment>
      )}
      <br />
      {posts && <Posts type="group" thingId={id} posts={posts} />}
    </React.Fragment>
  );
}

Group.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Group);
