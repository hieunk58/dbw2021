import React, { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";

import DataService from "../../../services/data.service";

import { DialogActions, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const AddClassDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  const [className, setClassname] = useState("");

  const handleCreateClass = useCallback(() => {
    // setLoading(true);
    var data = {
      class_name: className
    }
    console.log("create new class: " + className);
    DataService.createClass(data)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          pushMessageToSnackbar({
            text: "New class was created successfully",
          });
          onSuccess();
          onClose();
          setClassname('');
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
        setClassname('');
        return;
      })
  }, [className, onSuccess, pushMessageToSnackbar, onClose]);

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
        handleCreateClass();
        // onSuccess();
      }}
      content={
        <Fragment>
            <TextField
                size="normal"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Class name"
                autoFocus
                value={className}
                onChange={event => {
                    setClassname(event.target.value);
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
            // onClick={handleCreateClass}
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

AddClassDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired

};

export default AddClassDialog;
