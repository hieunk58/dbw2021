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
    const [subjectListByClass, setSubjectListByClass] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [testResultList, setTestResultList] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [studyingClass, setStudyingClass] = useState(undefined);

    // var currentClass = "";

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
          var students = [];
          for(let i = 0; i < list.length; ++i) {
            if(list[i].role.name === "teacher") {
              console.log("teacher: ", list[i].username);
              console.log("role: ", list[i].role.name);
              teachers.push(list[i]);
            }
            if(list[i].role.name === "student") {
              console.log("student: ", list[i].username);
              console.log("role: ", list[i].role.name);
              students.push(list[i]);
            }
          }
          // setTeacherList(teachers);
          setStudentList(students);
          // setTeacherList(list);
          // console.log("teacher list count: ", teacherList.length);
          // console.log("teacher list count: ", teachers.length);
          // console.log("user list count: ", targets.length);
        });
    }, [setTargets]);


    // const filterSubjectByClass = useCallback(() => {
    //   var subjects = [];
    //   console.log("filterSubjectByClass with id: ", studyingClass);
    //   for(let i = 0; i < subjectList.length; ++i) {
    //     console.log("filterSubjectByClass: ", studyingClass);
    //     console.log("class id: ", subjectList[i].class._id);
    //     if(subjectList[i].class._id === studyingClass) {
    //       subjects.push(subjectList[i]);
    //     }
    //   }
    //   setSubjectListByClass(subjects);
    // }, [studyingClass, subjectList]);

  // after add all subject, filter by teacher id
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
          var subjectByClass = [];
          for(let i = 0; i < list.length; ++i) {
            console.log("teacher id: ", list[i].teacher._id);
            console.log("class id: ", list[i].class._id);
            if(list[i].teacher._id === currentUser.id) {
              subjects.push(list[i]);
            }
            if(list[i].class._id === studyingClass) {
              subjectByClass.push(list[i]);
            }
            
          }
          console.log("current class: ", studyingClass);
          setSubjectListByTeacher(subjects);
          // used by student
          setSubjectListByClass(subjectByClass);
          // console.log("subject list by teacher: ", subjectListByTeacher);
          // setSubjectList(subjects);

        }
      });

  }, [studyingClass, subjectList]);

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
  // const selectSubject = useCallback(() => {
  //   document.title = "TU Chemnitz - Subjects";
  //   setSelectedTab("Subjects");
    
  // }, [
  //   setSelectedTab,
  // ]);
  const selectStudentPage = useCallback(() => {
    document.title = "TU Chemnitz - Student View";
    setSelectedTab("Student");
    
  }, [
    setSelectedTab,
  ]);
  const selectTeacherPage = useCallback(() => {
    document.title = "TU Chemnitz - Teacher View";
    setSelectedTab("Teacher");
    
  }, [
    setSelectedTab,
  ]);

  const getPushMessageFromChild = useCallback(
    (pushMessage) => {
      setPushMessageToSnackbar(() => pushMessage);
    },
    [setPushMessageToSnackbar]
  );

  const getCurrentStudyingClass = useCallback((userId) => {
    DataService.getEnrollmentList()
      .then(res => {
        console.log("current studying class: ", res.data.list);
        var studyingClass = "";
        var list = res.data.list;
        for(let i = 0 ; i < list.length; ++i) {
          if(list[i].student._id === userId) {
              studyingClass = list[i].class;
              console.log("detect studying class: ", studyingClass)
          }
        }
        //
        setStudyingClass(studyingClass);
        // filterSubjectByClass(studyingClass);
      });
  }, [setStudyingClass]);

  const fetchTestResult = useCallback((userId) => {
    DataService.getTestResultList()
      .then(res => {
        console.log("result list: ", res.data.result_list);
        var results = [];
        var list = res.data.result_list;
        for(let i = 0 ; i < list.length; ++i) {
          if(list[i].student === userId) {
              console.log("result with student id: ",list[i].student )
            results.push(list[i]);
          }
        }
        //
        setTestResultList(results);
      });
  }, []);

  const getCurrentUser = useCallback(() => {
    const user = AuthService.getCurrentUser();
    console.log("getCurrentUser: ", user);
    // get enrollment class for student
    if(user) {
      // set current user
      setCurrentUser(user);
      console.log("user.role: ", user.role);
      
      // if signed user is student, get current studying class
      if(user.role === "student") {
        console.log("getCurrentStudyingClass");
        getCurrentStudyingClass(user.id);
        // get all test result with user.id
        fetchTestResult(user.id);

      }
      // fetchRandomStudents();
      fetchRandomSubjects(user);
      
    }
   
  }, [fetchRandomSubjects, fetchTestResult, getCurrentStudyingClass]);

  
  useEffect(() => {
    console.log("first get current user");
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    fetchRandomUsers();
    fetchTeacherList();
    fetchRandomClasses();

  }, [fetchRandomUsers, fetchRandomClasses, fetchTeacherList]);

  // useEffect(() => {
  //   filterSubjectByClass();
  // }, [filterSubjectByClass, studyingClass, subjectList])

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
            // selectSubject={selectSubject}
            selectStudentPage={selectStudentPage}
            selectTeacherPage={selectTeacherPage}
            currentUser={currentUser}


            // targets is user list
            targets={targets}
            setTargets={setTargets}

            classList={classList}
            // setClassList={setClassList}

            studyingClass={studyingClass}
            subjectListByClass={subjectListByClass}

            subjectList={subjectList}
            // setSubjectList={setSubjectList}
            testResultList={testResultList}

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
