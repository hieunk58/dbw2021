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
  // const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);

  // TODO: fetch user list from api
  const fetchRandomTargets = useCallback(() => {
    const targets = [];
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
    }
    setTargets(targets);
  }, [setTargets]);

  const selectDashboard = useCallback(() => {
    document.title = "TU Chemnitz - Dashboard";
    setSelectedTab("Dashboard");
    
  }, [
    setSelectedTab,
  ]);

  useEffect(() => {
    // user list
    fetchRandomTargets();
    // other list
  }, [fetchRandomTargets]);

  return (
    <Fragment>
      <NavBar
        selectedTab={selectedTab}
      />
      <main className={classNames(classes.main)}>
        <Routing
          selectDashboard={selectDashboard}
          targets={targets}
          setTargets={setTargets}
          // pushMessageToSnackbar={pushMessageToSnackbar}
        />
      </main>
    </Fragment>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Main));
