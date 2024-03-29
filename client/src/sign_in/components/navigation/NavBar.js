import React, { Fragment, useEffect, useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Drawer,
  List,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Tooltip,
  Box,
  withStyles,
  withWidth,
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ClassIcon from "@material-ui/icons/Class";
import MessageRoundedIcon from '@material-ui/icons/MessageRounded';
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

const styles = (theme) => ({
  appBar: {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.common.white,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: 0,
    },
  },
  appBarToolbar: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
  // appBar: {
  //   boxShadow: theme.shadows[6],
  //   backgroundColor: theme.palette.common.black
  // },
  // appBarToolbar: {
  //   display: "flex",
  //   justifyContent: "space-between"
  // },
  accountAvatar: {
    backgroundColor: theme.palette.secondary.main,
    height: 24,
    width: 24,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
    },
  },
  drawerPaper: {
    height: "100%vh",
    whiteSpace: "nowrap",
    border: 0,
    width: theme.spacing(7),
    overflowX: "hidden",
    marginTop: theme.spacing(8),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
    backgroundColor: theme.palette.common.black,
  },
  smBordered: {
    [theme.breakpoints.down("xs")]: {
      borderRadius: "50% !important",
    },
  },
  menuLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  iconListItem: {
    width: "auto",
    borderRadius: theme.shape.borderRadius,
    paddingTop: 11,
    paddingBottom: 11,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textPrimary: {
    color: theme.palette.primary.main,
  },
  textSelected: {
    color: theme.palette.common.pink,
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400,
  },
  username: {
    paddingLeft: 0,
    paddingRight: theme.spacing(2),
  },
  justifyCenter: {
    justifyContent: "center",
  },
  permanentDrawerListItem: {
    justifyContent: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

function NavBar(props) {
  const { selectedTab, classes, currentUser } = props;
  // Will be use to make website more accessible by screen readers
  const links = useRef([]);
  const [menuItems, setMenuItems] = useState([]);
  
  // Menu items on left navigation bar: Dashboard, Logout, etc
  var tempItems = [
    {
      link: "/",
      name: "Logout",
      icon: {
        desktop: (
          <PowerSettingsNewIcon className="text-white" fontSize="small" />
        ),
        mobile: <PowerSettingsNewIcon className="text-white" />,
      },
    }
  ];

  const calMenuItems = useCallback(() => {
    console.log("calMenuItems() role: ", currentUser.role);
    if(currentUser.role === "admin") {
      console.log("role is admin");
      var adminNavBar = [
      {
        link: "/c/users",
        name: "Users",
        icon: {
          desktop: (
            <DashboardIcon
              className={
                selectedTab === "Users" ? classes.textSelected : "text-white"
              }
              fontSize="small"
            />
          ),
          mobile: <DashboardIcon className="text-white" />,
        },
      },
      {
        link: "/c/classes",
        name: "Classes",
        icon: {
          desktop: (
            <ClassIcon
              className={
                selectedTab === "Classes" ? classes.textSelected : "text-white"
              }
              fontSize="small"
            />
          ),
          mobile: <ClassIcon className="text-white" />,
        },
      },
      {
        link: "/",
        name: "Logout",
        icon: {
          desktop: (
            <PowerSettingsNewIcon className="text-white" fontSize="small" />
          ),
          mobile: <PowerSettingsNewIcon className="text-white" />,
        },
      }
    ]
    // setMenuItems(adminNavBar.concat(tempItems));
    setMenuItems(adminNavBar);

    } else if(currentUser.role === "teacher") {
      var teacherNavBar = [
        {
          link: "/c/teacher",
          name: "Teacher View",
          icon: {
            desktop: (
              <DashboardIcon
                className={
                  selectedTab === "Teacher"
                    ? classes.textSelected
                    : "text-white"
                }
                fontSize="small"
              />
            ),
            mobile: <DashboardIcon className="text-white" />,
          },
        }
      ] 
      setMenuItems(teacherNavBar.concat(tempItems));
    } else {
      var studentNavBar = [
        {
          link: "/c/student",
          name: "Student View",
          icon: {
            desktop: (
              <DashboardIcon
                className={
                  selectedTab === "Student"
                    ? classes.textSelected
                    : "text-white"
                }
                fontSize="small"
              />
            ),
            mobile: <DashboardIcon className="text-white" />,
          },
        }
      ]
      setMenuItems(studentNavBar.concat(tempItems));
    }
  }, [selectedTab]);

  useEffect(() => {
    calMenuItems();
  }, [calMenuItems, currentUser])

  return (
    <Fragment>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar className={classes.appBarToolbar}>
          <Box display="flex" alignItems="center" justifyContent="flex-start" width="100%">
            <Typography
              variant="h4"
              className={classes.brandText}
              display="inline"
              color="secondary"
            >
              TU Chemnitz
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            width="100%"
          >
            <IconButton>
              <MessageRoundedIcon className={classes.primary} /> 
            </IconButton>
            <ListItem
              disableGutters
              className={classNames(classes.iconListItem, classes.smBordered)}
            >
              <Avatar
                alt="profile picture"
                src={`${process.env.PUBLIC_URL}/images/sign_in/image1.jpg`}
                className={classNames(classes.accountAvatar)}
              />
              <ListItemText
                className={classes.username}
                primary={
                  <Typography color="textPrimary">{currentUser.username}</Typography>
                }
              />
            </ListItem>
          </Box>
        </Toolbar>
      </AppBar>
      <Hidden xsDown>
        <Drawer //  Drawer on the left side
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={false}
        >
          <List>
            {menuItems.map((element, index) => (
              <Link
                to={element.link}
                className={classes.menuLink}
                onClick={element.onClick}
                key={index}
                ref={(node) => {
                  links.current[index] = node;
                }}
              >
                <Tooltip
                  title={element.name}
                  placement="right"
                  key={element.name}
                >
                  <ListItem
                    selected={selectedTab === element.name}
                    button
                    divider={index !== menuItems.length - 1}
                    className={classes.permanentDrawerListItem}
                    onClick={() => {
                      links.current[index].click();
                    }}
                    aria-label={
                      element.name === "Logout"
                        ? "Logout"
                        : `Go to ${element.name}`
                    }
                  >
                    <ListItemIcon className={classes.justifyCenter}>
                      {element.icon.desktop}
                    </ListItemIcon>
                  </ListItem>
                </Tooltip>
              </Link>
            ))}
          </List>
        </Drawer>
      </Hidden>
      {/* <NavigationDrawer
        menuItems={menuItems.map((element) => ({
          link: element.link,
          name: element.name,
          icon: element.icon.mobile,
          onClick: element.onClick,
        }))}
        anchor="left"
        open={isMobileOpen}
        selectedItem={selectedTab}
        onClose={closeMobileDrawer}
      /> */}
    </Fragment>
  );
}

NavBar.propTypes = {
  // messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTab: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles, { withTheme: true })(NavBar));
