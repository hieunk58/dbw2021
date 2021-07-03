import React, { useCallback, useState, Fragment } from "react";
import PropTypes from "prop-types";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import DataService from "../../../services/data.service";

const AddUserDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [surname, setSurname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateUser = useCallback(() => {
    // setLoading(true);
    var data = {
      family_name: surname,
      first_name: firstname,
      username: username,
      password: password,
      role: role
    }
    console.log("create new user: " + data);
    DataService.createUser(data)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          onClose();
          pushMessageToSnackbar({
            text: "New user was created successfully",
          });
          onSuccess();
          setFirstname('');
          setSurname('');
          setUsername('');
          setPassword('');
          setRole('');
        }, 1000);
      })
      .catch(error => {
        // console.log(error.message);
        // console.log(error.response.data.message);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        setLoading(false);
        pushMessageToSnackbar({
          text: error.response.data.message,
        });
        onClose();
        return;
      })
  }, [surname, firstname, username, password, role, onSuccess, pushMessageToSnackbar, onClose]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Add New User"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        handleCreateUser();
      }}
      content={
        <Fragment>
            <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                    labelId="role-label"
                    id="demo-simple-select-required"
                    value={role}
                    onChange={event => {
                        setRole(event.target.value);
                    }}
                >
                    <MenuItem value={"admin"}>Admin</MenuItem>
                    <MenuItem value={"teacher"}>Teacher</MenuItem>
                    <MenuItem value={"student"}>Student</MenuItem>
                </Select>
            </FormControl>

            <TextField
                size="small"
                margin="normal"
                required
                fullWidth
                label="Firstname"
                variant="outlined"
                value={firstname}
                onChange={event => {
                    setFirstname(event.target.value);
                }}
            />
            <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Surname"
                value={surname}
                onChange={event => {
                    setSurname(event.target.value);
                }}
            />

            <TextField
                size="small"
                margin="normal"
                required
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={event => {
                    setUsername(event.target.value);
                }}
            />
            <TextField
                size="small"
                margin="normal"
                required
                fullWidth
                label="Password"
                variant="outlined"
                value={password}
                onChange={event => {
                    setPassword(event.target.value);
                }}
            />
          </Fragment>
      }
      actions={
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          color="secondary"
          // onClick={onSuccess}
          type="submit"
          variant="contained"
          disabled={loading}
        >
          Create {loading && <ButtonCircularProgress />}
        </Button>
        </DialogActions>
      }
    />
  );
});

AddUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired
};

export default AddUserDialog;
