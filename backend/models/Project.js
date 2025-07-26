const mongoose = require("mongoose");
const projectSchema = require("../schemas/projectSchema");

const Project = mongoose.model("Project",projectSchema);

module.exports = Project;