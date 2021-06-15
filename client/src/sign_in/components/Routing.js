import React, { memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import Dashboard from "./dashboard/Dashboard";
import Classes from "./classes/Classes";
import Subjects from "./subjects/Subjects";
import StudentPage from "./student/StudentPage"
import PropsRoute from "../../shared/components/PropsRoute";

const styles = (theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    width: "auto",
    [theme.breakpoints.up("xs")]: {
      width: "95%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "90%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "82.5%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("lg")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "70%",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
});

function Routing(props) {
  const {
    classes,
    pushMessageToSnackbar,
    targets, // all user
    setTargets,
    subjectList,
    setSubjectList,
    classList,
    setClassList,
    selectDashboard,
    selectClass,
    selectSubject,
    teacherList,
    setTeacherList,
    studentList,
    setStudentList
    // openAddBalanceDialog,
  } = props;

  return (
    <div className={classes.wrapper}>
      <Switch>
        <PropsRoute
          path="/c/classes"
          component={Classes}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectClass={selectClass}
          classList={classList}
          setClassList={setClassList}
          subjectList={subjectList}
          setSubjectList={setSubjectList}
          studentList={studentList} // get all user then filter by role=student
          setStudentList={setStudentList}
        />
        <PropsRoute
          path="/c/subjects"
          component={Subjects}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectSubject={selectSubject}
          // subjectList={subjectList}
          // setSubjectList={setSubjectList}
          teacherList={teacherList}
          setTeacherList={setTeacherList}
        />
        <PropsRoute
          // path="/c/users"
          path=""
          component={Dashboard}
          pushMessageToSnackbar={pushMessageToSnackbar}
          targets={targets}
          setTargets={setTargets}
          selectDashboard={selectDashboard}
        />
        {/* <PropsRoute
          // student view
          // path="/profile/student"
          path="/c/users"
          component={StudentPage}
        /> */}
        {/* <PropsRoute
          // teacher view
          path="/profile/teacher"
          component={Dashboard}
          pushMessageToSnackbar={pushMessageToSnackbar}
          targets={targets}
          setTargets={setTargets}
          selectDashboard={selectDashboard}
        /> */}
      </Switch>
    </div>
  );
}

Routing.propTypes = {
  classes: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  setTargets: PropTypes.func.isRequired,
  subjectList: PropTypes.arrayOf(PropTypes.object).isRequired,
  teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTeacherList: PropTypes.func.isRequired,
  setSubjectList: PropTypes.func.isRequired,
  classList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setClassList: PropTypes.func.isRequired,
  targets: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectDashboard: PropTypes.func.isRequired,
  selectClass: PropTypes.func.isRequired,
  selectSubject: PropTypes.func.isRequired,
  studentList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setStudentList: PropTypes.func.isRequired,
  
  // openAddBalanceDialog: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Routing));
