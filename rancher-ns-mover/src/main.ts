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

    let projectObj = new rp.RancherProject(rancherHost, rancherAccessKey, rancherSecretKey)
    let [projectExist, projectID] = await projectObj.isProjectExist(clusterID, projectName)
    console.log(projectExist + " ----- " + projectID)

    if (projectExist) {
      core.info("Project " + projectName + " is already exist")
    } else {
      projectID = await projectObj.createProject(clusterID, projectName)
      core.info("Project " + projectName + " has been created on Rancher")
    }

    // migrate namespace
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
