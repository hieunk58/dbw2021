import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const AddUserDialog = withTheme(function (props) {
  const { open, editMode, onClose, onSuccess } = props;
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [surname, setSurname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        onSuccess();
      }}
      content={
        <Fragment>
            <FormControl disabled={editMode} fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                    labelId="role-label"
                    id="demo-simple-select-required"
                    value={role}
                    onChange={event => {
                        setRole(event.target.value);
                    }}
                >
                    <MenuItem value={0}>Admin</MenuItem>
                    <MenuItem value={1}>Teacher</MenuItem>
                    <MenuItem value={2}>Student</MenuItem>
                </Select>
            </FormControl>

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
          onClick={onSuccess}
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
  onSuccess: PropTypes.func.isRequired
};

// function Wrapper(props) {
//   const { open, onClose, onSuccess } = props;
//   return (
//     <Elements>
//       {open && (
//         <AddUserDialog open={open} onClose={onClose} onSuccess={onSuccess} />
//       )}
//     </Elements>
//   );
// }


AddUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default AddUserDialog;
