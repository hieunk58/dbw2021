import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const AddStudentToClassDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, studentList } = props;
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState("");
  // expected studentList is a list of {id: id, name: student_name}

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
        onSuccess();
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
                        setStudent(event.target.value);
                    }}
                >
                    {studentList.map((studentItem) => (
                        <MenuItem key={studentItem.name} value={studentItem} >
                        {studentItem.name}
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
          onClick={onSuccess}
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
  studentList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AddStudentToClassDialog;
