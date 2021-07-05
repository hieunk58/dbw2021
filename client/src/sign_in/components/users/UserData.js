import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  IconButton,
  Avatar,
  Tooltip,
  Box,
  Paper,
  Typography,
  Toolbar,
  Button,
  Divider,
  withStyles,
} from "@material-ui/core";

import jsPDF from "jspdf";
import "jspdf-autotable";

import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
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
  {
    id: "icon",
    numeric: true,
    label: "",
  },
  {
    id: "name",
    numeric: false,
    label: "Name",
  },
  { id: "username", numeric: false, label: "Username" },
  { id: "role", numeric: false, label: "Role" },
  {
    id: "actions",
    numeric: false,
    label: "",
  },
];

const rowsPerPage = 25;

function CustomTable(props) {
  const editForm = useRef();

  const { pushMessageToSnackbar, classes, targets, setTargets } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [isDeleteTargetDialogOpen, setIsDeleteTargetDialogOpen] = useState(
    false
  );
  const [isEditDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editUserDialogRow, setEditUserDialogRow] = useState(null);

  const [deleteTargetDialogRow, setDeleteTargetDialogRow] = useState(null);
  const [isDeleteTargetLoading, setIsDeleteTargetLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  },[]);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchUserList = useCallback(() => {
    DataService.getUserList()
      .then(res => {
        console.log("get user list using api: ", res.data);
        setTargets(res.data.user_list);
      });
  }, [setTargets]);

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
    DataService.deleteUser(deleteTargetDialogRow._id)
      .then(() => {
        setTimeout(() => {
          console.log("delete user: ", deleteTargetDialogRow);
          setIsDeleteTargetDialogOpen(false);
          setIsDeleteTargetLoading(false);
          const _targets = [...targets];
          const index = _targets.findIndex(
            (element) => element.id === deleteTargetDialogRow.id
          );
          _targets.splice(index, 1);
          setTargets(_targets);
          fetchUserList();
          pushMessageToSnackbar({
            text: "User has been removed",
          });
        }, 1000);
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
  }, [deleteTargetDialogRow, targets, setTargets, pushMessageToSnackbar, fetchUserList]);

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
  const handleEditUserDialogClose = useCallback(() => {
    setIsEditUserDialogOpen(false);
  }, [setIsEditUserDialogOpen]);

  const handleEditUserDialogOpen = useCallback(
    (row) => {
      console.log("edit data: ", row);
      editForm.current.mapEditData(row);

      setIsEditUserDialogOpen(true);
      setEditUserDialogRow(row);
    },
    [setIsEditUserDialogOpen, setEditUserDialogRow]
  );

  const exportToPdf = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(16);

    const title = "List of user";
    const headers = [["NAME", "USERNAME", ["ROLE"]]];

    const data = targets.map(elem => [elem.first_name + " " + elem.family_name,
                              elem.username, elem.role.name]);

    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("list_user.pdf")
  }


  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
      <Box display="flex" p={1} m={1} justifyContent="flex-start">
        <Typography variant="h6">User List</Typography>
        <Tooltip
          title="Export"
          placement="top"
        >
          <IconButton
            className={classes.iconButton}
            onClick={() => {
              exportToPdf()
            }}
            aria-label="Export"
          >
            <GetAppIcon className={classes.blackIcon} fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickOpen}
          startIcon={<AddIcon/>}
          disableElevation
        >
          Add User
        </Button>
      </Toolbar>
      <AddUserDialog 
        open={open} 
        onClose={handleClose} 
        onSuccess={fetchUserList}
        pushMessageToSnackbar={pushMessageToSnackbar}>
      </AddUserDialog>
      <EditUserDialog
        ref={editForm}
        open={isEditDialogOpen}
        onClose={handleEditUserDialogClose}
        onSuccess={fetchUserList}
        // editData={editUserDialogRow}
        // surname={editData.family_name}
        // firstname={editData.first_name}
        // username={editData.username}
        // password={editData.password}
        // role={editData.role}

        pushMessageToSnackbar={pushMessageToSnackbar}>
      </EditUserDialog>
      <Divider />
      <ConfirmationDialog
        open={isDeleteTargetDialogOpen}
        title="Confirmation"
        className={classes.confirmDialog}
        content={
          deleteTargetDialogRow ? (
            <span>
              {"Do you really want to remove this user "}
              <b>{deleteTargetDialogRow.username}</b>
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
          {targets.length > 0 ? (
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={targets.length}
                rows={rows}
              />
              <TableBody>
                {stableSort(targets, getSorting(order, orderBy))
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
                        {row.first_name + ' ' + row.family_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.username}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.role.name}
                      </TableCell>
                     
                      <TableCell component="th" scope="row">
                        <Box display="flex" justifyContent="flex-end">
                          <IconButton
                            className={classes.iconButton}
                            onClick={() => {
                              handleEditUserDialogOpen(row);
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
                No user yet.
              </HighlightedInformation>
            </Box>
          )}
        </div>
        <div className={classes.alignRight}>
          <TablePagination
            component="div"
            count={targets.length}
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
              actions: targets.length > 0 ? classes.dBlock : classes.dNone,
              caption: targets.length > 0 ? classes.dBlock : classes.dNone,
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
  targets: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTargets: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(CustomTable);
