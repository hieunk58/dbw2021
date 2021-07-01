import React, { useEffect, useState, useCallback } from "react";
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
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import AddSubjectToClassDialog from "./AddSubjectToClassDialog";
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
  { id: "instructor", numeric: false, label: "Instructor", },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;



function ManageSubject(props) {
  const { pushMessageToSnackbar, classes, onClose, subjectList, 
      setSubjectList, teacherList, currentClass, onSuccess } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  // const [teacherList, setTeacherList] = useState([]);

  const [isDeleteTargetDialogOpen, setIsDeleteTargetDialogOpen] = useState(
    false
  );
  const [deleteTargetDialogRow, setDeleteTargetDialogRow] = useState(null);
  const [isDeleteTargetLoading, setIsDeleteTargetLoading] = useState(false);

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

  // const fetchTeacherList = useCallback(() => {
  //   DataService.getUserList()
  //     .then(res => {
  //       var list = res.data.user_list;
  //       var teachers = [];
  //       for(let i = 0; i < list.length; ++i) {
  //         if(list[i].role.name === "teacher") {
  //           console.log("teacher: ", list[i].username);
  //           console.log("role: ", list[i].role.name);
  //           teachers.push(list[i]);
  //         }
  //       }
  //       setTeacherList(teachers);
  //       // console.log("teacher list count: ", teacherList.length);
  //       // console.log("teacher list count: ", teachers.length);
  //     });
  // }, [setTeacherList]);

  const deleteTarget = useCallback(() => {
    setIsDeleteTargetLoading(true);
    setTimeout(() => {
      setIsDeleteTargetDialogOpen(false);
      setIsDeleteTargetLoading(false);
      const _subjectList = [...subjectList];
      const index = _subjectList.findIndex(
        (element) => element.id === deleteTargetDialogRow.id
      );
      _subjectList.splice(index, 1);
      setSubjectList(_subjectList);
      pushMessageToSnackbar({
        text: "Subject has been removed",
      });
    }, 1500);
  }, [
    setIsDeleteTargetDialogOpen,
    setIsDeleteTargetLoading,
    pushMessageToSnackbar,
    setSubjectList,
    deleteTargetDialogRow,
    subjectList,
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


  // useEffect(() => {
  //   fetchTeacherList();
  // }, [fetchTeacherList]);

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Subject List</Typography>
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
          Add Subject
        </Button>
      </Toolbar>
      
      <AddSubjectToClassDialog 
        open={open}
        onClose={handleClose}
        subjectList={subjectList}
        teacherList={teacherList}
        currentClass={currentClass}
        onSuccess={onSuccess}
        pushMessageToSnackbar={pushMessageToSnackbar}
      >
      </AddSubjectToClassDialog>
      {/* <AddSubjectDialog>
        open={open}
        onClose={handleClose}
        teacherList={teacherList}
        setTeacherList={setTeacherList}
      </AddSubjectDialog> */}
      <Divider />
      <ConfirmationDialog
        open={isDeleteTargetDialogOpen}
        title="Confirmation"
        className={classes.confirmDialog}
        content={
          deleteTargetDialogRow ? (
            <span>
              {"Do you really want to remove this subject "}
              <b>{deleteTargetDialogRow.subject_name}</b>
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
          {subjectList.length > 0 ? (
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={subjectList.length}
                rows={rows}
              />
              <TableBody>
                {stableSort(subjectList, getSorting(order, orderBy))
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
                          <LibraryBooksIcon className={classes.blackIcon} />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.subject_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.teacher.first_name + " " + row.teacher.family_name}
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
                No subject yet.
              </HighlightedInformation>
            </Box>
          )}
        </div>
        <div className={classes.alignRight}>
          <TablePagination
            component="div"
            count={subjectList.length}
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
              actions: subjectList.length > 0 ? classes.dBlock : classes.dNone,
              caption: subjectList.length > 0 ? classes.dBlock : classes.dNone,
            }}
            labelRowsPerPage=""
          />
        </div>
      </Box>
    </Paper>
  );
}

ManageSubject.propTypes = {
  classes: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  subjectList: PropTypes.arrayOf(PropTypes.object).isRequired,
  teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSubjectList: PropTypes.func.isRequired,
  setTeacherList: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(ManageSubject);
