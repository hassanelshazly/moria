import React, { useState } from "react";
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
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FilledInput from "@material-ui/core/FilledInput";
import SendIcon from "@material-ui/icons/Send";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { formatDistance } from "date-fns";

import { gql, useMutation } from "@apollo/client";
import { useStateValue } from "../state/store";
import { showSnackbar } from "../state/actions";

const ADD_COMMENT = gql`
  mutation AddComment($post_id: ID!, $text: String!) {
    createComment(postId: $post_id, body: $text) {
      id
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($post_id: ID!) {
    likePost(postId: $post_id) {
      id
    }
  }
`;

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const userPropTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullname: PropTypes.string.isRequired,
};

const useCommentStyles = makeStyles(() => ({
  avatar: {
    backgroundColor: red[500],
  },
}));

function Comment(props) {
  const classes = useCommentStyles();
  const {
    user: { fullname: user_name },
    user_photo,
    body,
  } = props;

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
      <ListItemText primary={user_name} secondary={body} />
    </ListItem>
  );
}

const commentPropTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  user: PropTypes.exact(userPropTypes).isRequired,
  user_photo: PropTypes.string,
};

Comment.propTypes = commentPropTypes;

function CommentInput(props) {
  const classes = usePostStyles();
  const [
    {
      user: { id, username, fullname },
    },
    dispatch,
  ] = useStateValue();
  const [text, setText] = useState("");
  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted() {
      dispatch(showSnackbar("success", "Successfully commented"));
    },
    onError(error) {
      dispatch(showSnackbar("error", error.message));
    },
  });

  const { post_id, setCommentsState } = props;
  const user_photo = null;

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleCommentSend = () => {
    addComment({
      variables: {
        post_id,
        text,
      },
    });
    setCommentsState((prevState) => [
      { id: uuidv4(), body: text, user: { id, username, fullname } },
      ...prevState,
    ]);
    setText("");
  };

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        {user_photo ? (
          <Avatar src={user_photo} alt={fullname} />
        ) : (
          <Avatar aria-label="avatar" className={classes.avatar}>
            {fullname[0]}
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={fullname}
        secondary={
          <FilledInput
            id="comment-input"
            fullWidth
            value={text}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleCommentSend}
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        }
      />
    </ListItem>
  );
}

const commentInputPropTypes = {
  post_id: PropTypes.string.isRequired,
  setCommentsState: PropTypes.func.isRequired,
};

CommentInput.propTypes = commentInputPropTypes;

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
  const [{ user }, dispatch] = useStateValue();
  const [likePost] = useMutation(LIKE_POST, {
    onCompleted() {
      dispatch(showSnackbar("success", "Successfully liked"));
    },
    onError(error) {
      dispatch(showSnackbar("error", error.message));
    },
  });

  const {
    id,
    user: { fullname: user_name },
    user_photo,
    createdAt,
    image,
    body,
    comments,
    likes,
  } = props;

  const [likeState, setLikeState] = useState(likes.find(like => like.id == user.id));
  const [commentsState, setCommentsState] = useState(comments);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLikeToggle = () => {
    likePost({
      variables: {
        post_id: id,
      },
    });
    setLikeState((prevState) => !prevState);
  };

  return (
    <Card elevation={25}>
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
        subheader={formatDistance(
          new Date(Number(createdAt, 10) * 1000),
          new Date()
        )}
      />
      {image && (
        <CardMedia className={classes.media} image={image} title={body} />
      )}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="like" onClick={handleLikeToggle}>
          <FavoriteIcon
            style={{
              color: likeState ? red[600] : "rgba(0, 0, 0, 0.54)",
            }}
          />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
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
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <List className={classes.root}>
            <CommentInput post_id={id} setCommentsState={setCommentsState} />
            <Divider variant="inset" component="li" />
            {commentsState.map((comment) => (
              <React.Fragment key={comment.id}>
                <Comment {...comment} />
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  );
}

const postPropTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  commentCount: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(PropTypes.exact(commentPropTypes)).isRequired,
  createdAt: PropTypes.string.isRequired,
  likeCount: PropTypes.number.isRequired,
  likes: PropTypes.arrayOf(PropTypes.string).isRequired,
  user: PropTypes.exact(userPropTypes),
  user_photo: PropTypes.string,
  image: PropTypes.string,
};

Post.propTypes = postPropTypes;

function Posts(props) {
  return (
    <Grid container spacing={2}>
      {props.posts.map((post) => (
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
