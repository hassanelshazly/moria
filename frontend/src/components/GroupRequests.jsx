import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";
import { red } from "@material-ui/core/colors";

import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import { showSnackbar } from "../state/actions";

const ACCEPT_REQUEST = gql`
  mutation AcceptRequest($group_id: ID!, $user: ID!) {
    acceptRequest(groupId: $group_id, memberId: $user) {
      id
    }
  }
`;

const useStyles = makeStyles(() => ({
  avatar: {
    backgroundColor: red[500],
  },
}));

function GroupRequests(props) {
  const { group_id, requests, loading, showSnackbar } = props;
  const classes = useStyles();
  const [requestsState, setRequestsState] = useState(requests);
  const [acceptRequest] = useMutation(ACCEPT_REQUEST, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  });

  if (loading)
    return (
      <Paper>
        <List>
          {[0, 1, 2, 3].map((id) => (
            <React.Fragment key={id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Skeleton variant="circle">
                    <Avatar />
                  </Skeleton>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Skeleton
                      animation="wave"
                      height={10}
                      width="40%"
                      style={{ marginBottom: 6 }}
                    />
                  }
                  secondary={
                    <Skeleton animation="wave" height={10} width="20%" />
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    );

  return (
    <Paper>
      <List>
        {requestsState &&
          requestsState.map(({ id, username, fullname, profileUrl }) => (
            <React.Fragment key={id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    alt={fullname}
                    src={profileUrl ? profileUrl : ""}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Link
                      component={RouterLink}
                      to={`/profile/${encodeURIComponent(username)}`}
                    >
                      {fullname}
                    </Link>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="accept-member"
                    onClick={() => {
                      acceptRequest({ variables: { group_id, user: id } });
                      setRequestsState((prevRequests) =>
                        prevRequests.filter((el) => el.id === id)
                      );
                    }}
                  >
                    <DoneOutlineIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
      </List>
    </Paper>
  );
}

GroupRequests.propTypes = {
  group_id: PropTypes.any,
  requests: PropTypes.any,
  loading: PropTypes.any,
  showSnackbar: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(null, mapDispatchToProps)(GroupRequests);
