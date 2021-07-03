import React from "react";
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

const ResultDetailsDialog = withTheme(function (props) {
  const { open, onClose, testResultList } = props;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      headline= "Result details"
      hideBackdrop={false}
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
                          {row.test.test_name}
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
