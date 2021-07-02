import React, { useState, Fragment, useCallback } from "react";
import PropTypes from "prop-types";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import DataService from "../../../services/data.service";

const AddStudentToClassDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, studentList, currentClass, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState("");

  const handleAddStudentToClass = useCallback(() => {
    setLoading(true);
      var data = {
        class: currentClass._id,
        student: student._id,
      }
      console.log("add student to class id: ", currentClass._id);
      console.log("add student with id: ", student);
      // console.log("create new subject with teacher: ", teacher._id);
      // console.log("create new subject with class: ", currentClass._id);
      // console.log("create new subject: " + JSON.stringify(data));
      DataService.registerStudent(data)
        .then(() => {
          setTimeout(() => {
            setLoading(false);
            pushMessageToSnackbar({
              text: "Add student to this class successfully",
            });
            // onSuccess();
            setStudent("");
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
          setStudent("");

          onClose();
          
        })
    }, [currentClass._id, student, pushMessageToSnackbar, onClose]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Add Student To Class"
      hideBackdrop={false}
      loading={loading}
      
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        // handleAddStudentToClass();
        // onSuccess();
      }}
      content={
        <Fragment>
            <FormControl fullWidth required variant="outlined" margin="normal">
                <InputLabel id="student-label">Student</InputLabel>
                <Select
                    label="Student"
                    id="student-select-required"
                    value={student}
                    // should be multiselect but for demo it is ok
                    onChange={event => {
                      console.log("select student: ", JSON.stringify(event.target.value));
                        setStudent(event.target.value);
                        // onSelectStudent(event.target.value);
                    }}
                >
                    {studentList.map((studentItem) => (
                        <MenuItem value={studentItem} >
                        {studentItem.first_name + " " + studentItem.family_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
           
          </Fragment>
      }
      actions={
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          color="secondary"
          onClick={handleAddStudentToClass}
          // type="submit"
          variant="contained"
          disabled={loading}
        >
          Add {loading && <ButtonCircularProgress />}
        </Button>
        </DialogActions>
      }
    />
  );
});

AddStudentToClassDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired,
  studentList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AddStudentToClassDialog;
