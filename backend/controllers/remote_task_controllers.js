const { pythonWorkerClient } = require('../clients');
const { responseModel } = require('../core');
// Optional: If you want to save a record of the task in your main database
// const { UserTask } = require('../model');

module.exports = {
  async createRemoteTask(req, res) {
    try {
      const formData = req.body;
      // const { userId } = req.session; // Available if you need to save user-specific data

      // 1. Log that we received the request from the frontend
      logger.info(`Received remote task request: ${JSON.stringify(formData)}`);

      // 2. Forward the request to the Python worker service
      const result = await pythonWorkerClient.createRemoteTask(formData);

      // FIX: Add a check to handle errors that are not being thrown correctly.
      // This ensures that if the Python worker returns an error, we treat it as such.
      if (result && result.success === false) {
          throw new Error(result.error || 'Unknown error from Python worker');
      }

      logger.info(`Received response from Python worker: ${JSON.stringify(result)}`);

      // 3. (Optional but recommended) Save a record of this task to your database
      // This step would be similar to the NCL task controller.

      // 4. Send the successful result back to the frontend
      res.json(responseModel.ResponseSuccess.create(result).toJSON());

    } catch (e) {
      logger.error(`Create remote task error: ${e.message}`);
      res.status(500).json(responseModel.InternalError.fromError(e).toJSON());
    }
  },
};
