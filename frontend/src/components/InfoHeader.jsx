import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useWidth from "../utils/useWidth";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "./Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import EditIcon from "@material-ui/icons/Edit";
import FaceIcon from "@material-ui/icons/Face";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import Avatar from "../assets/images/avatar-0.png";

import { useStateValue } from "../state/store";
import { setDialog, setUser } from "../state/actions";

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
    width: "100%",
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
  },
  photoEditIcon: {
    background: "GhostWhite",
    margin: spacing(1),
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: spacing(1),
    paddingBottom: spacing(1),
  },
  input: {
    display: "none",
  },
}));

function InfoHeader(props) {
  const [{ user }, dispatch] = useStateValue();

  const { title, label, profile_user, action, checked } = props;

  const classes = useStyles();
  const theme = useTheme();
  const width = useWidth();
  const cardContent = useRef(null);
  const [cover, setCover] = React.useState(null);
  const [photo, setPhoto] = React.useState(null);
  const [isFollowing, setIsFollowing] = React.useState(checked);
  const [cardContentHeight, setCardContentHeight] = React.useState(0);

  let heightOffset = Math.round(0.3 * 480);
  if (width === "sm") heightOffset = Math.round(0.3 * 360);
  if (width === "xs") heightOffset = Math.round(0.3 * 240);

  useEffect(() => {
    setCardContentHeight(cardContent.current.offsetHeight);
  }, [cardContent]);

  const handleCoverChange = (event) => {
    setCover(event.target.files[0]);
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleAction = () => {
    dispatch(setDialog("create-post"));
  };

  const handleActionToggle = (event) => {
    setIsFollowing(event.target.checked);
    action({
      variables: {
        id: profile_user.id,
      },
    });
    if (event.target.checked)
      dispatch(
        setUser({ following: [profile_user, ...user.following], ...user })
      );
    else
      dispatch(
        setUser({
          following: user.following.filter(
            (item) => item.id !== profile_user.id
          ),
          ...user,
        })
      );
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
          id="cover-edit-button"
          type="file"
          onChange={handleCoverChange}
        />
        <label className={classes.mediaEditLabel} htmlFor="cover-edit-button">
          <IconButton aria-label="edit-cover" component="span">
            <EditIcon className={classes.mediaEditIcon} />
          </IconButton>
        </label>
        <CardMedia
          component="img"
          className={classes.cardCover}
          onError={() => {
            if (cover) setCover(null);
          }}
          src={
            cover
              ? URL.createObjectURL(cover)
              : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1404&q=80"
          }
          alt={cover ? cover.name : "Post Photo"}
        />
        <CardContent ref={cardContent} className={classes.cardContent}>
          <Card className={classes.innerCard} elevation={0}>
            <div className={classes.relative}>
              <CardMedia
                component="img"
                className={classes.photo}
                image={photo ? URL.createObjectURL(photo) : Avatar}
                loading="auto"
                title={title}
              />
              <input
                accept="image/*"
                className={classes.input}
                id="photo-edit-button"
                type="file"
                onChange={handlePhotoChange}
              />
              <label className={classes.photoEdit} htmlFor="photo-edit-button">
                <IconButton
                  className={classes.photoEditIcon}
                  aria-label="edit-photo"
                  component="span"
                >
                  <EditIcon />
                </IconButton>
              </label>
            </div>
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
                <Button color="red" onClick={handleAction}>
                  Post Now
                </Button>
                {isFollowing != null && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isFollowing}
                        onChange={handleActionToggle}
                        name="isFollowing"
                      />
                    }
                    label={isFollowing ? "Following" : "Follow"}
                  />
                )}
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
  profile_user: PropTypes.string,
  action: PropTypes.func,
  checked: PropTypes.bool,
};

export default InfoHeader;
