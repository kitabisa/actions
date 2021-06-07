import * as core from '@actions/core'
import * as rp from './project'
import * as rn from './namespace'

async function run(): Promise<void> {
  try {
    const rancherHost = core.getInput('rancher-host')
    const rancherAccessKey = core.getInput('rancher-access-key')
    const rancherSecretKey = core.getInput('rancher-secret-key')
    
    const clusterID = core.getInput('cluster-id')
    const projectName = core.getInput('project-name')
    const namespace = core.getInput('namespace')

    const projectObj = new rp.RancherProject(rancherHost, rancherAccessKey, rancherSecretKey)
    const namespaceObj = new rn.RancherNamespace(rancherHost, rancherAccessKey, rancherSecretKey)

    // check project existence
    let [projectExist, projectID] = await projectObj.isProjectExist(clusterID, projectName)

    if (projectExist) {
      core.info("Project " + projectName + " is already exist")
    } else {
      projectID = await projectObj.createProject(clusterID, projectName)
      core.info("Project " + projectName + " has been created on Rancher")
    }

    // migrate namespace
    const [nsExist, currentNsProjectID] = await namespaceObj.isNamespaceExistOnProject(clusterID, projectID, namespace)
    if (!nsExist) {
      await namespaceObj.moveNamespace(clusterID, namespace, projectID)
    }

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
