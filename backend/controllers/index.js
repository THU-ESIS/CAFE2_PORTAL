const userControllers = require("./user_controllers");
const taskControllers = require("./task_controllers");
const searchControllers = require("./search_controllers");
// Add the new remote task controller
const remoteTaskControllers = require("./remote_task_controllers");

module.exports = {
  userControllers,
  taskControllers,
  searchControllers,
  // Export the new controller
  remoteTaskControllers,
};