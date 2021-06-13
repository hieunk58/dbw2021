import React, { memo, useCallback, useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core";
import Routing from "./Routing";
import NavBar from "./navigation/NavBar";
// import ConsecutiveSnackbarMessages from "../../shared/components/ConsecutiveSnackbarMessages";
// import smoothScrollTop from "../../shared/functions/smoothScrollTop";
// import persons from "../dummy_data/persons";
// import LazyLoadAddBalanceDialog from "./subscription/LazyLoadAddBalanceDialog";

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
// dummy data
const persons = [
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image1.jpg`,
    name: "Markus",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image2.jpg`,
    name: "David",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image3.jpg`,
    name: "Arold",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image4.jpg`,
    name: "Joanic",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image5.jpg`,
    name: "Sophia",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image6.jpg`,
    name: "Aaron",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image7.jpg`,
    name: "Steven",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image8.jpg`,
    name: "Felix",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image9.jpg`,
    name: "Vivien",
  },
  {
    src: `${process.env.PUBLIC_URL}/images/sign_in/image10.jpg`,
    name: "Leonie",
  },
];

// dummy classes
const dummy_classes = [
  {id: 0, name: "Master of Automotive Software Engineering"},
  {id: 1, name: "Master of Informatic"},
  {id: 2, name: "Master of Biomedicine Technique"},
];

//TODO get all user has role=student, subjects
// then fill each class based on classID

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function Main(props) {
  const { classes } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const [targets, setTargets] = useState([]);
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);

  // TODO: fetch user list from api
  const fetchRandomTargets = useCallback(() => {
    const targets = [];
    // take teacher from user list
    const teacherList = [];
    
    //TODO check person is empty or not before access data
    for (let i = 0; i < 20; i += 1) {
      const randomPerson = persons[Math.floor(Math.random() * persons.length)];
      const target = {
        id: i,
        number1: Math.floor(Math.random() * 251),
        number2: Math.floor(Math.random() * 251),
        number3: Math.floor(Math.random() * 251),
        number4: Math.floor(Math.random() * 251),
        name: randomPerson.name,
        profilePicUrl: randomPerson.src,
      };
      targets.push(target);

      const teacher = {
        id: i, // TODO id should be id from Db
        name: randomPerson.name
      };
      teacherList.push(teacher);
    }
    setTargets(targets);
    setTeacherList(teacherList);
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

  const fetchRandomSubjects = useCallback(() => {
    const targets = [];
    //TODO check person is empty or not before access data
    for (let i = 0; i < 20; i += 1) {
      const target = {
        id: i,
        name: "Datenbanken und Webtechnik sommer semester 2021",
        instructor: "Andre Windisch",
      };
      targets.push(target);
    }
    setSubjectList(targets);

  }, [setSubjectList]);

  const fetchRandomClasses = useCallback(() => {
    // const targets = [];
    // //TODO check person is empty or not before access data
    // for (let i = 0; i < 20; i += 1) {
    //   const randomPerson = persons[Math.floor(Math.random() * persons.length)];
    //   const target = {
    //     id: i,
    //     // calculate the number of students and subjects in each class
    //     number1: 3,
    //     number2: 2,
    //     name: randomPerson.name,
    //   };
      // targets.push(target);
    // }
    setClassList(dummy_classes);

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

  useEffect(() => {
    // user list
    fetchRandomTargets();
    fetchRandomClasses();
    fetchRandomSubjects();
    fetchRandomStudents();

  }, [fetchRandomTargets, fetchRandomClasses, fetchRandomSubjects, fetchRandomStudents]);

  return (
    <Fragment>
      <NavBar
        selectedTab={selectedTab}
      />
      <main className={classNames(classes.main)}>
        <Routing
          selectDashboard={selectDashboard}
          selectClass={selectClass}
          selectSubject={selectSubject}
          // targets is user list
          targets={targets}
          setTargets={setTargets}
          classList={classList}
          setClassList={setClassList}
          subjectList={subjectList}
          setSubjectList={setSubjectList}
          teacherList={teacherList}
          setTeacherList={setTeacherList}
          studentList={studentList}
          setStudentList={setStudentList}
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
