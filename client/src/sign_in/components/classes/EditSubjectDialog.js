import React, { useState, Fragment, useCallback, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import DataService from "../../../services/data.service";

const EditSubjectDialog = withTheme(forwardRef(function(props, ref) {
  const { open, onClose, onSuccess, teacherList, currentClass, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  // const [role, setRole] = useState("");
  const [subjectName, setSubjectName] = useState("");
  // const [teacherList, setTeacherList] = useState([]);
  const [teacher, setTeacher] = useState("");
  const [subjectId, setSubjectId] = useState("");
  // expected teacherList is a list of {id: teacher_id, name: teacher_name}

  useImperativeHandle(ref, () => ({
    mapEditData(editData) {
        setSubjectId(editData._id);
        setSubjectName(editData.subject_name);
        for(let i = 0; i < teacherList.length; ++i) {
          if(teacherList[i]._id === editData.teacher._id) {
            setTeacher(teacherList[i]);
          }
        }
    }
  }));
  
  const handleUpdateSubject = useCallback(() => {
    setLoading(true);
    var data = {
      subject_name: subjectName,
      teacher: teacher._id,
      class: currentClass._id
    }
    console.log("edit subject with id: ", subjectId);
    console.log("edit subject with name: ", subjectName);
    console.log("edit subject with teacher: ", teacher._id);
    console.log("edit subject with class: ", currentClass._id);
    console.log("edit subject: " + JSON.stringify(data));
    DataService.updateSubject(subjectId, data)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          pushMessageToSnackbar({
            text: "Subject was updated successfully",
          });
          onSuccess();
          onClose();
          setSubjectName('');
          setTeacher('');
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
        setSubjectName('');
        setTeacher('');
        return;
      })
  }, [subjectName, teacher._id, currentClass._id, subjectId, pushMessageToSnackbar, onClose]);
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Edit Subject"
      hideBackdrop={false}
      loading={loading}
      onFormSubmit={async event => {
        event.preventDefault();
        setLoading(true);
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
                label="Subject Name"
                value={subjectName}
                onChange={event => {
                    console.log("new subject name: ", event.target.value)
                    setSubjectName(event.target.value);
                }}
            />

            <FormControl fullWidth required variant="outlined" margin="normal">
                <InputLabel id="teacher-label" margin="normal">Instructor</InputLabel>
                <Select
                // fullWidth
                // required
                // variant="outlined"
                // // margin="normal"
                    // labelId="teacher-label"
                    label="Instructor"
                    id="teacher-select-required"
                    value={teacher}
                    // onSelect
                    onChange={event => {
                      console.log("select teacher: ", event.target.value);
                        setTeacher(event.target.value);
                    }}
                >
                    {teacherList.map((teacherItem) => (
                        <MenuItem 
                          // key={teacherItem._id} 
                          value={teacherItem} 
                        >
                        {teacherItem.first_name + " " + teacherItem.family_name}
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
          onClick={handleUpdateSubject}
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

EditSubjectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTeacherList: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired
};

export default EditSubjectDialog;
