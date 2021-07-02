import React, { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";

import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    // IconButton,
    Box,
    Paper,
    // Typography,
    // Toolbar,
    Button,
    // Divider,
    // withStyles,
    DialogActions,
    withTheme
} from "@material-ui/core";

// import DataService from "../../../services/data.service";

// import { DialogActions, TextField, Button, withTheme } from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
// import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
// import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

// const styles = (theme) => ({
//     tableWrapper: {
//       overflowX: "auto",
//     },
//     toolbar: {
//       justifyContent: "space-between",
//     },
//     alignRight: {
//       display: "flex",
//       flexDirection: "row-reverse",
//       alignItems: "center",
//       paddingLeft: theme.spacing(2),
//     },
//     blackIcon: {
//       color: theme.palette.common.black,
//     },
//     confirmDialog: {
//       color: theme.palette.common.pink,
//     },
//     avatar: {
//       width: 28,
//       height: 28,
//     },
//     firstData: {
//       paddingLeft: theme.spacing(3),
//     },
//     iconButton: {
//       padding: theme.spacing(1),
//     },
//     dBlock: {
//       display: "block",
//     },
//     dNone: {
//       display: "none",
//     },
//   });

//   const rows = [
//     { id: "name", numeric: false, label: "Test name", },
//     { id: "score", numeric: true, label: "Grade", },
//   ];


const ResultDetailsDialog = withTheme(function (props) {
  const { open, onClose, testResultList } = props;
//   var testResultList = [{'test_name': "test 1", 'score': 1}, {'test_name': "test 2", 'score': 1},
//   {'test_name': "test 3", 'score': 1}]

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Result details"
      hideBackdrop={false}
    //   loading={loading}
    //   onFormSubmit={async event => {
    //     event.preventDefault();
    //     setLoading(true);
    //     handleCreateClass();
    //     // onSuccess();
    //   }}
      content={
        <Paper variant="outlined">
        <Box width="100%">
          <div>
            {testResultList.length > 0 ? (
              <Table aria-labelledby="tableTitle">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Test name</TableCell>
                        <TableCell align="center">Grade</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {
                    testResultList.map((row, index) => (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell component="th" scope="row" align="center">
                          {row.test_name}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.score}
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
        </Box>
        </Paper>
      }
      actions={
        <DialogActions>
          <Button onClick={onClose}>
          Close
          </Button>
        </DialogActions>
      }
    />
  );
});

ResultDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  testResultList: PropTypes.arrayOf(Object).isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired

};

export default ResultDetailsDialog;
