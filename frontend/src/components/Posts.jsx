import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { formatDistance } from "date-fns";

import Avatar0 from "../assets/images/avatar-0.png";
import Avatar1 from "../assets/images/avatar-1.png";
import Avatar2 from "../assets/images/avatar-2.png";

const posts = [
  {
    id: "0",
    user_id: "0",
    user_name: "Khaled Emara",
    user_photo: "",
    created_at: 1577836800,
    image:
      "https://cdn.pixabay.com/photo/2020/07/31/21/54/lighthouse-5454155_960_720.jpg",
    text: "This is the Cabrillo National Monument in San Diego, California.",
    liked: true,
    saved: false,
    like_count: 1,
    comments: [
      {
        id: "0",
        user_id: "2",
        user_name: "Eslam",
        user_photo: Avatar0,
        text: "This looks breathtaking!",
      },
      {
        id: "1",
        user_id: "3",
        user_name: "Radwa",
        user_photo: Avatar1,
        text: "I wish I was there.",
      },
      {
        id: "2",
        user_id: "4",
        user_name: "Ahmed",
        user_photo: Avatar2,
        text: "Wow! This is amazing.",
      },
    ],
  },
  {
    id: "1",
    user_id: "0",
    user_name: "Khaled Emara",
    user_photo: "",
    created_at: 1577836800,
    image: "",
    text: "This is a text post.",
    liked: false,
    saved: false,
    like_count: 0,
    comments: [
      {
        id: "3",
        user_id: "2",
        user_name: "Hassan",
        user_photo: Avatar0,
        text: "This looks breathtaking!",
      },
      {
        id: "4",
        user_id: "3",
        user_name: "Hosni",
        user_photo: Avatar1,
        text: "I wish I was there.",
      },
      {
        id: "5",
        user_id: "4",
        user_name: "Hussein",
        user_photo: Avatar2,
        text: "Wow! This is amazing.",
      },
    ],
  },
];

const useCommentStyles = makeStyles(() => ({
  avatar: {
    backgroundColor: red[500],
  },
}));

function Comment(props) {
  const classes = useCommentStyles();
  const { user_name, user_photo, text } = props;

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        {user_photo ? (
          <Avatar src={user_photo} alt={user_name} />
        ) : (
          <Avatar aria-label="avatar" className={classes.avatar}>
            {user_name[0]}
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText primary={user_name} secondary={text} />
    </ListItem>
  );
}

const commentPropTypes = {
  id: PropTypes.string.isRequired,
  user_id: PropTypes.string.isRequired,
  user_name: PropTypes.string.isRequired,
  user_photo: PropTypes.string,
  text: PropTypes.string.isRequired,
};

Comment.propTypes = commentPropTypes;

const usePostStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  comments: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

function Post(props) {
  const classes = usePostStyles();
  const [expanded, setExpanded] = React.useState(false);

  const { user_name, user_photo, created_at, image, text, comments } = props;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          user_photo ? (
            <Avatar src={user_photo} aria-label={user_name} />
          ) : (
            <Avatar aria-label="avatar" className={classes.avatar}>
              {user_name[0]}
            </Avatar>
          )
        }
        action={
          <IconButton aria-label="more">
            <MoreVertIcon />
          </IconButton>
        }
        title={user_name}
        subheader={formatDistance(new Date(created_at * 1000), new Date())}
      />
      {image && (
        <CardMedia className={classes.media} image={image} title={text} />
      )}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="like">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        {comments && (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="comments"
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </CardActions>
      {comments && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <List className={classes.root}>
              {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <Comment {...comment} />
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}

const postPropTypes = {
  user_name: PropTypes.string.isRequired,
  user_photo: PropTypes.string,
  created_at: PropTypes.number.isRequired,
  image: PropTypes.string,
  text: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.exact(commentPropTypes)),
};

Post.propTypes = postPropTypes;

function Posts() {
  return (
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid key={post.id} item xs={12}>
          <Post {...post} />
        </Grid>
      ))}
    </Grid>
  );
}

const postsPropTypes = {
  posts: PropTypes.arrayOf(PropTypes.exact(postPropTypes)),
};

Posts.propTypes = postsPropTypes;

export default Posts;
