import * as core from '@actions/core'
import {installHelmPlugins, installHelmfile} from './setup'

async function run(): Promise<void> {
  try {
    installHelmPlugins()
    installHelmfile(core.getInput('helmfile-version'))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
