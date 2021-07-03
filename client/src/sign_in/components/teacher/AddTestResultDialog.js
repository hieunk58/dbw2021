import React, { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";

import DataService from "../../../services/data.service";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, TextField, Button, withTheme } from "@material-ui/core";

import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const AddTestResultDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, pushMessageToSnackbar, currentSubject, currentTest, studentList } = props;
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

//   const handleResultChange = (grade) => {
//     setTestResult(grade);
//   };


  const handleCreateTestResult = useCallback(() => {
    // setLoading(true);
    var data = {
      testId: currentTest._id,
      studentId: selectedStudent._id,
      subjectId: currentSubject._id,
      score: testResult
    }
    console.log("create new test result: " + JSON.stringify(data));
    DataService.createTestResult(data)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          pushMessageToSnackbar({
            text: "Test result was created successfully",
          });
        //   setTestDate(new Date());
        //   setTestName('');
            setSelectedStudent("");
            setTestResult("");
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
        setSelectedStudent("");
        setTestResult("");
        // setTestName('');
        // setTestDate('');
        return;
      })
  }, [currentTest._id, selectedStudent._id, currentSubject._id, testResult, pushMessageToSnackbar, onSuccess, onClose]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Add New Test Result"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        handleCreateTestResult();
        // onSuccess();
      }}
      content={
        <Fragment>
            <FormControl fullWidth required variant="outlined" margin="normal">
                <InputLabel id="student-label" margin="normal">Student</InputLabel>
                <Select
                // fullWidth
                // required
                // variant="outlined"
                // // margin="normal"
                    // labelId="student-label"
                    label="Student"
                    id="student-select-required"
                    value={selectedStudent}
                    // onSelect
                    onChange={event => {
                      console.log("select student: ", event.target.value);
                        setSelectedStudent(event.target.value);
                    }}
                >
                    {studentList.map((studentItem) => (
                        <MenuItem 
                          // key={studentItem._id} 
                          value={studentItem} 
                        >
                        {studentItem.first_name + " " + studentItem.family_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                size="medium"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Grade"
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
            // onClick={handleCreateTestResult}
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

AddTestResultDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  currentSubject: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired

};

export default AddTestResultDialog;
