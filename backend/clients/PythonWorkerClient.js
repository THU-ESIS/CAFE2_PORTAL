const BaseClient = require('./BaseClient');

class PythonWorkerClient extends BaseClient {
  constructor() {
    // This is the address of your Python Flask server.
    // Make sure the port matches the one in your server.py file.
    super('http://172.17.15.34:5002');
  }

  /**
   * Forwards the remote sensing task request to the Python worker.
   * @param {object} taskData The payload from the frontend.
   * @returns {Promise<any>}
   */
  createRemoteTask(taskData) {
    // This endpoint must match a route in your Python server.py
    return this.post('/api/run-task', taskData);
  }
}

module.exports = PythonWorkerClient;
