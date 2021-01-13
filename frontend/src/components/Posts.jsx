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
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FilledInput from "@material-ui/core/FilledInput";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SendIcon from "@material-ui/icons/Send";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { red } from "@material-ui/core/colors";
import { formatDistance } from "date-fns";

import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import { setMenuAnchor, showSnackbar } from "../state/actions";

import uuidv4 from "../utils/uuid";

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

const DELETE_NORMAL_POST = gql`
  mutation DeletePost($post_id: ID!) {
    deletePost(postId: $post_id)
  }
`;

const DELETE_GROUP_POST = gql`
  mutation DeleteGroupPost($group_id: ID!, $post_id: ID!) {
    deleteGroupPost(groupId: $group_id, postId: $post_id)
  }
`;

const DELETE_PAGE_POST = gql`
  mutation DeletePagePost($page_id: ID!, $post_id: ID!) {
    deletePagePost(pageId: $page_id, postId: $post_id)
  }
`;

const userPropTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullname: PropTypes.string.isRequired,
  profileUrl: PropTypes.string.isRequired,
};

const useCommentStyles = makeStyles(() => ({
  avatar: {
    backgroundColor: red[500],
  },
}));

function Comment(props) {
  const classes = useCommentStyles();
  const {
    user: { fullname: user_name, profileUrl },
    body,
  } = props;

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        {profileUrl ? (
          <Avatar src={profileUrl} alt={user_name} />
        ) : (
          <Avatar aria-label="avatar" className={classes.avatar}>
            {user_name.length > 0 ? user_name[0] : "A"}
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
};

Comment.propTypes = commentPropTypes;

function CommentInputSender(props) {
  const classes = usePostStyles();
  const {
    post_id,
    user: { id, username, fullname, profileUrl },
    setCommentsState,
    showSnackbar,
  } = props;
  const [text, setText] = useState("");
  const [addComment] = useMutation(ADD_COMMENT, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  });

  const handleTextChange = (event) => {
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
      {
        id: uuidv4(),
        body: text,
        user: { id, username, fullname, profileUrl },
      },
      ...prevState,
    ]);
    setText("");
  };

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        {profileUrl ? (
          <Avatar src={profileUrl} alt={fullname} />
        ) : (
          <Avatar aria-label="avatar" className={classes.avatar}>
            {fullname.length > 0 ? fullname[0] : "A"}
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
            onChange={handleTextChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="send comment"
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
  user: PropTypes.any,
  setCommentsState: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

CommentInputSender.propTypes = commentInputPropTypes;

const mapCommentInputStateToProps = (state) => {
  return { user: state.user };
};

function mapCommentInputDispatchToProps(dispatch) {
  return {
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

const CommentInput = connect(
  mapCommentInputStateToProps,
  mapCommentInputDispatchToProps
)(CommentInputSender);

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

function PostViewer(props) {
  const {
    type,
    thingId,
    current_user,
    id,
    user: { username, fullname: user_name, profileUrl },
    createdAt,
    imageUrl,
    body,
    comments,
    likes,
    likeCount,
    handlePostDelete,
    showSnackbar,
  } = props;

  const classes = usePostStyles();
  const [likePost] = useMutation(LIKE_POST, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [deleteNormalPost] = useMutation(DELETE_NORMAL_POST, {
    onCompleted() {
      handlePostDelete(id);
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [deleteGroupPost] = useMutation(DELETE_GROUP_POST, {
    onCompleted() {
      handlePostDelete(id);
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [deletePagePost] = useMutation(DELETE_PAGE_POST, {
    onCompleted() {
      handlePostDelete(id);
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });

  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [likeState, setLikeState] = useState(
    likes.some((el) => el.id === current_user.id)
  );
  const [commentsState, setCommentsState] = useState(comments);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    switch (type) {
      case "profile":
        deleteNormalPost({
          variables: {
            post_id: id,
          },
        });
        break;
      case "group":
        deleteGroupPost({
          variables: {
            group_id: thingId,
            post_id: id,
          },
        });
        break;
      case "page":
        deletePagePost({
          variables: {
            page_id: thingId,
            post_id: id,
          },
        });
        break;
    }
    setMenuAnchor(null);
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
          profileUrl ? (
            <Avatar src={profileUrl} aria-label={user_name} />
          ) : (
            <Avatar aria-label="avatar" className={classes.avatar}>
              {user_name.length > 0 ? user_name[0] : "A"}
            </Avatar>
          )
        }
        action={
          <React.Fragment>
            <IconButton aria-label="more" onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="more-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </React.Fragment>
        }
        title={
          <Link
            component={RouterLink}
            to={`/profile/${encodeURIComponent(username)}`}
          >
            {user_name}
          </Link>
        }
        subheader={formatDistance(new Date(Number(createdAt, 10)), new Date())}
      />
      {imageUrl && (
        <CardMedia className={classes.media} image={imageUrl} title={body} />
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
        {likeCount}
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
  type: PropTypes.string,
  thingId: PropTypes.string,
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  commentCount: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(PropTypes.exact(commentPropTypes)).isRequired,
  createdAt: PropTypes.string.isRequired,
  likeCount: PropTypes.number.isRequired,
  likes: PropTypes.arrayOf(PropTypes.string).isRequired,
  handlePostDelete: PropTypes.func.isRequired,
  user: PropTypes.exact(userPropTypes),
  imageUrl: PropTypes.string,
  current_user: PropTypes.any,
  showSnackbar: PropTypes.func.isRequired,
};

PostViewer.propTypes = postPropTypes;

const mapPostStateToProps = (state) => {
  return { current_user: state.user };
};

function mapPostDispatchToProps(dispatch) {
  return {
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

const Post = connect(mapPostStateToProps, mapPostDispatchToProps)(PostViewer);

function Posts(props) {
  const [posts, setPosts] = useState(props.posts);

  const handleDeletePost = (id) => {
    setPosts((posts) => posts.filter((el) => el.id !== id));
  };

  return (
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid key={post.id} item xs={12}>
          <Post
            type={props.type}
            thingID={props.thingId}
            {...post}
            handlePostDelete={handleDeletePost}
          />
        </Grid>
      ))}
    </Grid>
  );
}

const postsPropTypes = {
  posts: PropTypes.arrayOf(PropTypes.exact(postPropTypes)),
  type: PropTypes.string,
  thingId: PropTypes.string,
};

Posts.propTypes = postsPropTypes;

export default Posts;
