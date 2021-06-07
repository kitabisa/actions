import axios from 'axios'

/**
 * Define class for modifying namespace on rancher
 *
 * @param host - Rancher host
 * @param accessKey - Rancher access key
 * @param secretKey - Rancher secret key
 */
export class RancherNamespace {
  host: string
  accessKey: string
  secretkey: string

  constructor(host: string, accessKey: string, secretkey: string) {
    this.host = host
    this.accessKey = accessKey
    this.secretkey = secretkey
  }

  /**
   * Check wheter a namespace is exist in a given project. Also return its id if exist.
   *
   * @param clusterID - Rancher cluster ID
   * @param projectName - Project name to be checked
   *
   * @returns boolean: namespace exist or not in a given project
   * @returns string: current namespace project ID
   */
  async isNamespaceExistOnProject(
    clusterID: string,
    projectID: string,
    namespace: string
  ): Promise<[boolean, string]> {
    try {
      const url = `${this.host}/v3/cluster/${clusterID}/namespaces?limit=-1&sort=name`
      const config = {
        auth: {
          username: this.accessKey,
          password: this.secretkey
        }
      }

      const response = await axios.get(url, config)
      for (const val of response.data.data) {
        if (val.name === namespace) {
          if (val.projectId === null) {
            return [false, '']
          } else if (val.projectId === projectID) {
            return [true, val.projectId]
          } else {
            return [false, val.projectId]
          }
        }
      }

      throw new Error('namespace is not exist on any rancher project')
    } catch (error) {
      throw error
    }
  }

  /**
   * Check wheter any given project name is exist or not. Also return its id if exist.
   *
   * @param clusterID - Rancher cluster ID
   * @param namespace - Namespace that will be moved into the new project
   * @param newProjectID - New project ID
   */
  async moveNamespace(
    clusterID: string,
    namespace: string,
    newProjectID: string
  ): Promise<void> {
    try {
      const url = `${this.host}/v3/cluster/${clusterID}/namespaces/${namespace}?action=move`
      const config = {
        auth: {
          username: this.accessKey,
          password: this.secretkey
        }
      }
      const data = {
        projectId: newProjectID
      }

      await axios.post(url, data, config)
    } catch (error) {
      throw error
    }
  }
}
