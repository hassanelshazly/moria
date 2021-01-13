/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from "react-router-dom";
import { gql, useQuery ,useSubscription} from "@apollo/client";
import { connect } from "react-redux";
import { showSnackbar } from "../state/actions";
import HelpIcon from '@material-ui/icons/Help';
import AllInboxSharpIcon from '@material-ui/icons/AllInboxSharp';
import useSound from 'use-sound';
import notificationSound  from "./../assets/sounds/notification-sound.mp3";

const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    findNotifications {
      id
      content
      contentId
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

const NOTIFICATION_SUBSCRIPTION = gql`
subscription onNewNotification {
  newNotification {
    id
    content
    contentId
    user{
    username
      fullname
    }
    author{
      id
      fullname
      username
    }
  }

}`;

const useStyles = makeStyles(() => ({
  icon: {
    marginRight: "10px",
  },
}));

function NotificationsMenu(props) {
  const { closeMenu, showSnackbar } = props;
  const {
    data: subData,
    loading: subLoading,
    error: subError,
  } = useSubscription(NOTIFICATION_SUBSCRIPTION);

  const classes = useStyles();
  const history = useHistory();

  const [notifications, setNotifications] = useState([]);
  
  const { loading } = useQuery(GET_NOTIFICATIONS, {
    onCompleted({ findNotifications }) {
      setNotifications(findNotifications);
    },
  });
  const [play] = useSound(notificationSound);

  const handleNotificationClick = (content,contentId, username) => () => {
    if (content === "FOLLOW" || content === "POST")
      history.push(`/profile/${encodeURIComponent(username)}`);
    else if(content==="GROUP_ADD" || content==="GROUP_REQUEST" || content==="GROUP_POST")
       history.push(`/group/${encodeURIComponent(contentId)}`);
    
    else closeMenu();
  };
  if(subError) console.log (subError)

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
    if(subData &&  subData.newNotification.id != notifications[0].id)
    {
      play();
     
      let { id, content, contentId, author , user } = subData.newNotification;
      setNotifications(notifications => [{ id, content, contentId, author , user } , ...notifications ]);
      /*
      
        ADD A NOTIFICATION
      */
     showSnackbar("info", "New Notification");
    }
  
  return (
    <React.Fragment>
      {notifications.slice(0, 10).map(({ id, content, contentId, author , user }) => (
        <MenuItem
          key={id}
          onClick={handleNotificationClick(content, contentId, author.username)}
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
                    {`${author.fullname} liked your post.`}
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
            else if (content == "GROUP_REQUEST")
              return (
                <>
                  <HelpIcon className={classes.icon} />{" "}
                  <Typography>
                    {`${author.fullname} requested to join your group.`}
                  </Typography>{" "}
                </>
              );
            else if (content == "GROUP_ADD")
              return (
                <>
                  <AddIcon className={classes.icon} />{" "}
                  <Typography>
                    {`${author.fullname} added ${user.fullname} to group.`}
                  </Typography>{" "}
                </>
              );
            else if (content == "GROUP_POST")
              return (
                <>
                  <AllInboxSharpIcon className={classes.icon} />{" "}
                  <Typography>
                    {`${author.fullname} posted on your group.`}
                  </Typography>{" "}
                </>
              );


          })()}
        </MenuItem>
      ))}
    </React.Fragment>
  );
}


function mapDispatchToProps(dispatch) {
  return {
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(null, mapDispatchToProps)(NotificationsMenu);
