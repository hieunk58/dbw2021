import React, { useState, useCallback } from "react";
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
import EditIcon from "@material-ui/icons/Edit";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import AddSubjectDialog from "./AddSubjectDialog";

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
  { id: "number1", numeric: false, label: "Category 1" },
  { id: "number2", numeric: false, label: "Category 2" },
  { id: "number3", numeric: false, label: "Category 3" },
  { id: "number4", numeric: false, label: "Category 4", },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;

function CustomTable(props) {
  const { pushMessageToSnackbar, classes, subjectList, setSubjectList, teacherList, setTeacherList, 
      openAddUserDialog } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
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

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Subject List</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickOpen}
          disableElevation
        >
          Add Subject
        </Button>
      </Toolbar>
      
      <AddSubjectDialog 
        open={open}
        onClose={handleClose}
        teacherList={teacherList}
      >
      </AddSubjectDialog>
      <Divider />
      <ConfirmationDialog
        open={isDeleteTargetDialogOpen}
        title="Confirmation"
        className={classes.confirmDialog}
        content={
          deleteTargetDialogRow ? (
            <span>
              {"Do you really want to remove this subject "}
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
                        <Avatar
                          className={classes.avatar}
                          src={row.profilePicUrl}
                        />
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
                        {row.number3}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.number4}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box display="flex" justifyContent="flex-end">
                          <IconButton
                            className={classes.iconButton}
                            // TODO onClick={}
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

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  subjectList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSubjectList: PropTypes.func.isRequired,
  teacherList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTeacherList: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  openAddUserDialog: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(CustomTable);
