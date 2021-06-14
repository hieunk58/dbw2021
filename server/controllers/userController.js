exports.studentContent = (req, res) => {
    res.status(200).send("Student Content.");
};
  
exports.adminContent = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.teacherContent = (req, res) => {
    res.status(200).send("Teacher Content.");
};
