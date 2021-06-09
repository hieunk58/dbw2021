import React, { memo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
// import AOS from "aos/dist/aos";
import { withStyles } from "@material-ui/core";
import NavBar from "./navigation/NavBar";
// import Footer from "./footer/Footer";
// import "aos/dist/aos.css";
// import CookieRulesDialog from "./cookies/CookieRulesDialog";
// import CookieConsent from "./cookies/CookieConsent";
// import dummyBlogPosts from "../dummy_data/blogPosts";
import DialogSelector from "./login/DialogSelector";
import Routing from "./Routing";
// import smoothScrollTop from "../../shared/functions/smoothScrollTop";

// AOS.init({ once: true });

const styles = (theme) => ({
  wrapper: {
    backgroundColor: theme.palette.common.white,
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

  const selectHome = useCallback(() => {
    // smoothScrollTop();
    document.title =
      "TU Chemnitz Management System";
    setSelectedTab("Home");
  }, [setSelectedTab]);

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
      <Routing
        selectHome={selectHome}
      />
      {/* <Copyright /> */}
    </div>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Main));
