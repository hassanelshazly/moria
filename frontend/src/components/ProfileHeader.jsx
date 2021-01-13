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
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import lottie from "lottie-web";

import Avatar from "../assets/images/avatar-0.png";
import CoverAnimation from "../assets/animations/laptop-working.json";

import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog, showSnackbar, fillForm } from "../state/actions";

const FOLLOW_USER = gql`
  mutation FollowUser($user_id: ID!) {
    follow(id: $user_id) {
      id
    }
  }
`;

const CHANGE_COVER = gql`
  mutation ChangeCover($image: String!) {
    changeCover(coverSrc: $image) {
      id
    }
  }
`;

const CHANGE_IMAGE = gql`
  mutation ChangeImage($image: String!) {
    changeProfile(profileSrc: $image) {
      id
    }
  }
`;

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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
    objectFit: "cover",
  },
  coverAnimation: {
    position: "relative",
    top: "-90px",
  },
  mediaEditLabel: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  mediaEditIcon: {
    background: "GhostWhite",
    margin: spacing(1),
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
    height: spacing(20),
    objectFit: "cover",
    borderRadius: "50%",
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
  userDetailsStyling: {
    marginTop: "24px",
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginRight: "10px",
    [breakpoints.up("md")]: { fontSize: "14px" },
    [breakpoints.down("md")]: { fontSize: "12px" },
    [breakpoints.down("sm")]: { fontSize: "10px" },
    [breakpoints.down("xs")]: { display: "none" },
  },
  userCountDetailsStyling: {
    marginTop: "10px",
  },
}));

function ProfileHeader(props) {
  const {
    user,
    setDialog,
    showSnackbar,
    fillForm,
    profile_user,
    loading,
    postsCount,
    followersCount,
    followingCount,
  } = props;

  const isOwnProfile =
    user && profile_user ? user.id === profile_user.id : false;
  const isFollowingProfile =
    user && profile_user && profile_user.followers
      ? profile_user.followers.some((el) => el.id === user.id)
      : false;

  const classes = useStyles();
  const theme = useTheme();
  const width = useWidth();
  const cardCover = useRef(null);
  const cardContent = useRef(null);
  const [cover, setCover] = React.useState(profile_user.coverUrl);
  const [photo, setPhoto] = React.useState(profile_user.profileUrl);
  const [isFollowing, setIsFollowing] = React.useState(isFollowingProfile);
  const [cardContentHeight, setCardContentHeight] = React.useState(0);
  const [followUser] = useMutation(FOLLOW_USER, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [changeCover] = useMutation(CHANGE_COVER, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [changeImage] = useMutation(CHANGE_IMAGE, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.only("xs"), {
    defaultMatches: true,
  });

  let heightOffset = Math.round(0.3 * 480);
  if (width === "sm") heightOffset = Math.round(0.3 * 360);
  if (width === "xs") heightOffset = Math.round(0.3 * 240);

  useEffect(() => {
    setCover(profile_user.coverUrl);
    setPhoto(profile_user.profileUrl);
    setIsFollowing(isFollowingProfile);
  }, [profile_user.coverUrl, profile_user.profileUrl, isFollowingProfile]);

  useEffect(() => {
    setCardContentHeight(cardContent.current.offsetHeight);
  });

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: cardCover.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: CoverAnimation,
    });

    return () => {
      anim.destroy();
    };
  }, []);

  const handleCoverChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setCover(URL.createObjectURL(files[0]));

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        changeCover({
          variables: {
            image: reader.result,
          },
        });
      };
      reader.onerror = () => {
        showSnackbar("Something went wrong!");
      };
    }
  };

  const handlePhotoChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setPhoto(URL.createObjectURL(files[0]));

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        changeImage({
          variables: {
            image: reader.result,
          },
        });
      };
      reader.onerror = () => {
        showSnackbar("Something went wrong!");
      };
    }
  };

  const handlePost = () => {
    fillForm("post", { type: "profile", id: user.username });
    setDialog("create-post");
  };

  const handleFollowToggle = (event) => {
    setIsFollowing(event.target.checked);
    followUser({
      variables: {
        user_id: profile_user.id,
      },
    });
  };

  return (
    <form className={classes.relative} noValidate autoComplete="off">
      <Card
        style={{
          marginBottom: cardContentHeight - heightOffset + theme.spacing(2.5),
        }}
        className={classes.card}
      >
        {cover ? (
          <CardMedia
            component="img"
            className={classes.cardCover}
            onError={() => {
              if (cover) setCover(null);
            }}
            src={cover}
            alt={cover.name}
          />
        ) : (
          <div
            className={`.MuiCardMedia-root .MuiCardMedia-media .MuiCardMedia-img ${classes.cardCover} ${classes.coverAnimation}`}
            ref={cardCover}
          />
        )}
        {isOwnProfile && (
          <React.Fragment>
            <input
              accept="image/*"
              className={classes.input}
              id="cover-edit-button"
              type="file"
              onChange={handleCoverChange}
            />
            <label
              className={classes.mediaEditLabel}
              htmlFor="cover-edit-button"
            >
              <IconButton
                className={classes.mediaEditIcon}
                aria-label="edit-cover"
                component="span"
              >
                <EditIcon />
              </IconButton>
            </label>
          </React.Fragment>
        )}
        <CardContent ref={cardContent} className={classes.cardContent}>
          <Card className={classes.innerCard} elevation={0}>
            <div className={classes.relative}>
              {!loading ? (
                <CardMedia
                  component="img"
                  className={classes.photo}
                  image={photo ? photo : Avatar}
                  loading="auto"
                  title={profile_user ? profile_user.fullname : "Profile"}
                />
              ) : (
                <Skeleton
                  animation="wave"
                  variant="circle"
                  width={theme.spacing(20)}
                  height={theme.spacing(20)}
                />
              )}
              {isOwnProfile && (
                <React.Fragment>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="photo-edit-button"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                  <label
                    className={classes.photoEdit}
                    htmlFor="photo-edit-button"
                  >
                    <IconButton
                      className={classes.photoEditIcon}
                      aria-label="edit-photo"
                      component="span"
                    >
                      <EditIcon />
                    </IconButton>
                  </label>
                </React.Fragment>
              )}
            </div>
            <div className={classes.details}>
              <Grid container>
                <Grid item xs={isMobile ? 12 : 4}>
                  <CardContent className={classes.content}>
                    {!loading ? (
                      <Typography component="h1" variant="h5">
                        {profile_user ? profile_user.fullname : "Profile"}
                      </Typography>
                    ) : (
                      <Skeleton
                        animation="wave"
                        width="30%"
                        height={20}
                        variant="rect"
                        style={{ marginBottom: theme.spacing(1) }}
                      />
                    )}
                    <Chip
                      variant="outlined"
                      size="small"
                      icon={<FaceIcon />}
                      label="Profile"
                      color="primary"
                    />
                  </CardContent>
                </Grid>
                <Grid item xs={isMobile ? 0 : 8}>
                  <div className={classes.userDetailsStyling}>
                    <Grid container spacing={2}>
                      <Grid xs={4} item>
                        posts
                        <br />
                        <p className={classes.userCountDetailsStyling}>
                          {postsCount}
                        </p>
                      </Grid>
                      <Grid xs={4} item>
                        followers
                        <br />
                        <p className={classes.userCountDetailsStyling}>
                          {followersCount}
                        </p>
                      </Grid>
                      <Grid xs={4} item>
                        following <br />
                        <p className={classes.userCountDetailsStyling}>
                          {followingCount}
                        </p>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
              <div className={classes.controls}>
                {isOwnProfile ? (
                  <Button color="red" onClick={handlePost}>
                    Post Now
                  </Button>
                ) : (
                  <span />
                )}
                {!isOwnProfile && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isFollowing}
                        onChange={handleFollowToggle}
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

ProfileHeader.propTypes = {
  profile_user: PropTypes.string,
  loading: PropTypes.bool,
  user: PropTypes.any,
  setDialog: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  fillForm: PropTypes.func.isRequired,
  postsCount: PropTypes.number,
  followersCount: PropTypes.number,
  followingCount: PropTypes.number,
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

function mapDispatchToProps(dispatch) {
  return {
    setDialog: (dialog) => dispatch(setDialog(dialog)),
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
    fillForm: (form, fields) => dispatch(fillForm(form, fields)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader);
