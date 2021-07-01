import React, { Fragment, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

import DataService from "../../../services/data.service";

import { Grid, DialogActions, TextField, Button, withTheme } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const EditTestDialog = withTheme(forwardRef(function (props, ref) {
  const { open, onClose, onSuccess, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testId, setTestId] = useState("");
  // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setTestDate(date);
  };

  useImperativeHandle(ref, () => ({
    mapEditData(editData) {
        setTestId(editData._id);
        setTestName(editData.test_name);
        setTestDate(editData.test_date);
    }
  }));

  const handleEditTest = useCallback(() => {
    // setLoading(true);
    var data = {
      test_name: testName,
      test_date: testDate
    //   subject_id: currentSubject._id
    }
    console.log("edit test with id: ", testId);
    console.log("edit test: " + data);
    DataService.updateTest(testId, data)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          pushMessageToSnackbar({
            text: "Test was updated successfully",
          });
          onSuccess();
          onClose();
          setTestName('');
          setTestDate(new Date());
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
        setTestName('');
        setTestDate(new Date());
        return;
      })
  }, [testName, testDate, testId, pushMessageToSnackbar, onSuccess, onClose]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Edit Test"
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
                label="Test name"
                autoFocus
                value={testName}
                onChange={event => {
                    setTestName(event.target.value);
                }}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              {/* <Grid container justify="space-around"> */}
                <KeyboardDatePicker
                  disableToolbar
                  variant="outline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  fullWidth
                  id="date-picker-dialog"
                  required
                  label="Test date"
                  value={testDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                {/* </Grid> */}
            </MuiPickersUtilsProvider>

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

EditTestDialog.propTypes = {
  open: PropTypes.bool.isRequired,
//   currentSubject: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired

};

export default EditTestDialog;
