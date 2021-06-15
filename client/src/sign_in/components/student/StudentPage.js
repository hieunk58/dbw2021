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
  Divider,
  withStyles,
} from "@material-ui/core";

import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AssignmentIcon from "@material-ui/icons/Assignment";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";

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
  firstData: {
    paddingLeft: theme.spacing(2),
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
  { id: "grade", numeric: false, label: "Grade" },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;

function CustomTable(props) {
  const { classes, subjectList, setSubjectList } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);

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

  const handleChangePage = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );

  const fetchRandomSubjects = useCallback(() => {
    const targets = [];
    //TODO check person is empty or not before access data
    for (let i = 0; i < 10; i += 1) {
      const target = {
        id: i,
        name: "Formal Specification and Verification",
        grade: 1
      };
      targets.push(target);
    }
    setSubjectList(targets);

  }, [setSubjectList]);

  useEffect(fetchRandomSubjects, [fetchRandomSubjects]);

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Subject List</Typography>
      </Toolbar>
      <Divider />
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
                        <LibraryBooksIcon className={classes.blackIcon}/>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.grade}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box display="flex" justifyContent="flex-end">
                          <IconButton
                            className={classes.iconButton}
                            // TODO onClick={openTestResultDetails}
                            aria-label="Detail"
                          >
                            <AssignmentIcon className={classes.blackIcon} />
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
                You don't have any subjects yet.
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
};

export default withStyles(styles, { withTheme: true })(CustomTable);
