import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import { setDialog, setUser, showSnackbar } from "../state/actions";

const SIGN_UP = gql`
  mutation SignUp(
    $fullName: String!
    $userName: String!
    $email: String!
    $password: String!
  ) {
    register(
      fullname: $fullName
      username: $userName
      email: $email
      password: $password
    ) {
      id
      username
      email
      fullname
      profileUrl
      createdAt
      token
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2, 0, 2, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(2, 0),
  },
}));

function SignUpDialog(props) {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // eslint-disable-next-line no-empty-pattern
  const { setUser, setDialog, showSnackbar } = props;
  const [signUp] = useMutation(SIGN_UP, {
    onCompleted({ register: user }) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setDialog(null);
      showSnackbar("success", "Successfully signed up");
    },
    onError(error) {
      showSnackbar("error", error.message);
    },
  });

  function handleEmailSignUp() {
    signUp({
      variables: {
        fullName: `${firstName} ${lastName}`,
        userName,
        email,
        password,
      },
    });
  }

  return (
    <Container maxWidth="xs">
      <form className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign-Up
        </Typography>
        <Grid className={classes.form} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="user-name"
              label="User Name"
              name="userName"
              autoComplete="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
          onClick={handleEmailSignUp}
        >
          Sign Up
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                setDialog("sign-in");
              }}
            >
              Already have an account? Sign In
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

SignUpDialog.propTypes = {
  setUser: PropTypes.func.isRequired,
  setDialog: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    setUser: (user) => dispatch(setUser(user)),
    setDialog: (dialog) => dispatch(setDialog(dialog)),
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

export default connect(null, mapDispatchToProps)(SignUpDialog);
