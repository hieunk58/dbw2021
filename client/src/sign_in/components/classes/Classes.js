  import React, { useEffect, useState, useCallback, useRef } from "react";
  import PropTypes from "prop-types";
  import {
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    IconButton,
    Tooltip,
    Box,
    Paper,
    Typography,
    Toolbar,
    Button,
    Divider,
    withStyles,
  } from "@material-ui/core";

  import AddIcon from "@material-ui/icons/Add";
  import DeleteIcon from "@material-ui/icons/Delete";
  import GroupsIcon from "@material-ui/icons/GroupAdd";
  import SubjectIcon from "@material-ui/icons/Subject";
  import SchoolIcon from "@material-ui/icons/School";
  import EditIcon from "@material-ui/icons/Edit";
  import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
  import stableSort from "../../../shared/functions/stableSort";
  import getSorting from "../../../shared/functions/getSorting";
  import HighlightedInformation from "../../../shared/components/HighlightedInformation";
  import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
  import AddClassDialog from "./AddClassDialog";
  import ManageStudent from "./ManageStudent";
  import ManageSubject from "./ManageSubject";
  import DataService from "../../../services/data.service";
  import EditClassDialog from "./EditClassDialog";

  const styles = (theme) => ({
    tableWrapper: {
      overflowX: "auto",
    },
    toolbar: {
      justifyContent: "space-between",
    },
    alignRight: {
      display: "flex",
      flexDirection: "row-reverse",
      alignItems: "center",
      paddingLeft: theme.spacing(2),
    },
    blackIcon: {
      color: theme.palette.common.black,
    },
    confirmDialog: {
      color: theme.palette.common.pink,
    },
    avatar: {
      width: 28,
      height: 28,
    },
    firstData: {
      paddingLeft: theme.spacing(3),
    },
    iconButton: {
      padding: theme.spacing(1),
    },
    dBlock: {
      display: "block",
    },
    dNone: {
      display: "none",
    },
  });

  const rows = [
    {
      id: "icon",
      numeric: true,
      label: "",
    },
    { id: "name", numeric: false, label: "Name", },
    { id: "actions", numeric: false, label: "", },
  ];

  const rowsPerPage = 25;

  function CustomTable(props) {
    const editForm = useRef();

    const { pushMessageToSnackbar, classes, selectClass, studentList, setStudentList} = props;
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState(null);
    const [page, setPage] = useState(0);
    const [isDeleteTargetDialogOpen, setIsDeleteTargetDialogOpen] = useState(
      false
    );
    const [deleteTargetDialogRow, setDeleteTargetDialogRow] = useState(null);
    const [isDeleteTargetLoading, setIsDeleteTargetLoading] = useState(false);
    
    const [currentSelectedClass, setCurrentSelectedClass] = useState(null);
    const [subjectList, setSubjectList] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const [studentByClass, setStudentByClass] = useState([]);
    const [classList, setClassList] = useState([]);
    const [subjectByClass, setSubjectByClass] = useState([]);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const fetchClassList = useCallback(() => {
      DataService.getClassList()
        .then(res => {
          console.log("get class list using api: ", res.data);
          setClassList(res.data.class_list);
        });
    }, [setClassList])

    const fetchSubjectList = useCallback(() => {
      DataService.getSubjectList()
        .then(res => {
          console.log("get subject list using api: ", res.data);
          setSubjectList(res.data.subject_list);
          // filter subject by current signed in teacher
          // for student just filter with class id
          // const subjects = [];
          // for(let i = 0; i < subjectList.length; ++i) {
          //   if(subjectList[i].teacher === currentUserId) {
          //     subjects.push(subjectList[i]);
          //   }
          // }
          // setSubjectListByTeacher(subjects);
        });
    
    }, [setSubjectList]);

    const [isManageSubjectPageOpen, setIsManageSubjectPageOpen] = useState(false);
    const [isManageStudentPageOpen, setIsManageStudentPageOpen] = useState(false);

    const [isEditDialogOpen, setIsEditClassDialogOpen] = useState(false);

    const fetchTeacherList = useCallback(() => {
      DataService.getUserList()
        .then(res => {
          console.log("[Main.js] get user list using api: ", res.data);
          // setTargets(res.data.user_list);
  
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
          setTeacherList(teachers);
          // console.log("teacher list count: ", teacherList.length);
          // console.log("teacher list count: ", teachers.length);
        });
    }, []);

    const getSubjectByClass = useCallback((classId) => {
      var subjects = [];
      console.log("subject list: ", subjectList);
      console.log("current selected class id: ", classId);
      for(let i = 0; i < subjectList.length; ++i) {
        console.log("subject.class: ", subjectList[i].class._id);
        if(subjectList[i].class._id === classId) {
          subjects.push(subjectList[i]);
        }
      }
      setSubjectByClass(subjects);
    }, [subjectList]);

    const getStudentByClass = useCallback((classId) => {
      DataService.getStudentByClass(classId)
        .then((res) => {
          console.log("student list: ", res.data.list_student);
          // var subjects = [];
          // console.log("current selected class id: ", classId);
          // for(let i = 0; i < studentList.length; ++i) {
          //   console.log("subject.class: ", studentList[i].class._id);
          //   if(subjectList[i].class._id === classId) {
          //     subjects.push(subjectList[i]);
          //   }
          // }
          setStudentByClass(res.data.list_student);
        })
    }, []);

    const openManageSubjectPage = useCallback((row) => {
      setCurrentSelectedClass(row);
      getSubjectByClass(row._id); // this is class id
      console.log("get subject by class id: ", row._id);
      setIsManageSubjectPageOpen(true);
    }, [getSubjectByClass, setIsManageSubjectPageOpen]);

    const closeManageSubjectPage = useCallback(() => {
      setIsManageSubjectPageOpen(false);
    }, [setIsManageSubjectPageOpen]);

    const openManageStudentPage = useCallback((row) => {
      setCurrentSelectedClass(row);
      getStudentByClass(row._id);
      setIsManageStudentPageOpen(true);
    }, [getStudentByClass]);

    const closeManageStudentPage = useCallback(() => {
      setIsManageStudentPageOpen(false);
    }, [setIsManageStudentPageOpen]);

    const handleRequestSort = useCallback(
      (__, property) => {
        const _orderBy = property;
        let _order = "desc";
        if (orderBy === property && order === "desc") {
          _order = "asc";
        }
        setOrder(_order);
        setOrderBy(_orderBy);
      },
      [setOrder, setOrderBy, order, orderBy]
    );

    const deleteTarget = useCallback(() => {
      setIsDeleteTargetLoading(true);
      DataService.deleteClass(deleteTargetDialogRow._id)
      .then(() => {
        setTimeout(() => {
          setIsDeleteTargetDialogOpen(false);
          setIsDeleteTargetLoading(false);
          const _classList = [...classList];
          const index = _classList.findIndex(
            (element) => element.id === deleteTargetDialogRow.id
            );
          _classList.splice(index, 1);
          setClassList(_classList);
          pushMessageToSnackbar({
            text: "Class has been removed",
          });
          fetchClassList();
        }, 1500);
      })
      .catch(error => {
        pushMessageToSnackbar({
          text: error.response.data.message,
        });
      });
        
    }, [deleteTargetDialogRow, classList, setClassList, pushMessageToSnackbar, fetchClassList]);

    const handleChangePage = useCallback(
      (_, page) => {
        setPage(page);
      },
      [setPage]
    );

    const handleDeleteTargetDialogClose = useCallback(() => {
      setIsDeleteTargetDialogOpen(false);
    }, [setIsDeleteTargetDialogOpen]);

    const handleDeleteTargetDialogOpen = useCallback(
      (row) => {
        setIsDeleteTargetDialogOpen(true);
        setDeleteTargetDialogRow(row);
      },
      [setIsDeleteTargetDialogOpen, setDeleteTargetDialogRow]
    );

    const handleCreateClassSuccess = useCallback(() => {
      fetchClassList();
    }, [fetchClassList]);

    const handleEditClassDialogClose = useCallback(() => {
      setIsEditClassDialogOpen(false);
    }, [setIsEditClassDialogOpen]);

    const handleEditClassDialogOpen = useCallback(
      (row) => {
        console.log("edit data: ", row);
        editForm.current.mapEditData(row);
        setIsEditClassDialogOpen(true);
      },
      [setIsEditClassDialogOpen]
    );

    useEffect(() => {
      selectClass(); // selected tab (pink color)
      fetchSubjectList();
    }, [fetchSubjectList, isManageSubjectPageOpen, selectClass]);

    useEffect(() => {
      fetchClassList();
      fetchTeacherList();
    }, [fetchClassList, fetchTeacherList]);

    // Open manage student page
    if(isManageStudentPageOpen)
    {
      return <ManageStudent
          currentClass={currentSelectedClass}
          studentList={studentList} // all students
          setStudentList={setStudentList}
          studentByClass={studentByClass} // student of each class
          onClose={closeManageStudentPage}
          pushMessageToSnackbar={pushMessageToSnackbar}
        />
    }
    // Open manage subject page
    if(isManageSubjectPageOpen)
    {
      return <ManageSubject
          subjectList={subjectByClass}
          setSubjectList={setSubjectByClass}
          // onSuccess={fetchSubjectList}
          // subjectList={subjectList}
          teacherList={teacherList}
          currentClass={currentSelectedClass}
          // setTeacherList={setTeacherList}
          pushMessageToSnackbar={pushMessageToSnackbar}
          onClose={closeManageSubjectPage}
        />
    }

    return (
      <Paper>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Class List</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
            startIcon={<AddIcon/>}
            disableElevation
          >
            ADD CLASS
          </Button>
        </Toolbar>
        
        <AddClassDialog 
          open={open}
          onClose={handleClose}
          pushMessageToSnackbar={pushMessageToSnackbar}
          onSuccess={handleCreateClassSuccess}
        >
        </AddClassDialog>
        <EditClassDialog
          ref={editForm}
          open={isEditDialogOpen}
          onClose={handleEditClassDialogClose}
          pushMessageToSnackbar={pushMessageToSnackbar}
          onSuccess={fetchClassList}
        >
        </EditClassDialog>
        <Divider />
        <ConfirmationDialog
          open={isDeleteTargetDialogOpen}
          title="Confirmation"
          className={classes.confirmDialog}
          content={
            deleteTargetDialogRow ? (
              <span>
                {"Do you really want to remove this class "}
                <b>{deleteTargetDialogRow.class_name}</b>
                {" from your list?"}
              </span>
            ) : null
          }
          onClose={handleDeleteTargetDialogClose}
          onConfirm={deleteTarget}
          loading={isDeleteTargetLoading}
        />
        <Box width="100%">
          <div className={classes.tableWrapper}>
            {classList.length > 0 ? (
              <Table aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={classList.length}
                  rows={rows}
                />
                <TableBody>
                  {stableSort(classList, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell
                          component="th"
                          scope="row"
                          className={classes.firstData}
                        >
                          <SchoolIcon className={classes.blackIcon}>
                          </SchoolIcon>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.class_name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Box display="flex" justifyContent="flex-end">
                          <Tooltip
                            title="Manage subjects"
                            placement="top"
                          >
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => {
                                openManageSubjectPage(row)
                              }}
                              aria-label="Manage subjects"
                            >
                              <SubjectIcon className={classes.blackIcon} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title="Manage students"
                            placement="top"
                          >
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => {
                                openManageStudentPage(row)
                              }}
                              aria-label="Manage students"
                            >
                              <GroupsIcon className={classes.blackIcon} />
                            </IconButton>

                          </Tooltip>
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => {
                                handleEditClassDialogOpen(row);
                              }}
                              aria-label="Edit"
                            >
                              <EditIcon className={classes.blackIcon} />
                            </IconButton>
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => {
                                handleDeleteTargetDialogOpen(row);
                              }}
                              aria-label="Delete"
                            >
                              <DeleteIcon className={classes.blackIcon} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <Box m={2}>
                <HighlightedInformation>
                  No class yet.
                </HighlightedInformation>
              </Box>
            )}
          </div>
          <div className={classes.alignRight}>
            <TablePagination
              component="div"
              count={classList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                "aria-label": "Previous Page",
              }}
              nextIconButtonProps={{
                "aria-label": "Next Page",
              }}
              onChangePage={handleChangePage}
              classes={{
                select: classes.dNone,
                selectIcon: classes.dNone,
                actions: classList.length > 0 ? classes.dBlock : classes.dNone,
                caption: classList.length > 0 ? classes.dBlock : classes.dNone,
              }}
              labelRowsPerPage=""
            />
          </div>
        </Box>
      </Paper>
    );
  }

  CustomTable.propTypes = {
    classes: PropTypes.object.isRequired,
    classList: PropTypes.arrayOf(PropTypes.object).isRequired,
    setClassList: PropTypes.func.isRequired,
    subjectList: PropTypes.arrayOf(PropTypes.object).isRequired,
    setSubjectList: PropTypes.func.isRequired,
    studentList: PropTypes.arrayOf(PropTypes.object).isRequired,
    setStudentList: PropTypes.func.isRequired,
    teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
    setTeacherList: PropTypes.func.isRequired,
    pushMessageToSnackbar: PropTypes.func,
    openAddUserDialog: PropTypes.func.isRequired,
    selectClass: PropTypes.func.isRequired,
  };

  export default withStyles(styles, { withTheme: true })(CustomTable);
