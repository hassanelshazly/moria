import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";
import { red } from "@material-ui/core/colors";

import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog } from "../state/actions";

const GET_GROUPS = gql`
  query GetGroups {
    findAllGroups {
      id
      title
      profileUrl
      membersCount
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: red[500],
  },
  fab: {
    position: "fixed",
    bottom: 0,
    right: 0,
    margin: theme.spacing(4),
  },
}));

function Groups(props) {
  const { setDialog } = props;
  const classes = useStyles();

  const handleCreateGroup = () => {
    setDialog("create-group");
  };

  const { loading, error, data } = useQuery(GET_GROUPS);

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
  if (error) return null;

  return (
    <React.Fragment>
      <Paper>
        <List>
          {data.findAllGroups.map(({ id, title, profileUrl, membersCount }) => (
            <React.Fragment key={id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    alt={title}
                    src={profileUrl ? profileUrl : ""}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Link
                      component={RouterLink}
                      to={`/group/${encodeURIComponent(id)}`}
                    >
                      {title}
                    </Link>
                  }
                  secondary={`This groups has ${membersCount} member.`}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Fab
        className={classes.fab}
        color="primary"
        aria-label="add"
        onClick={handleCreateGroup}
      >
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}

Groups.propTypes = {
  setDialog: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    setDialog: (dialog) => dispatch(setDialog(dialog)),
  };
}

export default connect(null, mapDispatchToProps)(Groups);
