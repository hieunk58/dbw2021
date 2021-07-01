import React, { useCallback, useState, Fragment, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

import {  DialogActions, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import DataService from "../../../services/data.service";

const EditUserDialog = withTheme(forwardRef(function (props, ref) {
  const { open, onClose, onSuccess, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [surname, setSurname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");

  useImperativeHandle(ref, () => ({
      mapEditData(editData) {
          setUserId(editData._id);
          setRole(editData.role._id);
          setSurname(editData.family_name);
          setFirstname(editData.first_name);
          setUsername(editData.username);
        //   setPassword(editData.password);
      }
    }));

  const handleEditUser = useCallback(() => {
    // setLoading(true);
    var data = {
      family_name: surname,
      first_name: firstname,
      username: username,
      password: password,
      role: role
    }
    console.log("update user: ", JSON.stringify(data));
    DataService.updateUser(userId, data)
      .then(() => {
        setTimeout(() => {
            setLoading(false);
            onClose();
            pushMessageToSnackbar({
              text: "Update user successfully",
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
        setLoading(false);
        pushMessageToSnackbar({
          text: error.response.data.message,
        });
        onClose();
        return;
      })
  }, [surname, firstname, username, password, role, userId, pushMessageToSnackbar, onClose, onSuccess]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Edit User"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        handleEditUser();
      }}
      content={
        <Fragment>
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
                label="Firstname"
                variant="outlined"
                value={firstname}
                onChange={event => {
                    setFirstname(event.target.value);
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
          Save {loading && <ButtonCircularProgress />}
        </Button>
        </DialogActions>
      }
    />
  );
}));

EditUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired
};

export default EditUserDialog;
