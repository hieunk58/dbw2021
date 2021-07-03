import React, { Fragment, useCallback, useState } from "react";
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

const AddTestDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, pushMessageToSnackbar, currentSubject } = props;
  const [loading, setLoading] = useState(false);
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setTestDate(date);
  };


  const handleCreateTest = useCallback(() => {
    // setLoading(true);
    var data = {
      test_name: testName,
      test_date: testDate,
      subject_id: currentSubject._id
    }
    console.log("create new test: " + JSON.stringify(data));
    DataService.createTest(data)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          pushMessageToSnackbar({
            text: "New test was created successfully",
          });
          setTestDate(new Date());
          setTestName('');
          onSuccess();
          onClose();
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
        setTestDate('');
        return;
      })
  }, [testName, testDate, pushMessageToSnackbar, onSuccess, onClose]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Add New Test"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        handleCreateTest();
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
              <Grid container justify="space-around">
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
                </Grid>
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
            // onClick={handleCreateTest}
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

AddTestDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  currentSubject: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired

};

export default AddTestDialog;
