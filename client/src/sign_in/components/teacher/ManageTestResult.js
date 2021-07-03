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
  Tooltip
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import AddTestResultDialog from "./AddTestResultDialog";
import EditTestResultDialog from "./EditTestResultDialog";
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
  { id: "test", numeric: false, label: "Test name", },
  { id: "name", numeric: false, label: "Student name", },
  { id: "score", numeric: false, label: "Grade", },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;

function ManageTestResult(props) {
  const editForm = useRef();

  const { pushMessageToSnackbar, classes, onClose, onSuccess,
    studentList, currentSubject, currentTest } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [testResultList, setTestResultList] = useState([]);

  const [isDeleteTargetDialogOpen, setIsDeleteTargetDialogOpen] = useState(
    false
  );
  const [deleteTargetDialogRow, setDeleteTargetDialogRow] = useState(null);
  const [isDeleteTargetLoading, setIsDeleteTargetLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // const [open, setOpen] = useState(false);
  // const fetchTestResultListByTestId

  const fetchTestResultListByTestId = useCallback(() => {
    // get test list by subject id
    console.log(" fetchTestResultListByTestId id: ", currentTest);
    DataService.getTestDetail(currentTest._id)
    .then((res) => {
      // console.log("test list by subject: ", res.data);
      setTestResultList(res.data.list_result);
    })
    .catch((error) => {
      console.log("error: ", error.response.data.message);
      pushMessageToSnackbar({
        text: error.response.data.message,
      });
    })

  }, [currentTest, pushMessageToSnackbar]);

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
    DataService.deleteTestResult(deleteTargetDialogRow._id)
      .then(() => {
        setTimeout(() => {
          setIsDeleteTargetDialogOpen(false);
          setIsDeleteTargetLoading(false);
          const _testResultList = [...testResultList];
          const index = _testResultList.findIndex(
            (element) => element.id === deleteTargetDialogRow.id
          );
          _testResultList.splice(index, 1);
          setTestResultList(_testResultList);
          pushMessageToSnackbar({
            text: "Test result has been removed",
          });
          // todo fetch test list after remove
          fetchTestResultListByTestId();
        }, 1500);
      })
      .catch(error => {
        setTimeout(() => {
            pushMessageToSnackbar({
              text: error.response.data.message,
            });
            setIsDeleteTargetDialogOpen(false);
            setIsDeleteTargetLoading(false);
        }, 1500)
      });
  }, [
    setIsDeleteTargetDialogOpen,
    setIsDeleteTargetLoading,
    pushMessageToSnackbar,
    setTestResultList,
    fetchTestResultListByTestId,
    deleteTargetDialogRow,
    testResultList,
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

  const handleDeleteTargetDialogOpen = useCallback(
    (row) => {
      setIsDeleteTargetDialogOpen(true);
      setDeleteTargetDialogRow(row);
    },
    [setIsDeleteTargetDialogOpen, setDeleteTargetDialogRow]
  );

  // add dialog
  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
  }, [setIsAddDialogOpen]);
  const handleAddDialogOpen = useCallback(() => {
    setIsAddDialogOpen(true);
  }, [setIsAddDialogOpen]);
  // edit dialog
  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
  }, [setIsEditDialogOpen]);

  const handleEditDialogOpen = useCallback(
    (row) => {
      // fetchTestResultListByTestId()
      console.log("edit data: ", row);
      editForm.current.mapEditData(row);
      setIsEditDialogOpen(true);
    },
    [setIsEditDialogOpen]
  );

  const handleCreateTestSuccess = useCallback(() => {
    fetchTestResultListByTestId();

  }, [fetchTestResultListByTestId]);


  useEffect(() => {
      fetchTestResultListByTestId();
  }, [fetchTestResultListByTestId]);

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Test Result</Typography>
        <Button 
          variant="contained"
          color="primary"
          onClick={onClose}
          disableElevation
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddDialogOpen}
          disableElevation
        >
          Add Test Result
        </Button>
      </Toolbar>
      <AddTestResultDialog
        open={isAddDialogOpen}
        onClose={handleAddDialogClose}
        studentList={studentList}
        onSuccess={handleCreateTestSuccess}
        currentSubject={currentSubject}
        currentTest={currentTest}
        pushMessageToSnackbar={pushMessageToSnackbar}
      >
      </AddTestResultDialog>
      <EditTestResultDialog
        ref={editForm}
        open={isEditDialogOpen}
        currentSubject={currentSubject}
        currentTest={currentTest}
        onClose={handleEditDialogClose}
        onSuccess={handleCreateTestSuccess}
        pushMessageToSnackbar={pushMessageToSnackbar}
      >
      </EditTestResultDialog>
      <Divider />
      <ConfirmationDialog
        open={isDeleteTargetDialogOpen}
        title="Confirmation"
        className={classes.confirmDialog}
        content={
          deleteTargetDialogRow ? (
            <span>
              {"Do you really want to remove this test result "}
              <b>{deleteTargetDialogRow.test_name}</b>
              {" from the list?"}
            </span>
          ) : null
        }
        onClose={handleDeleteTargetDialogClose}
        onConfirm={deleteTarget}
        loading={isDeleteTargetLoading}
      />
      <Box width="100%">
        <div className={classes.tableWrapper}>
          {testResultList.length > 0 ? (
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={testResultList.length}
                rows={rows}
              />
              <TableBody>
                {stableSort(testResultList, getSorting(order, orderBy))
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
                        {currentTest.test_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.student.first_name + " " + row.student.family_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.score}
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
                There is not any results yet.
              </HighlightedInformation>
            </Box>
          )}
        </div>
        <div className={classes.alignRight}>
          <TablePagination
            component="div"
            count={testResultList.length}
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
              actions: testResultList.length > 0 ? classes.dBlock : classes.dNone,
              caption: testResultList.length > 0 ? classes.dBlock : classes.dNone,
            }}
            labelRowsPerPage=""
          />
        </div>
      </Box>
    </Paper>
  );
}

ManageTestResult.propTypes = {
  classes: PropTypes.object.isRequired,
  currentSubject: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  testResultList: PropTypes.arrayOf(PropTypes.object).isRequired,
  teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTestList: PropTypes.func.isRequired,
  setTeacherList: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(ManageTestResult);
