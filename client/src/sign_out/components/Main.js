import React, { memo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import NavBar from "./navigation/NavBar";
import DialogSelector from "./login/DialogSelector";
import HeadSection from "./home/HeadSection";

const styles = (theme) => ({
  wrapper: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: "#80cbc4",
    overflowX: "hidden",
  },
});

// function Copyright() {
//     return (
//       <Typography variant="body2" color="textSecondary" align="center">
//         {'Copyright © '}
//         <Link color="inherit" href="https://tu-chemnitz.de">
//           TU Chemnitz
//         </Link>{' '}
//         {new Date().getFullYear()}
//         {'.'}
//       </Typography>
//     );
//   }

function Main(props) {
  const { classes } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // const selectHome = useCallback(() => {
  //   // smoothScrollTop();
  //   document.title =
  //     "TU Chemnitz Management System";
  //   setSelectedTab("Home");
  // }, [setSelectedTab]);

  const openLoginDialog = useCallback(() => {
    setDialogOpen("login");
    setIsMobileDrawerOpen(false);
  }, [setDialogOpen, setIsMobileDrawerOpen]);

  const closeDialog = useCallback(() => {
    setDialogOpen(null);
  }, [setDialogOpen]);

  const handleMobileDrawerOpen = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, [setIsMobileDrawerOpen]);

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, [setIsMobileDrawerOpen]);

  return (
    <div className={classes.wrapper}>
      {/* <SignIn>

      </SignIn> */}
      
      <DialogSelector
        openLoginDialog={openLoginDialog}
        dialogOpen={dialogOpen}
        onClose={closeDialog}
      />
      
      <NavBar
        selectedTab={selectedTab}
        selectTab={setSelectedTab}
        openLoginDialog={openLoginDialog}
        mobileDrawerOpen={isMobileDrawerOpen}
        handleMobileDrawerOpen={handleMobileDrawerOpen}
        handleMobileDrawerClose={handleMobileDrawerClose}
      />
      <HeadSection>

      </HeadSection>
      {/* <Routing
        selectHome={selectHome}
      /> */}
      {/* <Copyright /> */}
    </div>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Main));
