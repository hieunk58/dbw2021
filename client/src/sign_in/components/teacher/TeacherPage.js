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

import AssessmentIcon from '@material-ui/icons/Assessment';
import LibraryBooksIcon from '@material-ui/icons/ChromeReaderMode';
import SubjectIcon from "@material-ui/icons/Subject";
// import AssignmentIcon from "@material-ui/icons/Assignment";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import stableSort from "../../../shared/functions/stableSort";
import getSorting from "../../../shared/functions/getSorting";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import DataService from "../../../services/data.service";
// import AuthService from "../../../services/auth.service";
import ManageTest from "./ManageTest";
import ResultDetailsDialog from "../teacher/ResultDetailsDialog";

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
  { id: "className", numeric: false, label: "Class" },
  { id: "actions", numeric: false, label: "", },
];

const rowsPerPage = 25;

function CustomTable(props) {
  // const location = useLocation();
  const { classes, selectTeacherPage, currentUser, pushMessageToSnackbar, subjectListByTeacher } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  // const [currentUser, setCurrentUser] = useState(undefined);
  const [isManageTestPageOpen, setIsManageTestPageOpen] = useState(false);
  const [isResultDetailsDialogOpen, setIsResultDetailsDialogOpen] = useState(false);
  
  const [currentSelectedSubject, setCurrentSelectedSubject] = useState(null);
  // test list is all test
  const [testResultList, setTestResultList] = useState([]);
  // extract test by subject id from test list
  const [testListBySubject, setTestListBySubject] = useState([]);
  const [testResultListBySubject, setTestResultListBySubject] = useState([]);
  // const [subjectListByTeacher, setSubjectListByTeacher] = useState([]);
  const [studentListBySubject, setStudentListBySubject] = useState([]);

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

  const fetchTestResult = useCallback(() => {
    DataService.getTestResultList()
    .then(res => {
      console.log("result list: ", res.data.result_list);
      setTestResultList(res.data.result_list);
      });
  }, [setTestResultList]);

  const calculateAvgResult = useCallback ((list, subjectId) => {
    var resultList = [];

    for(let i = 0; i < list.length; ++i) {
      if(list[i].subject._id === subjectId) {
        // take all test results belong to current student
        var temp = {
        'name': list[i].student.first_name + " " + list[i].student.family_name,
        'score': list[i].score };
        resultList.push(temp);
      }
    }

    // Calculate the sums and group data (while tracking count)
    const reduced = resultList.reduce(function(m, d){
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
           name: item.name,
           score: (item.score/item.count).toFixed(2)
       }
   })
  
    console.log(result);
    setTestResultListBySubject(result);

  }, [setTestResultListBySubject]);

  const fetchTestListBySubject = useCallback((currentSubject) => {
    // get test list by subject id
    console.log(" fetchTestListBySubject id: ", currentSubject);
    DataService.getSubjectDetail(currentSubject._id)
    .then((res) => {
      console.log("test list by subject: ", res.data.list_test);
      console.log("test result list by subject: ", res.data.list_result);
      setTestListBySubject(res.data.list_test);
      setTestResultListBySubject(res.data.list_result);
    })
    .catch((error) => {
      pushMessageToSnackbar({
        text: error.response.data.message,
      });
    })
  }, [pushMessageToSnackbar]);

  const fetchStudentListBySubject = useCallback((subject) => {
    // get student list by subject with class id
    console.log("selected subject: ", subject);
    console.log("fetchStudentListBySubject with class id: ", subject.class._id);
    DataService.getEnrollmentList()
      .then(res => {
        console.log("enrollment list: ", res.data.list);
        var students = [];
        var list = res.data.list;
        for(let i = 0 ; i < list.length; ++i) {
          if(list[i].class === subject.class._id) {
            console.log("enrollment class: ", list[i].class);
            students.push(list[i].student);
          }
        }
        //
        setStudentListBySubject(students);
      });
  }, []);

  const openManageTestPage = useCallback((row) => {
    setCurrentSelectedSubject(row);
    console.log("get test list by subject id: ", row._id);
    // fetchTestListBySubject(row)
    fetchStudentListBySubject(row);
    setIsManageTestPageOpen(true);
  }, [fetchStudentListBySubject]);

  const closeManageTestPage = useCallback(() => {
    // when changing something in test, test result page, get all test result again
    fetchTestResult();
    setIsManageTestPageOpen(false);
  }, [fetchTestResult]);

  const openResultDetailsDialog = useCallback((row) => {
    // setCurrentSelectedSubject(row);
    console.log("get test result list by subject id: ", row._id);
    // fetchTestListBySubject(row)
    // fetchStudentListBySubject(row);
    console.log("testResultList: ", testResultList);
    calculateAvgResult(testResultList, row._id);
    setIsResultDetailsDialogOpen(true);
  }, [calculateAvgResult, testResultList]);

  const closeResultDetailsDialog = useCallback(() => {
    setIsResultDetailsDialogOpen(false);
  }, [setIsResultDetailsDialogOpen]);

  useEffect(() => {
    selectTeacherPage();
    fetchTestResult();
  }, [fetchTestResult, selectTeacherPage]);

  // Open manage subject page
  if(isManageTestPageOpen)
  {
    return <ManageTest
        open={isManageTestPageOpen}
        testList={testListBySubject}
        // testResultList={testResultListBySubject}
        onSuccess={fetchTestListBySubject}
        studentList={studentListBySubject}
        currentSubject={currentSelectedSubject}
        pushMessageToSnackbar={pushMessageToSnackbar}
        onClose={closeManageTestPage}
      />
  }

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Subject List</Typography>
      </Toolbar>
      <ResultDetailsDialog
        open={isResultDetailsDialogOpen}
        testResultList={testResultListBySubject}
        onClose={closeResultDetailsDialog}
      />
      <Divider />
      <Box width="100%">
        <div className={classes.tableWrapper}>
          {subjectListByTeacher.length > 0 ? (
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={subjectListByTeacher.length}
                rows={rows}
              />
              <TableBody>
                {stableSort(subjectListByTeacher, getSorting(order, orderBy))
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
                        {row.subject_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.class.class_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box display="flex" justifyContent="flex-end">
                        <Tooltip
                            title="Manage tests"
                            placement="top"
                          >
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => {
                                console.log("select subject: ", row);
                                openManageTestPage(row)
                              }}
                              aria-label="Manage test"
                            >
                              <SubjectIcon className={classes.blackIcon} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title="Test results"
                            placement="top"
                          >
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => {
                                openResultDetailsDialog(row)
                              }}
                              aria-label="Results"
                            >
                              <AssessmentIcon className={classes.blackIcon} />
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
            count={subjectListByTeacher.length}
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
              actions: subjectListByTeacher.length > 0 ? classes.dBlock : classes.dNone,
              caption: subjectListByTeacher.length > 0 ? classes.dBlock : classes.dNone,
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
  subjectListByTeacher: PropTypes.arrayOf(PropTypes.object).isRequired,
  // testResultList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSubjectListByTeacher: PropTypes.func.isRequired,
  selectTeacherPage: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(CustomTable);
