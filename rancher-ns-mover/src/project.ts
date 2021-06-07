import axios from 'axios'

export class RancherProject {
  host:string;
  accessKey:string;
  secretkey:string;

  constructor(host:string, accessKey:string, secretkey:string) {
    this.host = host
    this.accessKey = accessKey
    this.secretkey = secretkey
  }

  // Check whetet any given project name is exist or not. Also return its id if exist.
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
