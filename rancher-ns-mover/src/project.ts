import axios from 'axios'

  /**
   * Define class for modifying rancher project
   *
   * @param host - Rancher host
   * @param accessKey - Rancher access key
   * @param secretKey - Rancher secret key
   */
export class RancherProject {
  host:string;
  accessKey:string;
  secretkey:string;

  constructor(host:string, accessKey:string, secretkey:string) {
    this.host = host
    this.accessKey = accessKey
    this.secretkey = secretkey
  }

  /**
   * Check wheter any given project name is exist or not. Also return its id if exist.
   *
   * @param clusterID - Rancher cluster ID
   * @param projectName - Project name to be checked
   * @returns boolean: project exist or not, string: existing projectID (if project already exist)
   */
  async isProjectExist(clusterID: string, projectName: string): Promise<[boolean, string]> {
    try {
      const url = this.host + '/v3/cluster/' + clusterID + '/projects'
      const config = {
        auth: {
          username: this.accessKey,
          password: this.secretkey
        },
      }

      const response = await axios.get(url, config)
      for (const val of response.data.data) {
        if (val.name == projectName) {
          return [true, val.id]
        }
      }
      return [false, ""]

    } catch (error) {
      throw error
    }
  }

  /**
   * Check wheter any given project name is exist or not. Also return its id if exist.
   *
   * @param clusterID - Rancher cluster ID
   * @param name - Project name that will be created
   * @returns created project ID
   */
  async createProject(clusterID: string, name: string): Promise<string> {
    try {
      const url = this.host + '/v3/projects?_replace=true'
      const config = {
        auth: {
          username: this.accessKey,
          password: this.secretkey
        },
      }
      const data = {
        type: "project",
        name: name,
        clusterId: clusterID
      }

      const response = await axios.post(url, data, config)
      return response.data.id

    } catch (error) {
      throw error
    }
  }
}
