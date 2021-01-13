import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import CommentTwoTone from "@material-ui/icons/CommentTwoTone";
import Divider from "@material-ui/core/Divider";
import FavoriteTwoTone from "@material-ui/icons/FavoriteTwoTone";
import MenuItem from "@material-ui/core/MenuItem";
import PostAddTwoTone from "@material-ui/icons/PostAddTwoTone";
import PermIdentityTwoTone from "@material-ui/icons/PermIdentityTwoTone";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";

import { gql, useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    findNotifications {
      id
      content
      user {
        fullname
      }
      author {
        id
        username
        fullname
      }
    }
  }
`;

const useStyles = makeStyles(() => ({
  icon: {
    marginRight: "10px",
  },
}));

function NotificationsMenu(props) {
  const { open, closeMenu } = props;

  const classes = useStyles();
  const history = useHistory();
  const [notifications, setNotifications] = useState([]);
  const [getNotifications, { loading }] = useLazyQuery(GET_NOTIFICATIONS, {
    fetchPolicy: "network-only",
    onCompleted({ findNotifications }) {
      setNotifications(findNotifications.slice(0, 10));
    },
  });

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    if (open) getNotifications();
  }, [open]);

  const handleNotificationClick = (content, username) => () => {
    if (content === "FOLLOW" || content === "POST")
      history.push(`/profile/${encodeURIComponent(username)}`);
    else closeMenu();
  };

  if (loading)
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
      <React.Fragment key={id}>
        <MenuItem alignItems="flex-start">
          <Skeleton variant="circle" width={25} height={25} />
          <Skeleton animation="wave" width={350} height={10} />
        </MenuItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    ));

  return (
    <React.Fragment>
      {notifications.map(({ id, content, author }) => (
        <MenuItem
          key={id}
          onClick={handleNotificationClick(content, author.username)}
        >
          {(() => {
            if (content == "FOLLOW")
              return (
                <>
                  <PermIdentityTwoTone className={classes.icon} />{" "}
                  <Typography>
                    {`${author.fullname} started following you!`}
                  </Typography>{" "}
                </>
              );
            else if (content == "LIKE")
              return (
                <>
                  <FavoriteTwoTone className={classes.icon} />{" "}
                  <Typography>
                    {`${author.fullname} liked a post you are following.`}
                  </Typography>{" "}
                </>
              );
            else if (content == "COMMENT")
              return (
                <>
                  <CommentTwoTone className={classes.icon} />{" "}
                  <Typography>
                    {`${author.fullname} commented on a post you are following.`}
                  </Typography>{" "}
                </>
              );
            else if (content == "POST")
              return (
                <>
                  <PostAddTwoTone className={classes.icon} />{" "}
                  <Typography>
                    {`${author.fullname} posted on their timeline.`}
                  </Typography>{" "}
                </>
              );
          })()}
        </MenuItem>
      ))}
    </React.Fragment>
  );
}

NotificationsMenu.propTypes = {
  closeMenu: PropTypes.func,
  open: PropTypes.bool,
};

export default NotificationsMenu;
