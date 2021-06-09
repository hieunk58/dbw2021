import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, Typography, Box } from "@material-ui/core";
import UserData from "./UserData";
// import SettingsArea from "./SettingsArea";
// import AccountInformationArea from "./AccountInformationArea";
// import StatisticsArea from "./StatisticsArea";

function Dashboard(props) {
  const {
    selectDashboard,
    pushMessageToSnackbar,
    targets,
    setTargets,
  } = props;

  useEffect(selectDashboard, [selectDashboard]);

  return (
    // <Fragment>
    //   {/* <StatisticsArea CardChart={CardChart} data={statistics} />
    //   <Box mt={4}>
    //     <Typography variant="subtitle1" gutterBottom>
    //       Your Account
    //     </Typography>
    //   </Box>
    //   <AccountInformationArea
    //     isAccountActivated={isAccountActivated}
    //     toggleAccountActivation={toggleAccountActivation}
    //   /> */}
    //   <Box mt={4}>
    //     <Typography variant="subtitle1" gutterBottom>
    //       Settings1
    //     </Typography>
    //   </Box>
    //   <Box mt={4}>
    //     <Typography variant="subtitle1" gutterBottom>
    //       Settings2
    //     </Typography>
    //   </Box>
    //   <Box mt={4}>
    //     <Typography variant="subtitle1" gutterBottom>
    //       Settings3
    //     </Typography>
    //   </Box>
    //   {/* <SettingsArea pushMessageToSnackbar={pushMessageToSnackbar} />
    //   <UserDataArea
    //     pushMessageToSnackbar={pushMessageToSnackbar}
    //     targets={targets}
    //     setTargets={setTargets}
    //   /> */}
    // </Fragment>
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
