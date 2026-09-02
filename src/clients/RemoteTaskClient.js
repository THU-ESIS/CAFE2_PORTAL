import BaseClient from './BaseClient'

class RemoteTaskClient extends BaseClient {
  constructor() {
    // The '/api' prefix will be handled by the proxy in vue.config.js during development.
    super('/api')
  }

  /**
   * Submits a new remote sensing task to the backend.
   * @param {object} taskData - The payload from the create_remote_task.vue form.
   * @returns {Promise<any>} A promise that resolves with the backend's response.
   */
  createTask(taskData) {
    // This endpoint must match the one we will create in the backend's routes.js file.
    return this.post('/remote-tasks', taskData)
  }
}

// Instantiate and export the client directly as a named export.
// This makes it a singleton that can be imported across the app and fixes the undefined error.
export const remoteTaskClient = new RemoteTaskClient();
