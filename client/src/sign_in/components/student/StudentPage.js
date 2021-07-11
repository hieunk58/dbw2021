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
  Divider,
  withStyles,
} from "@material-ui/core";

import jsPDF from "jspdf";
import "jspdf-autotable";

import LibraryBooksIcon from '@material-ui/icons/ChromeReaderMode';
import SubjectIcon from "@material-ui/icons/Subject";
import GetAppIcon from '@material-ui/icons/GetApp';
// import AssignmentIcon from "@material-ui/icons/Assignment";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ResultReport from "./ResultDetailsDialog";
// import DataService from "../../../services/data.service";
// import AuthService from "../../../services/auth.service";
// import ManageTest from "./ManageTest";

const styles = (theme) => ({
  tableWrapper: {
    overflowX: "auto",
  },
  toolbar: {
    justifyContent: "space-between",
    // justifyContent: "center",
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
  { id: "name", numeric: false, label: "Subject name", },
  { id: "avgGrade", numeric: false, label: "Average grade" },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;

function CustomTable(props) {
  // const location = useLocation();
  const { classes, selectStudentPage, subjectList, testResultList, currentUser } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  // const [currentUser, setCurrentUser] = useState(undefined);
  // const [isManageTestPageOpen, setIsManageTestPageOpen] = useState(false);
  
  // const [currentSelectedSubject, setCurrentSelectedSubject] = useState(null);
  // test list is all test
  const [testResultBySubject, setTestResultBySubject] = useState([]);
  const [averageTestResultList, setAverageTestResultList] = useState([]);
  // extract test by subject id from test list
  // const [testListBySubject, setTestListBySubject] = useState([]);
  // const [subjectList, setSubjectListByTeacher] = useState([]);

  const [open, setOpen] = useState(false);

  // function calculateAvgResult() {
  //   // call this in useEffect
  //   var results = [];
  //   for(let i = 0; i < testResultList.length; ++i) {
  //     if(testResultList[i].student === currentUser.id) {
  //       // this test result belongs to current signed in student
  //       results.push(testResultList[i]);
  //     }
  //   }
  //   // target list: [{subject, avgGrade}]
    
  // }

  const getTestResultBySubject = useCallback((subjectId) => {
    var results = [];
    for(let i = 0; i < testResultList.length; ++i) {
      console.log("testResultList.subject: ", testResultList[i].subject);
      console.log("testResultList.test: ", testResultList[i].test.test_name);
      if(testResultList[i].subject._id === subjectId) {
        results.push(testResultList[i]);
      }
    }
    setTestResultBySubject(results);
  }, [testResultList]);

  const openTestResultDetail = ((row) => {
    // row is subject detail
    console.log("openTestResultDetail: ", row);
    getTestResultBySubject(row._id);
    setOpen(true);
  });

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

  const calculateAvgResult = useCallback ((list, currentUser) => {
    var testList = [];

    for(let i = 0; i < list.length; ++i) {
      if(list[i].student === currentUser.id) {
        // take all test results belong to current student
        var temp = {'_id': list[i].subject._id, 
        'name': list[i].subject.subject_name, 
        'score': list[i].score };
        testList.push(temp);
      }
    }

    // Calculate the sums and group data (while tracking count)
    const reduced = testList.reduce(function(m, d){
        if(!m[d.name]){
          m[d.name] = {...d, count: 1};
          return m;
        }
        m[d.name].score += d.score;
        m[d.name].count += 1;
        return m;
    },{});
   
   // Create new array from grouped data and compute the average
   const result = Object.keys(reduced).map(function(k){
       const item  = reduced[k];
       return {
           _id: item._id,
           name: item.name,
           score: item.score/item.count
       }
   })
  
    // console.log(result);
    setAverageTestResultList(result);
    
  }, [setAverageTestResultList]);

  const exportToPdf = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(16);

    const title = "My Result";
    const headers = [["SUBJECT NAME", "GRADE"]];

    //const data = subjectList.map(elem => [elem.subject_name, elem.class.class_name]); //todo show avg grade
    const data = subjectList.map(elem => [elem.subject_name, 1]); //todo show avg grade

    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("result_report.pdf")
  }

  useEffect(() => {
    selectStudentPage();
    calculateAvgResult(testResultList, currentUser);
  }, [calculateAvgResult, currentUser, selectStudentPage, testResultList]);


  return (
    <Paper>
        <Toolbar className={classes.toolbar}>
          <Box display="flex" width="100%" justifyContent="flex-start">
            <Typography variant="h6">Subject List</Typography>
          </Box>
          <Box display="flex" width="100%" justifyContent="flex-end">
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
                <GetAppIcon className={classes.blackIcon} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      <ResultReport
        open={open}
        onClose={handleClose}
        testResultList={testResultBySubject}
      >
      </ResultReport>
      <Divider />
      <Box width="100%">
        <div className={classes.tableWrapper}>
          {averageTestResultList.length > 0 ? (
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={averageTestResultList.length}
                rows={rows}
              />
              <TableBody>
                {stableSort(averageTestResultList, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.firstData}
                      >
                        <IconButton className="classes.iconButton">
                          <LibraryBooksIcon className={classes.blackIcon}/>
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.score}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box display="flex" justifyContent="flex-end">
                        
                          <Tooltip
                            title="Result details"
                            placement="top"
                          >
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => {
                                openTestResultDetail(row)
                              }}
                              aria-label="Results"
                            >
                              <SubjectIcon className={classes.blackIcon} />
                            </IconButton>
                          </Tooltip>
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
            count={averageTestResultList.length}
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
              actions: averageTestResultList.length > 0 ? classes.dBlock : classes.dNone,
              caption: averageTestResultList.length > 0 ? classes.dBlock : classes.dNone,
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
  currentUser: PropTypes.object.isRequired,
  studyingClass: PropTypes.object.isRequired,
  subjectList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectStudentPage: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(CustomTable);
