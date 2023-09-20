import * as core from '@actions/core'
import { installSops, installHelmPlugins, installHelmfile } from './setup'

async function run(): Promise<void> {
  try {
    await installSops(core.getInput('sops-version'))
    core.info('SOPS installed')
    const helmDiffVersion = core.getInput('helm-diff-version')
    const helmSecretsVersion = core.getInput('helm-secrets-version')
    await installHelmPlugins([
      `https://github.com/databus23/helm-diff --version ${helmDiffVersion}`,
      `https://github.com/jkroepke/helm-secrets --version ${helmSecretsVersion}`
    ])
    const helmPlugins = core.getInput('helm-plugins')
    if (helmPlugins !== '') {
      installHelmPlugins(helmPlugins.split(','))
    }
    core.info('Helm plugins installed')

    await installHelmfile(core.getInput('version'))
    core.info('Helmfile installed')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
