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

    const projectObj = new rp.RancherProject(
      rancherHost,
      rancherAccessKey,
      rancherSecretKey
    )

    const namespaceObj = new rn.RancherNamespace(
      rancherHost,
      rancherAccessKey,
      rancherSecretKey
    )

    // check project existence
    const [projectExist, projectID] = await projectObj.isProjectExist(
      clusterID,
      projectName
    )

    let usableProjectID = projectID
    if (projectExist) {
      core.info(`Project ${projectName} is already exist`)
    } else {
      usableProjectID = await projectObj.createProject(clusterID, projectName)
      core.info(`Project ${projectName} has been created on Rancher`)
    }

    // migrate namespace
    const [nsExist] = await namespaceObj.isNamespaceExistOnProject(
      clusterID,
      usableProjectID,
      namespace
    )

    if (!nsExist) {
      await namespaceObj.moveNamespace(clusterID, namespace, projectID)
      core.info(
        `Namespace ${namespace} has been migrated to project ${projectName}`
      )
    } else {
      core.info(
        `Namespace ${namespace} is already exist on project ${projectName}`
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
