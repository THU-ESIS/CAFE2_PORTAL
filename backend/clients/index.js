const CafeAPIClient = require('./CafeAPIClient');
// Add the new Python worker client
const PythonWorkerClient = require('./PythonWorkerClient');

module.exports = {
    cafeAPIClient: new CafeAPIClient(),
    // Export a new instance of the python client
    pythonWorkerClient: new PythonWorkerClient()
};