import React, { useEffect, useRef, useState } from "react";
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

import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog, setUser, showSnackbar } from "../state/actions";

const FOLLOW_USER = gql`
  mutation FollowUser($user_id: ID!) {
    follow(id: $user_id) {
      id
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation UploadImage($url: String!) {
    uploadImage(url: $url)
  }
`;

const useStyles = makeStyles(({ spacing, breakpoints, shape }) => ({
  container:{
    marginBottom:"150px",
    position:"relative",
    top:"-90px",
    right:""
  },
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
    top: "83%",
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
    objectFit: "cover",
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
  const container = useRef(null);
  useEffect(()=>{
    lottie.loadAnimation({
      container:container.current,
      renderer:"svg",
      loop:true,
      autoplay:true,
      animationData:require("../laptop-working.json")
    })
  } , [])
  const {
    profile_user,
    loading,
    user,
    setDialog,
    setUser,
    showSnackbar,
    postsCount,
    followersCount,
    followingCount,
  } = props;

  const classes = useStyles();
  const theme = useTheme();
  const width = useWidth();
  const cardContent = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [cover, setCover] = React.useState(null);
  const [photo, setPhoto] = React.useState(null);
  const [isFollowing, setIsFollowing] = React.useState(
    user
      ? user.following.some((el) => el.username === profile_user.username)
      : null
  );
  const [tempURL, setTempURL] = useState("");
  const [cardContentHeight, setCardContentHeight] = React.useState(0);
  const [followUser] = useMutation(FOLLOW_USER, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [uploadImage] = useMutation(UPLOAD_IMAGE, {
    onCompleted({ uploadImage: url }) {
      setTempURL(url);
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });

  const isOwnProfile =
    profile_user && user ? user.id === profile_user.id : null;
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"), {
    defaultMatches: true,
  });

  let heightOffset = Math.round(0.3 * 480);
  if (width === "sm") heightOffset = Math.round(0.3 * 360);
  if (width === "xs") heightOffset = Math.round(0.3 * 240);

  useEffect(() => {
    setCardContentHeight(cardContent.current.offsetHeight);
  });

  useEffect(() => {
    return () => {
      if (profile_user && user) {
        if (isFollowing)
          setUser({ following: [profile_user, ...user.following], ...user });
        else
          setUser({
            following: user.following.filter((el) => el.id !== profile_user.id),
            ...user,
          });
      }
    };
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleCoverChange = (event) => {
    setCover(event.target.files[0]);
  };

  const handlePhotoChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setPhoto(files[0]);

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        uploadImage({
          variables: {
            url: reader.result,
          },
        });
      };
      reader.onerror = () => {
        showSnackbar("Something went wrong!");
      };
    }
  };

  const handleAction = () => {
    setDialog("create-post");
  };

  const handleActionToggle = (event) => {
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
          marginBottom: cardContentHeight - heightOffset + theme.spacing(2),
        }}
        className={classes.card}
      >
      
        <div className={classes.container} ref={container}></div>



        <CardContent ref={cardContent} className={classes.cardContent}>
          <Card className={classes.innerCard} elevation={0}>
            <div className={classes.relative}>
              {!loading ? (
                <CardMedia
                  component="img"
                  className={classes.photo}
                  image={photo ? URL.createObjectURL(photo) : Avatar}
                  loading="auto"
                  title={profile_user.fullname}
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
                        {profile_user.fullname}
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
                  <Button color="red" onClick={handleAction}>
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
      <p>{tempURL}</p>
    </form>
  );
}

ProfileHeader.propTypes = {
  profile_user: PropTypes.string,
  loading: PropTypes.bool,
  user: PropTypes.any,
  setDialog: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  postsCount: PropTypes.number,
  followersCount: PropTypes.number,
  followingCount: PropTypes.number,
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

function mapDispatchToProps(dispatch) {
  return {
    setUser: (user) => dispatch(setUser(user)),
    setDialog: (dialog) => dispatch(setDialog(dialog)),
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader);
