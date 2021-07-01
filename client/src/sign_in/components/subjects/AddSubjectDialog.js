import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const AddSubjectDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, teacherList } = props;
  const [loading, setLoading] = useState(false);
  // const [role, setRole] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [teacher, setTeacher] = useState("");
  // expected teacherList is a list of {id: teacher_id, name: teacher_name}

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Add New Subject"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
        onSuccess();
      }}
      content={
        <Fragment>
            <TextField
                size="normal"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Subject Name"
                value={subjectName}
                onChange={event => {
                    setSubjectName(event.target.value);
                }}
            />

            <FormControl fullWidth required variant="outlined" margin="normal">
                <InputLabel id="teacher-label">Instructor</InputLabel>
                <Select
                    // labelId="teacher-label"
                    label="Instructor"
                    id="teacher-select-required"
                    value={teacher}
                    onChange={event => {
                        setTeacher(event.target.value);
                    }}
                >
                    {teacherList.map((teacherItem) => (
                        <MenuItem key={teacherItem.name} value={teacherItem} >
                        {teacherItem.name}
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
          Create {loading && <ButtonCircularProgress />}
        </Button>
        </DialogActions>
      }
    />
  );
});

AddSubjectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
  // setTeacherList: PropTypes.func.isRequired,
};

export default AddSubjectDialog;
