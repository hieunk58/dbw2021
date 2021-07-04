import React, { memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import Dashboard from "./users/Dashboard";
import Classes from "./classes/Classes";
import StudentPage from "./student/StudentPage";
import TeacherPage from "./teacher/TeacherPage";
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
    selectStudentPage,
    selectTeacherPage,
    selectSubject,
    teacherList,
    setTeacherList,
    currentUser,
    subjectListByTeacher,
    setSubjectListByTeacher,
    subjectListByClass,
    studentList,
    setStudentList,
    testResultList,
    setTestResultList,
    studyingClass
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
          teacherList={teacherList}
          setClassList={setClassList}
          subjectList={subjectList}
          // setSubjectList={setSubjectList}
          // studentList={studentList}
          // setStudentList={setStudentList}
        />
        <PropsRoute
          path="/c/users"
          component={Dashboard}
          pushMessageToSnackbar={pushMessageToSnackbar}
          targets={targets}
          setTargets={setTargets}
          selectDashboard={selectDashboard}
        />
        <PropsRoute
          // student view
          // path="/profile/student"
          path="/c/student"
          component={StudentPage}
          selectStudentPage={selectStudentPage}
          currentUser={currentUser}
          studyingClass={studyingClass}
          testResultList={testResultList}
          subjectList={subjectListByClass}
        />
        <PropsRoute
          // teacher view
          path="/c/teacher"
          component={TeacherPage}
          currentUser={currentUser}
          selectTeacherPage={selectTeacherPage}
          pushMessageToSnackbar={pushMessageToSnackbar}
          subjectListByTeacher={subjectListByTeacher}
          // setSubjectListByTeacher={setSubjectListByTeacher}
          // targets={targets}
          // setTargets={setTargets}
          // selectDashboard={selectDashboard}
        />
      </Switch>
    </div>
  );
}

Routing.propTypes = {
  classes: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  targets: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTargets: PropTypes.func.isRequired,
  subjectList: PropTypes.arrayOf(PropTypes.object).isRequired,
  teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
  // setTeacherList: PropTypes.func.isRequired,
  setSubjectList: PropTypes.func.isRequired,
  classList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setClassList: PropTypes.func.isRequired,
  selectDashboard: PropTypes.func.isRequired,
  selectClass: PropTypes.func.isRequired,
  selectTeacherPage: PropTypes.func.isRequired,
  selectStudentPage: PropTypes.func.isRequired,
  studentList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setStudentList: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Routing));
