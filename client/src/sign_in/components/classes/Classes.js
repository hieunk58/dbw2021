import React, { useEffect, useState, useCallback } from "react";
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
  { id: "number1", numeric: false, label: "Number of subjects" },
  { id: "number2", numeric: false, label: "Number of students" },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;

function CustomTable(props) {
  const { pushMessageToSnackbar, classes, classList, selectClass,
      openAddUserDialog } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [isDeleteTargetDialogOpen, setIsDeleteTargetDialogOpen] = useState(
    false
  );
  const [deleteTargetDialogRow, setDeleteTargetDialogRow] = useState(null);
  const [isDeleteTargetLoading, setIsDeleteTargetLoading] = useState(false);

  const [subjectList, setSubjectList] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [isManageSubjectPageOpen, setIsManageSubjectPageOpen] = useState(false);
  const [isManageStudentPageOpen, setIsManageStudentPageOpen] = useState(false);

  const openManageSubjectPage = useCallback(() => {
    setIsManageSubjectPageOpen(true);
  }, [setIsManageSubjectPageOpen]);

  const closeManageSubjectPage = useCallback(() => {
    setIsManageSubjectPageOpen(false);
  }, [setIsManageSubjectPageOpen]);

  const openManageStudentPage = useCallback(() => {
    setIsManageStudentPageOpen(true);
  }, [setIsManageStudentPageOpen]);

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
    setTimeout(() => {
      setIsDeleteTargetDialogOpen(false);
      setIsDeleteTargetLoading(false);
      const _classList = [...classList];
      const index = _classList.findIndex(
        (element) => element.id === deleteTargetDialogRow.id
      );
      _classList.splice(index, 1);
      setSubjectList(_classList);
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
    classList,
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

  useEffect(() => {
    selectClass(); // selected tab (pink color)
    setStudentList();
  }, [selectClass, setStudentList]);

  // Open manage student page
  if(isManageStudentPageOpen)
  {
    return <ManageStudent
        studentList={studentList}
        setStudentList={setStudentList}
        onClose={closeManageStudentPage}
      />
  }
  // Open manage subject page
  if(isManageSubjectPageOpen)
  {
    return <ManageSubject
        subjectList={subjectList}
        setSubjectList={setSubjectList}
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
      >
      </AddClassDialog>
      <Divider />
      <ConfirmationDialog
        open={isDeleteTargetDialogOpen}
        title="Confirmation"
        className={classes.confirmDialog}
        content={
          deleteTargetDialogRow ? (
            <span>
              {"Do you really want to remove this class "}
              <b>{deleteTargetDialogRow.name}</b>
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
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.number1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.number2}
                      </TableCell>
                      
                      <TableCell component="th" scope="row">
                        <Box display="flex" justifyContent="flex-end">
                        <Tooltip
                          title="Manage subjects"
                          placement="top"
                        >
                          <IconButton
                            className={classes.iconButton}
                            onClick={openManageSubjectPage}
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
                            onClick={openManageStudentPage}
                            aria-label="Manage students"
                          >
                            <GroupsIcon className={classes.blackIcon} />
                          </IconButton>

                        </Tooltip>
                          <IconButton
                            className={classes.iconButton}
                            // TODO onClick={} edit class'name only
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
