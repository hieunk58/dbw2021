import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";

import { InputLabel, MenuItem, 
    DialogActions, Select, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const AddClassDialog = withTheme(function (props) {
  const { open, onClose, onSuccess } = props;
  const [loading, setLoading] = useState(false);
  const [className, setClassname] = useState("");

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Add New Class"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        onSuccess();
      }}
      content={
        // <Fragment>
            <TextField
                size="normal"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Class name"
                value={className}
                onChange={event => {
                    setClassname(event.target.value);
                }}
            />           
          // </Fragment>
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

AddClassDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default AddClassDialog;
