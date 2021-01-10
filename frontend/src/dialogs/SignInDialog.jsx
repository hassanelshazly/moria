import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MuiLink from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { gql, useMutation } from "@apollo/client";
import { useStateValue } from "../state/store";
import { setDialog, setUser, showSnackbar } from "../state/actions";

const SIGN_IN = gql`
  mutation SignIn($userName: String!, $password: String!) {
    login(username: $userName, password: $password) {
      id
      username
      email
      fullname
      createdAt
      token
      following {
        id
        username
      }
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

export default function SignInDialog() {
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // eslint-disable-next-line no-empty-pattern
  const [{}, dispatch] = useStateValue();
  const [signIn] = useMutation(SIGN_IN, {
    onCompleted({ login: user }) {
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setDialog(null));
      dispatch(showSnackbar("success", "Successfully signed in"));
    },
    onError(error) {
      dispatch(showSnackbar("error", error.message));
    },
  });

  function handleEmailSignIn() {
    signIn({
      variables: {
        userName,
        password,
      },
    });
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign-In
        </Typography>
        <Grid className={classes.form} container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="user-name"
              label="User Name"
              name="username"
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
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
          onClick={handleEmailSignIn}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <MuiLink component="button" variant="body2">
              Forgot Password?
            </MuiLink>
          </Grid>
          <Grid item>
            <MuiLink
              component="button"
              variant="body2"
              onClick={() => {
                dispatch(setDialog("sign-up"));
              }}
            >
              {"Don't have an account? Sign up"}
            </MuiLink>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
