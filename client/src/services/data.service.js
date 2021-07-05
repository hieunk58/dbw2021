import api from "./api";

class DataService {
    // class
    getClassList() { 
        console.log("getclassList");
        return api.get('/classes'); 
    }
    getClassDetail(id) {
        return api.get(`/class/${id}`)
    }
    createClass(data) {
        return api.post('/class/create', data);
    }
    updateClass(id, data) {
        return api.post(`/class/${id}/update`, data);
    }
    deleteClass(id) {
        console.log("delete class with id: ", id);
        return api.post(`/class/${id}/delete`)
    }

    // enrollment
    getEnrollmentList() {
        console.log("getEnrollmentList");
        return api.get("/enrollments");
    }
    getStudentByClass(id) {
        console.log("get student list by class : ", id);
        return api.get(`/enrollment/${id}`);
    }
    getStudyingClass(data) {
        console.log("get current studying class by student id: ", data);
        return api.get("/enrollment/student", data);
    }
    registerStudent(data) {
        console.log("register student : ", data);
        return api.post("/enrollment/register", data);
    }
    deregisterStudent(data) {
        console.log("deregister student : ", data);
        return api.post("/enrollment/deregister", data);
    }
    
    // user
    getUserList() { 
        return api.get('/users'); 
    }
    getUserDetail(id) { 
        console.log("getUserDetail id: ", id);
        return api.get(`/user/${id}`); 
    }
    updateUser(id, data) {
        return api.post(`/user/${id}/update`, data);
    }
    deleteUser(id) {
        console.log("delete user with id: ", id);
        return api.post(`/user/${id}/delete`)
    }
    createUser(data) {
        return api.post('/user/create', data);
    }

    // subject
    getSubjectList() { 
        console.log("getSubjectList");
        return api.get('/subjects'); 
    }
    // getSubjectByClass(id) { 
    //     console.log("getSubjectList");
    //     return api.get('/subjects'); 
    // }
    getSubjectDetail(id) { 
        console.log("getSubjectDetail");
        return api.get(`/subject/${id}`); 
    }
    updateSubject(id, data) {
        return api.post(`/subject/${id}/update`, data);
    }
    deleteSubject(id) {
        console.log("delete subject with id: ", id);
        return api.post(`/subject/${id}/delete`);
    }
    createSubject(data) {
        return api.post('/subject/create', data);
    }
    archiveSubject(id) {
        // archive is just update variable isArchived = true
        return api.post(`/subject/${id}/archive`);
    }

    // test
    getTestList() {
        return api.get('/tests'); 
    }
    createTest(data) {
        return api.post('/test/create', data);
    }
    updateTest(id, data) {
        return api.post(`/test/${id}/update`, data);
    }
    deleteTest(id) {
        console.log("delete test with id: ", id);
        return api.post(`/test/${id}/delete`);
    }
    getTestDetail(id) { 
        console.log("getTestDetail id: ", id);
        return api.get(`/test/${id}`); 
    }

    // test result
    getTestResultList() {
        return api.get('/results');
    }
    createTestResult(data) {
        return api.post('/result/create', data);
    }
    updateTestResult(id, data) {
        return api.post(`/result/${id}/update`, data);
    }
    deleteTestResult(id) {
        console.log("delete test result with id: ", id);
        return api.post(`/result/${id}/delete`);
    }
}

export default new DataService();