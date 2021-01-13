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
import IconButton from "@material-ui/core/IconButton";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import lottie from "lottie-web";

import Avatar from "../assets/images/avatar-0.png";
import CoverAnimation from "../assets/animations/laptop-working.json";

import { Redirect } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog, showSnackbar, fillForm } from "../state/actions";

const DELETE_GROUP = gql`
  mutation DelteGroup($group_id: ID!) {
    deleteGroup(groupId: $group_id)
  }
`;

const SEND_REQUEST = gql`
  mutation SendRequest($group_id: ID!) {
    sendRequest(groupId: $group_id) {
      id
    }
  }
`;

const CHANGE_COVER = gql`
  mutation ChangeCover($group_id: ID!, $image: String!) {
    changeGroupCover(groupId: $group_id, coverSrc: $image) {
      id
    }
  }
`;

const CHANGE_IMAGE = gql`
  mutation ChangeImage($group_id: ID!, $image: String!) {
    changeGroupProfile(groupId: $group_id, profileSrc: $image) {
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
}));

function GroupHeader(props) {
  const {
    user,
    setDialog,
    showSnackbar,
    fillForm,
    id,
    admin,
    title,
    coverUrl,
    profileUrl,
    members,
    requests,
    loading,
  } = props;

  const isAnAdmin = user && admin ? admin.id === user.id : false;
  const isMember =
    user && members ? members.some((el) => el.id === user.id) : false;
  const isRequestee =
    user && requests ? requests.some((el) => el.id === user.id) : false;

  const classes = useStyles();
  const theme = useTheme();
  const width = useWidth();
  const cardCover = useRef(null);
  const cardContent = useRef(null);
  const [cover, setCover] = useState(coverUrl);
  const [photo, setPhoto] = useState(profileUrl);
  const [isAMember, setIsAMember] = useState(isMember);
  const [isARequestee, setIsARequestee] = useState(isRequestee);
  const [cardContentHeight, setCardContentHeight] = useState(0);
  const [deleteGroup] = useMutation(DELETE_GROUP, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  });
  const [sendRequest] = useMutation(SEND_REQUEST, {
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

  let heightOffset = Math.round(0.3 * 480);
  if (width === "sm") heightOffset = Math.round(0.3 * 360);
  if (width === "xs") heightOffset = Math.round(0.3 * 240);

  useEffect(() => {
    setCover(coverUrl);
    setPhoto(profileUrl);
    setIsAMember(isMember);
    setIsARequestee(isRequestee);
  }, [coverUrl, profileUrl, isMember, isRequestee]);

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
            group_id: id,
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
            group_id: id,
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
    fillForm("post", { type: "group", id });
    setDialog("create-post");
  };

  const handleDelete = () => {
    deleteGroup({ variables: { group_id: id } });
    <Redirect to="/group/" />;
  };

  const handleJoinToggle = (event) => {
    const isJoin = event.target.checked;
    setIsARequestee(isJoin);
    setIsAMember(false);
    sendRequest({
      variables: {
        group_id: id,
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
        {isAnAdmin && (
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
                  title={title ? title : "Group"}
                />
              ) : (
                <Skeleton
                  animation="wave"
                  variant="circle"
                  width={theme.spacing(20)}
                  height={theme.spacing(20)}
                />
              )}
              {isAnAdmin && (
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
              <CardContent className={classes.content}>
                {!loading ? (
                  <Typography component="h1" variant="h5">
                    {title ? title : "Group"}
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
                  label="Group"
                  color="primary"
                />
              </CardContent>
              <div className={classes.controls}>
                <div>
                  {isAMember && (
                    <Button color="red" onClick={handlePost}>
                      Post Now
                    </Button>
                  )}
                  {isAnAdmin && (
                    <Button color="blue" onClick={handleDelete}>
                      Delete Group
                    </Button>
                  )}
                </div>
                {!isAMember && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAMember === true}
                        indeterminate={isARequestee === true}
                        onChange={handleJoinToggle}
                        name="isAMember"
                      />
                    }
                    label={isAMember ? "Joined" : "Join"}
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

GroupHeader.propTypes = {
  user: PropTypes.any,
  setDialog: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  fillForm: PropTypes.func.isRequired,
  id: PropTypes.any,
  admin: PropTypes.any,
  title: PropTypes.any,
  coverUrl: PropTypes.any,
  profileUrl: PropTypes.any,
  members: PropTypes.any,
  requests: PropTypes.anu,
  loading: PropTypes.any,
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupHeader);
