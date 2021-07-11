import React, { Fragment, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

import DataService from "../../../services/data.service";

import { DialogActions, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const EditTestResultDialog = withTheme(forwardRef(function (props, ref) {
  const { open, onClose, onSuccess, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [testResultId, setTestResultId] = useState("");

//   const handleDateChange = (grade) => {
//     setTestResult(grade);
//   };

  useImperativeHandle(ref, () => ({
    mapEditData(editData) {
        setTestResultId(editData._id);
        setTestResult(editData.score);
    }
  }));

  const handleEditTest = useCallback(() => {
    // setLoading(true);
    var data = {
        new_score: testResult
    }
    console.log("edit test result with id: ", testResultId);
    console.log("edit test result: " + data);
    DataService.updateTestResult(testResultId, data)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          pushMessageToSnackbar({
            text: "Result was updated successfully",
          });
          onSuccess();
          onClose();
            setTestResult("");
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
        setTestResult("");
        return;
      })
  }, [testResult, testResultId, pushMessageToSnackbar, onSuccess, onClose]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Edit Test Result"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        handleEditTest();
        // onSuccess();
      }}
      content={
        <Fragment>
           <TextField
                size="medium"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Grade"
                autoFocus
                value={testResult}
                onChange={event => {
                    setTestResult(event.target.value);
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
            // onClick={handleEditTest}
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

EditTestResultDialog.propTypes = {
  open: PropTypes.bool.isRequired,
//   currentSubject: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired

};

export default EditTestResultDialog;
