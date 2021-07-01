import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  IconButton,
  Box,
  Paper,
  Typography,
  Toolbar,
  Button,
  Divider,
  withStyles,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import AddTestDialog from "./AddTestDialog";
import EditTestDialog from "./EditTestDialog";
// import AddSubjectDialog from "./AddSubjectDialog";
import DataService from "../../../services/data.service";

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
  { id: "icon", numeric: true, label: "", },
  { id: "name", numeric: false, label: "Name", },
  { id: "date", numeric: false, label: "Date", },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;

function ManageTest(props) {
  const editForm = useRef();

  const { pushMessageToSnackbar, classes, onClose, open, teacherList, currentClass, currentSubject } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [testList, setTestList] = useState([]);

  const [isDeleteTargetDialogOpen, setIsDeleteTargetDialogOpen] = useState(
    false
  );
  const [deleteTargetDialogRow, setDeleteTargetDialogRow] = useState(null);
  const [isDeleteTargetLoading, setIsDeleteTargetLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // const [open, setOpen] = useState(false);
  // const fetchTestListBySubject

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
  const fetchTestListBySubject = useCallback(() => {
    // get test list by subject id
    console.log(" fetchTestListBySubject id: ", currentSubject);
    DataService.getSubjectDetail(currentSubject._id)
    .then((res) => {
      // console.log("test list by subject: ", res.data);
      setTestList(res.data.list_test);
    })
    .catch((error) => {
      console.log("error: ", error.response.data.message);
      pushMessageToSnackbar({
        text: error.response.data.message,
      });
    })

  }, [currentSubject, pushMessageToSnackbar]);

  const deleteTarget = useCallback(() => {
    setIsDeleteTargetLoading(true);
    DataService.deleteTest(deleteTargetDialogRow._id)
      .then(() => {
        setTimeout(() => {
          setIsDeleteTargetDialogOpen(false);
          setIsDeleteTargetLoading(false);
          const _testList = [...testList];
          const index = _testList.findIndex(
            (element) => element.id === deleteTargetDialogRow.id
          );
          _testList.splice(index, 1);
          setTestList(_testList);
          pushMessageToSnackbar({
            text: "Test has been removed",
          });
          // todo fetch test list after remove
          fetchTestListBySubject();
        }, 1500);
      })
      .catch(error => {
        pushMessageToSnackbar({
          text: error.response.data.message,
        });
      });
  }, [
    setIsDeleteTargetDialogOpen,
    setIsDeleteTargetLoading,
    pushMessageToSnackbar,
    // setTestList,
    fetchTestListBySubject,
    deleteTargetDialogRow,
    testList,
  ]);

  const handleChangePage = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );

  const handleDeleteTargetDialogClose = useCallback(() => {
    setIsDeleteTargetDialogOpen(false);
  }, [setIsDeleteTargetDialogOpen]);
  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
  }, [setIsAddDialogOpen]);
  const handleAddDialogOpen = useCallback(() => {
    setIsAddDialogOpen(true);
  }, [setIsAddDialogOpen]);

  const handleDeleteTargetDialogOpen = useCallback(
    (row) => {
      setIsDeleteTargetDialogOpen(true);
      setDeleteTargetDialogRow(row);
    },
    [setIsDeleteTargetDialogOpen, setDeleteTargetDialogRow]
  );

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
  }, [setIsEditDialogOpen]);

  const handleEditDialogOpen = useCallback(
    (row) => {
      // fetchTestListBySubject()
      console.log("edit data: ", row);
      editForm.current.mapEditData(row);
      // editForm.current.mapEditData(row);
      setIsEditDialogOpen(true);
    },
    [setIsEditDialogOpen]
  );

  const handleCreateTestSuccess = useCallback(() => {
    fetchTestListBySubject();

  }, [fetchTestListBySubject]);
  
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('.');
}


  useEffect(() => {
    // if(open === true) {
      console.log('open is true, get test list');
      fetchTestListBySubject();
    // }
  }, [fetchTestListBySubject, open]);

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Test List</Typography>
        <Box mr={1}>
            <Button onClick={onClose}>
            Back
            </Button>
        </Box>
        {/* <Button 
          variant="contained"
          color="primary"
          onClick={onClose}
          disableElevation
        >
          Back
        </Button> */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddDialogOpen}
          disableElevation
        >
          Add New Test
        </Button>
      </Toolbar>
      
      <AddTestDialog 
        open={isAddDialogOpen}
        onClose={handleAddDialogClose}
        // testList={testList}
        // teacherList={teacherList}
        // currentClass={currentClass}
        currentSubject={currentSubject}
        onSuccess={handleCreateTestSuccess}
        pushMessageToSnackbar={pushMessageToSnackbar}
      >
      </AddTestDialog>

      <EditTestDialog
        ref={editForm}
        open={isEditDialogOpen}
        onSuccess={handleCreateTestSuccess}
        onClose={handleEditDialogClose}
        pushMessageToSnackbar={pushMessageToSnackbar}
      >
      </EditTestDialog>

      <Divider />
      <ConfirmationDialog
        open={isDeleteTargetDialogOpen}
        title="Confirmation"
        className={classes.confirmDialog}
        content={
          deleteTargetDialogRow ? (
            <span>
              {"Do you really want to remove this test "}
              <b>{deleteTargetDialogRow.test_name}</b>
              {" from the class?"}
            </span>
          ) : null
        }
        onClose={handleDeleteTargetDialogClose}
        onConfirm={deleteTarget}
        loading={isDeleteTargetLoading}
      />
      <Box width="100%">
        <div className={classes.tableWrapper}>
          {testList.length > 0 ? (
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={testList.length}
                rows={rows}
              />
              <TableBody>
                {stableSort(testList, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.firstData}
                      >
                        <IconButton
                          className="classes.iconButton"
                        >
                          <CalendarTodayIcon className={classes.blackIcon} />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.test_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {formatDate(row.test_date)}
                      </TableCell>
                      
                      <TableCell component="th" scope="row">
                        <Box display="flex" justifyContent="flex-end">
                          <IconButton
                            className={classes.iconButton}
                            onClick={() => {
                              handleEditDialogOpen(row);
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
                There is not any tests yet.
              </HighlightedInformation>
            </Box>
          )}
        </div>
        <div className={classes.alignRight}>
          <TablePagination
            component="div"
            count={testList.length}
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
              actions: testList.length > 0 ? classes.dBlock : classes.dNone,
              caption: testList.length > 0 ? classes.dBlock : classes.dNone,
            }}
            labelRowsPerPage=""
          />
        </div>
      </Box>
    </Paper>
  );
}

ManageTest.propTypes = {
  classes: PropTypes.object.isRequired,
  currentSubject: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  testList: PropTypes.arrayOf(PropTypes.object).isRequired,
  teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTestList: PropTypes.func.isRequired,
  setTeacherList: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(ManageTest);
