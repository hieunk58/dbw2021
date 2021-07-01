  import React, { memo, useCallback, useState, useEffect, Fragment } from "react";
  import PropTypes from "prop-types";
  import classNames from "classnames";
  import { withStyles } from "@material-ui/core";
  import Routing from "./Routing";
  import NavBar from "./navigation/NavBar";
  import ConsecutiveSnackbarMessages from "../../shared/components/ConsecutiveSnackbarMessages";
  import DataService from "../../services/data.service";
  import AuthService from "../../services/auth.service";

  const styles = (theme) => ({
    main: {
      marginLeft: theme.spacing(9),
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
      },
    },
  });

function Main(props) {
    const { classes } = props;
    const [selectedTab, setSelectedTab] = useState(null);
    const [targets, setTargets] = useState([]);
    const [classList, setClassList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [subjectListByTeacher, setSubjectListByTeacher] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);

    //const [currentUserId, setCurrentUserId] = useState("60d782d7dd186a3be49bee16"); // fake current sign in user
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);

    // fetch user list from api
    const fetchTeacherList = useCallback(() => {
      console.log("[Main.js] get user list using api");
      DataService.getUserList()
        .then(res => {
          console.log("[Main.js] get user list using api: ", res.data);
          setTargets(res.data.user_list);

          var list = res.data.user_list;
          var teachers = [];
          for(let i = 0; i < list.length; ++i) {
            if(list[i].role.name === "teacher") {
              console.log("teacher: ", list[i].username);
              console.log("role: ", list[i].role.name);
              teachers.push(list[i]);
            }
          }
          setTeacherList(teachers);
          // console.log("teacher list count: ", teacherList.length);
          console.log("teacher list count: ", teachers.length);
          // console.log("user list count: ", targets.length);
        });
    }, [setTeacherList]);
    const fetchRandomUsers = useCallback(() => {
      console.log("[Main.js] get user list using api");
      DataService.getUserList()
        .then(res => {
          console.log("[Main.js] get user list using api: ", res.data);
          setTargets(res.data.user_list);

          var list = res.data.user_list;
          var teachers = [];
          for(let i = 0; i < list.length; ++i) {
            if(list[i].role.name === "teacher") {
              console.log("teacher: ", list[i].username);
              console.log("role: ", list[i].role.name);
              teachers.push(list[i]);
            }
          }
          // setTeacherList(teachers);
          // setTeacherList(list);
          console.log("teacher list count: ", teacherList.length);
          console.log("teacher list count: ", teachers.length);
          console.log("user list count: ", targets.length);
        });
    }, [setTargets, setTeacherList]);

  // dummy data
  const fetchRandomStudents = useCallback(() => {
    const students = [];
    //TODO check person is empty or not before access data
    for (let i = 0; i < 20; i += 1) {
      const student = {
        id: i,
        name: "Daniel Richter",
        username: "dr2021"
      };
      students.push(student);
    }
    setStudentList(students);

  }, [setStudentList]);

  const fetchRandomSubjects = useCallback((currentUser) => {
    DataService.getSubjectList()
      .then(res => {
        console.log("get subject by user: ", currentUser);
        const list = res.data.subject_list;
        console.log("list: ", list);
        // console.log("[Main.js] get subject list using api: ", res.data);
        setSubjectList(subjectList);
        // filter subject by current signed in teacher
        // for student just filter with class id
        if(currentUser) {
          var subjects = [];
          for(let i = 0; i < list.length; ++i) {
            console.log("teacher id: ", list[i].teacher._id);
            if(list[i].teacher._id === currentUser.id) {
              subjects.push(list[i]);
            }
          }
          setSubjectListByTeacher(subjects);
          console.log("subject list by teacher: ", subjectListByTeacher);
          // setSubjectList(subjects);

        }
      });

  }, []);

  // const fetchSubjectByUser = useCallback(() => {
  //   DataService.getSubjectList()
  //     .then(res => {
  //       console.log("[Main.js] get subject list using api: ", res.data);
  //       setSubjectListByTeacher(res.data.subject_list);
  //     });

  // }, [setSubjectList]);

  const fetchRandomClasses = useCallback(() => {
    DataService.getClassList()
      .then(res => {
        console.log("[Main.js] get class list using api: ", res.data);
        setClassList(res.data.class_list);
      });

  }, [setClassList]);

  const selectDashboard = useCallback(() => {
    document.title = "TU Chemnitz - Users";
    setSelectedTab("Users");
    
  }, [
    setSelectedTab,
  ]);
  const selectClass = useCallback(() => {
    document.title = "TU Chemnitz - Classes";
    setSelectedTab("Classes");
    
  }, [
    setSelectedTab,
  ]);
  const selectSubject = useCallback(() => {
    document.title = "TU Chemnitz - Subjects";
    setSelectedTab("Subjects");
    
  }, [
    setSelectedTab,
  ]);

  const getPushMessageFromChild = useCallback(
    (pushMessage) => {
      setPushMessageToSnackbar(() => pushMessage);
    },
    [setPushMessageToSnackbar]
  );

  // const [showAdminPage, setShowAdminPage] = useState(false);
  // const [showTeacherPage, setShowTeacherPage] = useState(false);
  const getCurrentUser = useCallback(() => {
    const user = AuthService.getCurrentUser();
    console.log("getCurrentUser: ", user);
    // fetchRandomStudents();
    fetchRandomSubjects(user);
    if (user) {
      setCurrentUser(user);
      // console.log("current user: ", user);
      // setShowAdminPage(user.role.name === "admin");
      // setShowTeacherPage(user.role.name === "teacher");
    }
  }, []);

  
  useEffect(() => {
    console.log("first get current user");
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    console.log("fetching some data");
    // getCurrentUser();
    // user list
    // fetchRandomSubjects(currentUser);
    fetchRandomUsers();
    fetchTeacherList();
    fetchRandomClasses();
    fetchRandomStudents();

  }, [fetchRandomUsers, fetchRandomClasses, fetchRandomStudents, fetchTeacherList]);

    return (
      <Fragment>
        <NavBar
          currentUser={currentUser}
          selectedTab={selectedTab}
        />
        <ConsecutiveSnackbarMessages
          getPushMessageFromChild={getPushMessageFromChild}
        />
        <main className={classNames(classes.main)}>
          <Routing
            selectDashboard={selectDashboard}
            selectClass={selectClass}
            selectSubject={selectSubject}
            currentUser={currentUser}


            // targets is user list
            targets={targets}
            setTargets={setTargets}

            classList={classList}
            // setClassList={setClassList}

            subjectList={subjectList}
            // setSubjectList={setSubjectList}

            teacherList={teacherList}
            // teacherList={targets}
            // setTeacherList={setTargets}
            // setTeacherList={setTeacherList}

            studentList={studentList}
            setStudentList={setStudentList}

            subjectListByTeacher={subjectListByTeacher}
            // setSubjectListByTeacher={setSubjectListByTeacher}

            pushMessageToSnackbar={pushMessageToSnackbar}

          />
        </main>
      </Fragment>
    );
  }

  Main.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles, { withTheme: true })(memo(Main));
