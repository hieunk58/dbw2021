/* eslint-disable no-undef */
// import React, { useState, Fragment } from "react";
// import PropTypes from "prop-types";

// import { FormControl, InputLabel, MenuItem, 
//     DialogActions, Select, Button, withTheme } from "@material-ui/core";
// import FormDialog from "../../../shared/components/FormDialog";
// import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

// const AddSubjectToClassDialog = withTheme(function (props) {
//   const { open, onClose, onSuccess, subjectList } = props;
//   const [loading, setLoading] = useState(false);
//   const [subject, setSubject] = useState("");
//   // expected subjectList is a list of {id: id, name: subject_name}

//   return (
//     <FormDialog
//       open={open}
//       onClose={onClose}
//       headline= "Add Subject To Class"
//       hideBackdrop={false}
//       loading={loading}
      
//       onFormSubmit={async event => {
//         event.preventDefault();
//         setLoading(true);
//         onSuccess();
//       }}
//       content={
//         <Fragment>
//             <FormControl fullWidth required variant="outlined" margin="normal">
//                 <InputLabel id="subject-label">Subject</InputLabel>
//                 <Select
//                     label="Subject"
//                     id="subject-select-required"
//                     value={subject}
//                     // should be multiselect but for demo it is ok
//                     onChange={event => {
//                         setSubject(event.target.value);
//                     }}
//                 >
//                     {subjectList.map((subjectItem) => (
//                         <MenuItem key={subjectItem.name} value={subjectItem} >
//                         {subjectItem.name}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
           
//           </Fragment>
//       }
//       actions={
//         <DialogActions>
//           <Button onClick={onClose} disabled={loading}>
//           Close
//         </Button>
//         <Button
//           color="secondary"
//           onClick={onSuccess}
//           variant="contained"
//           disabled={loading}
//         >
//           Add {loading && <ButtonCircularProgress />}
//         </Button>
//         </DialogActions>
//       }
//     />
//   );
// });

// AddSubjectToClassDialog.propTypes = {
//   open: PropTypes.bool.isRequired,
//   editMode: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSuccess: PropTypes.func.isRequired,
//   subjectList: PropTypes.arrayOf(PropTypes.object).isRequired,
// };

// export default AddSubjectToClassDialog;


import React, { useState, Fragment, useCallback } from "react";
import PropTypes from "prop-types";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import DataService from "../../../services/data.service";

const AddSubjectDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, teacherList, currentClass, pushMessageToSnackbar } = props;
  const [loading, setLoading] = useState(false);
  // const [role, setRole] = useState("");
  const [subjectName, setSubjectName] = useState("");
  // const [teacherList, setTeacherList] = useState([]);
  const [teacher, setTeacher] = useState("");
  // expected teacherList is a list of {id: teacher_id, name: teacher_name}
  
  const handleCreateSubject = useCallback(() => {
    setLoading(true);
    var data = {
      subject_name: subjectName,
      assigned_teacher: teacher._id,
      assigned_class: currentClass._id
    }
    console.log("create new subject with name: ", subjectName);
    console.log("create new subject with teacher: ", teacher._id);
    console.log("create new subject with class: ", currentClass._id);
    console.log("create new subject: " + JSON.stringify(data));
    DataService.createSubject(data)
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          pushMessageToSnackbar({
            text: "New subject was created successfully",
          });
          // onSuccess();
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
  }, [subjectName, teacher._id, currentClass._id, pushMessageToSnackbar, onClose]);
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
          onClick={handleCreateSubject}
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
  setTeacherList: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired
};

export default AddSubjectDialog;
