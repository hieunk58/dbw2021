import React, { Fragment, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

import DataService from "../../../services/data.service";

import { DialogActions, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const EditClassDialog = withTheme(forwardRef(function (props, ref) {
  const { open, onClose, onSuccess, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  const [className, setClassname] = useState("");
  const [classId, setClassId] = useState("");

  useImperativeHandle(ref, () => ({
    mapEditData(editData) {
        setClassId(editData._id);
        setClassname(editData.class_name);
    }
  }));

  const handleEditClass = useCallback(() => {
    var data = {
      class_name: className
    }
    console.log("new class name: " + className);
    DataService.updateClass(classId, data)
      .then(() => {
        setTimeout(() => {
            setLoading(false);
            pushMessageToSnackbar({
                text: "Update class successfully",
            });
            onSuccess();
            onClose();
            setClassname('');
          }, 1000);
      })
      .catch(error => {
        setLoading(false);
        pushMessageToSnackbar({
          text: "Update class failed",
        });
        onClose();
        setClassname('');
        return;
      })
  }, [className, classId, onSuccess, pushMessageToSnackbar, onClose]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Edit Class"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        handleEditClass();
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
                autoFocus
                label="Class name"
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

EditClassDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired

};

export default EditClassDialog;
