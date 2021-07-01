// import React from 'react';
import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import AuthService from "../../services/auth.service";

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://tu-chemnitz.de">
//         TU Chemnitz
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignInSide(props) {
  const classes = useStyles();
  const {
    setStatus,
    history,
    status,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  // const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginUsername = useRef();
  const loginPassword = useRef();

  const login = useCallback(() => {
    console.log("call login");
    // setIsLoading(true);
    // setStatus(null);
    // if (loginUsername.current.value !== "admin@tu-chemnitz.com") {
    //   setTimeout(() => {
    //     setStatus("invalidUsername");
    //     setIsLoading(false);
    //   }, 1500);
    // } else if (loginPassword.current.value !== "Test@123456") {
    //   setTimeout(() => {
    //     setStatus("invalidPassword");
    //     setIsLoading(false);
    //   }, 1500);
    // } else {
    //   setTimeout(() => {
    //     history.push("/c/dashboard");
    //   }, 150);
    // }
    setIsLoading(true);
      setStatus(null);

      AuthService.login(loginUsername.current.value, loginPassword.current.value)
      .then((res) => {
        console.log("login user: ", res);
        console.log("login user role: ", res.role);
        if(res.role === 'admin') {
          console.log('user is admin');
          history.push("/c/users");
        } else if(res.role === 'teacher') {
          history.push("/c/teacher");
        } else {
          history.push("/c/student");
        }
      })
      setIsLoading(false);
  }, [setIsLoading, loginUsername, loginPassword, history, setStatus]);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              error={status === "invalidUsername"}
              required
              fullWidth
              label="Username"
              inputRef={loginUsername}
              autoFocus
              autoComplete="off"
              type="username"
              onChange={() => {
                if (status === "invalidUsername") {
                  setStatus(null);
                }
              }}
              helperText={
                status === "invalidUsername" &&
                "This username isn't associated with an account."
              }
              FormHelperTextProps={{ error: true }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth        
              error={status === "invalidPassword"}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              utoComplete="off"
              onChange={() => {
                if (status === "invalidPassword") {
                  setStatus(null);
                }
              }}
              helperText={
                status === "invalidPassword" ? (
                  <span>
                    Incorrect password. Try again
                  </span>
                ) : (
                  ""
                )
              }
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isLoading}
              className={classes.submit}
              // onClick = { () => login }
            >
              Sign In
              {isLoading}
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
            {/* <Box mt={5}>
              <Copyright />
            </Box> */}
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

SignInSide.propTypes = {
  classes: PropTypes.object.isRequired,
  setStatus: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.string,
};

export default withRouter(SignInSide);
