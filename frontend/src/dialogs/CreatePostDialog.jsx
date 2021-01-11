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

import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog, showSnackbar } from "../state/actions";

const ADD_POST = gql`
  mutation AddPost($text: String!) {
    createPost(body: $text) {
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
  const cardContent = useRef(null);
  const [media, setMedia] = React.useState(null);
  const [text, setText] = React.useState("");
  const [cardContentHeight, setCardContentHeight] = React.useState(0);

  // eslint-disable-next-line no-empty-pattern
  const { setDialog, showSnackbar } = props;
  const [addPost] = useMutation(ADD_POST, {
    onCompleted() {
      setDialog(null);
      showSnackbar("success", "Successfully posted");
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });

  const { label } = props;

  let heightOffset = Math.round(0.4 * 480);
  if (width === "sm") heightOffset = Math.round(0.4 * 360);
  if (width === "xs") heightOffset = Math.round(0.4 * 240);

  useEffect(() => {
    setCardContentHeight(cardContent.current.offsetHeight);
  }, [cardContent]);

  const handlePost = () => {
    addPost({
      variables: {
        text,
      },
    });
  };

  const handleMediaChange = (event) => {
    setMedia(event.target.files[0]);
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
            label={label ? label : "Profile"}
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
  label: PropTypes.string,
  setDialog: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    setDialog: (dialog) => dispatch(setDialog(dialog)),
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(null, mapDispatchToProps)(CreatePostDialog);
