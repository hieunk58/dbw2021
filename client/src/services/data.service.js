import api from "../api";

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
    
    // user
    getUserList() { 
        console.log("getUserList");
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
    archiveSubject(id, data) {
        // archive is just update variable isArchived = true
        return api.post(`/subject/${id}/update`, data);
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
}

export default new DataService();