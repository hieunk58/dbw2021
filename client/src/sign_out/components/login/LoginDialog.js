  import React, { useState, useCallback, useRef, Fragment } from "react";
  import PropTypes from "prop-types";
  import { withRouter } from "react-router-dom";
  import {
    TextField,
    Button,
    withStyles,
  } from "@material-ui/core";
  import FormDialog from "../../../shared/components/FormDialog";
  import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
  import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";

  import AuthService from "../../../services/auth.service";

  const styles = (theme) => ({
    // forgotPassword: {
    //   marginTop: theme.spacing(2),
    //   color: theme.palette.primary.main,
    //   cursor: "pointer",
    //   "&:enabled:hover": {
    //     color: theme.palette.primary.dark,
    //   },
    //   "&:enabled:focus": {
    //     color: theme.palette.primary.dark,
    //   },
    // },
    disabledText: {
      cursor: "auto",
      color: theme.palette.text.disabled,
    },
    formControlLabel: {
      marginRight: 0,
    },
  });

  function LoginDialog(props) {
    const {
      setStatus,
      history,
      onClose,
      status,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const loginUsername = useRef();
    const loginPassword = useRef();

    const login = useCallback(() => {
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
      .catch((err) => {
        if(err.response.status === 404) {
          // invalid username
          setStatus("invalidUsername");
        } else if(err.response.status === 401) {
          // wrong password
          setStatus("invalidPassword");
        }
        else {

        }
        
      })
      setIsLoading(false);

      // .catch(error => {
        // history.push("/c/student");
        // console.log(error.response.data.message);
        // console.log("err", error);
        // const resMessage =
        //     (error.response &&
        //       error.response.data &&
        //       error.response.data.message) ||
        //     error.message ||
        //     error.toString();
        // const resMsg = error.response.data.message;
        // console.log("login error: ", resMsg);
        // if (resMsg === "invalidUsername") {
        //   setTimeout(() => {
        //         setStatus("invalidUsername");
        //         setIsLoading(false);
        //       }, 1500);
        // } else if(resMsg === "invalidPassword") {
        //   setTimeout(() => {
        //         setStatus("invalidPassword");
        //         setIsLoading(false);
        //     }, 1500);
        // } else {
        // }
      // if (loginUsername.current.value !== "test@web.com") {
      //   setTimeout(() => {
      //     setStatus("invalidUsername");
      //     setIsLoading(false);
      //   }, 1500);
      // } else if (loginPassword.current.value !== "HaRzwc") {
      //   setTimeout(() => {
      //     setStatus("invalidPassword");
      //     setIsLoading(false);
      //   }, 1500);
      // } else {
      //   setTimeout(() => {
      //     history.push("/c/users");
      //     // check user role to open corresponding view
      //     // admin view starts with managing users
      //     // history.push("/c/subjects");
      //     // TODO teacher view
      //     //history.push("/profile/teacher");
      //     // TODO student view
      //     // history.push("/profile/student");
      //   }, 150);
      // }

    }, [setIsLoading, loginUsername, loginPassword, history, setStatus]);

    return (
      <Fragment>
        <FormDialog
          open
          onClose={onClose}
          loading={isLoading}
          onFormSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          hideBackdrop
          headline="Login"
          content={
            <Fragment>
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
              <VisibilityPasswordTextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                error={status === "invalidPassword"}
                label="Password"
                inputRef={loginPassword}
                autoComplete="off"
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
                FormHelperTextProps={{ error: true }}
                onVisibilityChange={setIsPasswordVisible}
                isVisible={isPasswordVisible}
              />
            </Fragment>
          }
          actions={
            <Fragment>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                size="large"
              >
                Login
                {isLoading && <ButtonCircularProgress />}
              </Button>
            </Fragment>
          }
        />
      </Fragment>
    );
  }

  LoginDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    status: PropTypes.string,
  };

  export default withRouter(withStyles(styles)(LoginDialog));
