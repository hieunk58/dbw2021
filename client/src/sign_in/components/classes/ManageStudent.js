import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  IconButton,
  Avatar,
  Box,
  Paper,
  Typography,
  Toolbar,
  Button,
  Divider,
  withStyles,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import AddStudentToClassDialog from "./AddStudentToClassDialog";

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
  { id: "username", numeric: false, label: "Username", },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;

function ManageStudent(props) {
  const { pushMessageToSnackbar, classes, onClose } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [isDeleteTargetDialogOpen, setIsDeleteTargetDialogOpen] = useState(
    false
  );
  const [deleteTargetDialogRow, setDeleteTargetDialogRow] = useState(null);
  const [isDeleteTargetLoading, setIsDeleteTargetLoading] = useState(false);

  const [studentList, setStudentList] = useState([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    setTimeout(() => {
      setIsDeleteTargetDialogOpen(false);
      setIsDeleteTargetLoading(false);
      const _studentList = [...studentList];
      const index = _studentList.findIndex(
        (element) => element.id === deleteTargetDialogRow.id
      );
      _studentList.splice(index, 1);
      setStudentList(_studentList);
      pushMessageToSnackbar({
        text: "Subject has been removed",
      });
    }, 1500);
  }, [
    setIsDeleteTargetDialogOpen,
    setIsDeleteTargetLoading,
    pushMessageToSnackbar,
    setStudentList,
    deleteTargetDialogRow,
    studentList,
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

  useEffect(() => {
    fetchRandomStudents(); 
  }, [fetchRandomStudents]);

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Student List</Typography>
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
          onClick={handleClickOpen}
          disableElevation
        >
          Add Student
        </Button>
      </Toolbar>
      
      <AddStudentToClassDialog 
        open={open}
        onClose={handleClose}
        studentList={studentList}
      >
      </AddStudentToClassDialog>
      <Divider />
      <ConfirmationDialog
        open={isDeleteTargetDialogOpen}
        title="Confirmation"
        className={classes.confirmDialog}
        content={
          deleteTargetDialogRow ? (
            <span>
              {"Do you really want to remove this student "}
              <b>{deleteTargetDialogRow.name}</b>
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
          {studentList.length > 0 ? (
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={studentList.length}
                rows={rows}
              />
              <TableBody>
                {stableSort(studentList, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.firstData}
                      >
                        <Avatar
                          alt="profile picture"
                          src={`${process.env.PUBLIC_URL}/images/sign_in/image3.jpg`}
                          className={classes.avatar}
                        />
                        
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.username}
                      </TableCell>
                      
                      <TableCell component="th" scope="row">
                        <Box display="flex" justifyContent="flex-end">
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
                No student yet.
              </HighlightedInformation>
            </Box>
          )}
        </div>
        <div className={classes.alignRight}>
          <TablePagination
            component="div"
            count={studentList.length}
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
              actions: studentList.length > 0 ? classes.dBlock : classes.dNone,
              caption: studentList.length > 0 ? classes.dBlock : classes.dNone,
            }}
            labelRowsPerPage=""
          />
        </div>
      </Box>
    </Paper>
  );
}

ManageStudent.propTypes = {
  classes: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  // openAddUserDialog: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  studentList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setStudentList: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(ManageStudent);
