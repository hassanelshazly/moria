import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useWidth from "../utils/useWidth";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Chip from "@material-ui/core/Chip";
import EditIcon from "@material-ui/icons/Edit";
import FaceIcon from "@material-ui/icons/Face";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog, showSnackbar } from "../state/actions";

import optimizeImage from "../utils/image";

const ADD_PROFILE_POST = gql`
  mutation AddProfilePost($text: String!, $image: String) {
    createPost(body: $text, imageSrc: $image) {
      id
    }
  }
`;

const ADD_GROUP_POST = gql`
  mutation AddGroupPost($group_id: ID!, $text: String!, $image: String) {
    createGroupPost(groupId: $group_id, body: $text, imageSrc: $image) {
      id
    }
  }
`;

const ADD_PAGE_POST = gql`
  mutation AddPagePost($page_id: ID!, $text: String!, $image: String) {
    createPagePost(pageId: $page_id, body: $text, imageSrc: $image) {
      id
    }
  }
`;

const useStyles = makeStyles(({ spacing, breakpoints, shape }) => ({
  relative: { position: "relative" },
  card: {
    margin: "auto",
    overflow: "initial",
    position: "relative",
    boxShadow: "none",
    borderRadius: 0,
    "&:hover": {
      "& .MuiTypography--explore": {
        transform: "scale(1.2)",
      },
    },
  },
  cardMedia: {
    [breakpoints.only("xs")]: { height: 240 },
    [breakpoints.only("sm")]: { height: 360 },
    [breakpoints.up("md")]: { height: 480 },
    borderRadius: shape.borderRadius,
  },
  mediaEditLabel: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  mediaEditIcon: {
    color: "white",
  },
  cardContent: {
    boxShadow: "0 16px 40px -12.125px rgba(0,0,0,0.3)",
    borderRadius: spacing(0.5),
    backgroundColor: "#ffffff",
    position: "absolute",
    top: "60%",
    left: "2%",
    width: "96%",
    padding: spacing(3),
    textAlign: "left",
  },
  input: {
    display: "none",
  },
}));

function CreatePostDialog(props) {
  const classes = useStyles();
  const theme = useTheme();
  const width = useWidth();
  const history = useHistory();
  const cardContent = useRef(null);
  const [text, setText] = React.useState("");
  const [media, setMedia] = React.useState(null);
  const [cardContentHeight, setCardContentHeight] = React.useState(0);

  // eslint-disable-next-line no-empty-pattern
  const { postForm, setDialog, showSnackbar } = props;
  const [addProfilePost] = useMutation(ADD_PROFILE_POST, {
    onCompleted() {
      setDialog(null);
      history.push(`/profile/${encodeURIComponent(postForm.id)}/`);
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [addGroupPost] = useMutation(ADD_GROUP_POST, {
    onCompleted() {
      setDialog(null);
      history.push(`/group/${encodeURIComponent(postForm.id)}/`);
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [addPagePost] = useMutation(ADD_PAGE_POST, {
    onCompleted() {
      setDialog(null);
      history.push(`/page/${encodeURIComponent(postForm.id)}/`);
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });

  let heightOffset = Math.round(0.4 * 480);
  if (width === "sm") heightOffset = Math.round(0.4 * 360);
  if (width === "xs") heightOffset = Math.round(0.4 * 240);

  useEffect(() => {
    setCardContentHeight(cardContent.current.offsetHeight);
  });

  const handlePost = async () => {
    if (media) {
      const optimizedImage = await optimizeImage(media);
      switch (postForm.type) {
        case "profile":
          addProfilePost({ variables: { text, image: optimizedImage } });
          break;
        case "group":
          addGroupPost({
            variables: { group_id: postForm.id, text, image: optimizedImage },
          });
          break;
        case "page":
          addPagePost({
            variables: { page_id: postForm.id, text, image: optimizedImage },
          });
          break;
      }
    } else {
      switch (postForm.type) {
        case "profile":
          addProfilePost({ variables: { text } });
          break;
        case "group":
          addGroupPost({
            variables: { group_id: postForm.id, text },
          });
          break;
        case "page":
          addPagePost({
            variables: { page_id: postForm.id, text },
          });
          break;
      }
    }
  };

  const handleMediaChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) setMedia(files[0]);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <form className={classes.relative} noValidate autoComplete="off">
      <Card
        style={{
          marginBottom: cardContentHeight - heightOffset + theme.spacing(2),
        }}
        className={classes.card}
      >
        <input
          accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={handleMediaChange}
        />
        <label className={classes.mediaEditLabel} htmlFor="icon-button-file">
          <IconButton aria-label="edit-media" component="span">
            <EditIcon className={classes.mediaEditIcon} />
          </IconButton>
        </label>
        <CardMedia
          component="img"
          className={classes.cardMedia}
          onError={() => {
            if (media) setMedia(null);
          }}
          src={
            media
              ? URL.createObjectURL(media)
              : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1404&q=80"
          }
          alt={media ? media.name : "Post Photo"}
        />
        <CardContent ref={cardContent} className={classes.cardContent}>
          <Chip
            variant="outlined"
            size="small"
            icon={<FaceIcon />}
            label={
              postForm.type.charAt(0).toUpperCase() + postForm.type.slice(1)
            }
            color="primary"
          />
          <br />
          <br />
          <TextField
            id="post-text"
            label="Post Body"
            multiline
            fullWidth
            autoFocus
            rows={6}
            placeholder="Write your post here..."
            value={text}
            onChange={handleTextChange}
            variant="filled"
          />
          <br />
          <br />
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handlePost}
          >
            Post Now
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

CreatePostDialog.propTypes = {
  postForm: PropTypes.any,
  setDialog: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { postForm: state.forms.post };
};

function mapDispatchToProps(dispatch) {
  return {
    setDialog: (dialog) => dispatch(setDialog(dialog)),
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostDialog);
