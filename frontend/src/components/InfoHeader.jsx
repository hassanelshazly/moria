import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useWidth from "../utils/useWidth";
import { makeStyles } from "@material-ui/core/styles";
import Button from "./Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import EditIcon from "@material-ui/icons/Edit";
import FaceIcon from "@material-ui/icons/Face";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import Avatar from "../assets/images/avatar-0.png";

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
  cardCover: {
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
    top: "70%",
    left: "2%",
    width: "96%",
    padding: spacing(3),
    textAlign: "left",
  },
  innerCard: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  photo: {
    width: spacing(20),
    objectFit: "scale-down",
  },
  photoEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: "GhostWhite",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: spacing(1),
    paddingBottom: spacing(1),
  },
  input: {
    display: "none",
  },
}));

function InfoHeader(props) {
  const classes = useStyles();
  const width = useWidth();
  const cardContent = useRef(null);
  const [media, setMedia] = React.useState(null);
  const [cardContentHeight, setCardContentHeight] = React.useState(0);

  const { title, label, hasImage } = props;

  let heightOffset = Math.round(0.3 * 480);
  if (width === "sm") heightOffset = Math.round(0.3 * 360);
  if (width === "xs") heightOffset = Math.round(0.3 * 240);

  useEffect(() => {
    console.log(cardContent.current.offsetHeight);
    setCardContentHeight(cardContent.current.offsetHeight);
  }, [cardContent]);

  const handleMediaChange = (event) => {
    setMedia(event.target.files[0]);
  };

  return (
    <form className={classes.relative} noValidate autoComplete="off">
      <Card
        style={{ marginBottom: cardContentHeight - heightOffset }}
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
          className={classes.cardCover}
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
          <Card className={classes.innerCard} elevation={0}>
            {hasImage && (
              <div className={classes.relative}>
                <CardMedia
                  component="img"
                  className={classes.photo}
                  image={Avatar}
                  loading="auto"
                  title={title}
                />
                <IconButton
                  className={classes.photoEdit}
                  aria-label="edit-media"
                  component="span"
                >
                  <EditIcon />
                </IconButton>
              </div>
            )}
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h1" variant="h5">
                  {title}
                </Typography>
                <Chip
                  variant="outlined"
                  size="small"
                  icon={<FaceIcon />}
                  label={label ? label : "Profile"}
                  color="primary"
                />
              </CardContent>
              <div className={classes.controls}>
                <Button color="red">Post Now</Button>
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>
    </form>
  );
}

InfoHeader.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  hasImage: PropTypes.bool,
};

export default InfoHeader;
