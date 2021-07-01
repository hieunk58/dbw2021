import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import UserData from "./UserData";

function Dashboard(props) {
  const {
    selectDashboard,
    pushMessageToSnackbar,
    targets,
    setTargets,
  } = props;

  useEffect(selectDashboard, [selectDashboard]);

  return (
    <Paper>
      <UserData 
        pushMessageToSnackbar={pushMessageToSnackbar}
        targets={targets}
        setTargets={setTargets}
      />
    </Paper>
  );
}

Dashboard.propTypes = {
  pushMessageToSnackbar: PropTypes.func,
  targets: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTargets: PropTypes.func.isRequired,
  selectDashboard: PropTypes.func.isRequired,
};

export default Dashboard;
