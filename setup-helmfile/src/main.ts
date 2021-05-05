import * as core from '@actions/core'
import {installHelmPlugins, installHelmfile} from './setup'

async function run(): Promise<void> {
  try {
    await installHelmPlugins([
      'https://github.com/databus23/helm-diff',
      'https://github.com/jkroepke/helm-secrets'
    ])
    const additionalPlugins = core.getInput('additional-helm-plugins')
    if (additionalPlugins !== '') {
      installHelmPlugins(additionalPlugins.split(','))
    }
    core.info('Helm plugins installed')
    await installHelmfile(core.getInput('version'))
    core.info('Helmfile installed')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
