import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";

import { FormControl, InputLabel, MenuItem, 
    DialogActions, Select, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const AddSubjectToClassDialog = withTheme(function (props) {
  const { open, onClose, onSuccess, subjectList } = props;
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  // expected subjectList is a list of {id: id, name: subject_name}

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Add Subject To Class"
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
                <InputLabel id="subject-label">Subject</InputLabel>
                <Select
                    label="Subject"
                    id="subject-select-required"
                    value={subject}
                    // should be multiselect but for demo it is ok
                    onChange={event => {
                        setSubject(event.target.value);
                    }}
                >
                    {subjectList.map((subjectItem) => (
                        <MenuItem key={subjectItem.name} value={subjectItem} >
                        {subjectItem.name}
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

AddSubjectToClassDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  subjectList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AddSubjectToClassDialog;
