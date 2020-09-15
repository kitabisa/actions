import * as os from 'os'
import * as path from 'path'
import * as io from '@actions/io'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

export async function installHelmPlugins(): Promise<number> {
  await exec.exec('helm plugin install https://github.com/databus23/helm-diff')
  return await exec.exec(
    'helm plugin install https://github.com/zendesk/helm-secrets'
  )
}

export async function installHelmfile(version: string): Promise<void> {
  const baseUrl = 'https://github.com/roboll/helmfile/releases/download'
  const downloadPath = await download(
    `${baseUrl}/${version}/helmfile_linux_amd64`
  )
  core.info(`Downloaded to: ${downloadPath}`)
  return await install(downloadPath, 'helmfile')
}

export async function download(url: string): Promise<string> {
  core.info(`Downloading from: ${url}`)
  return await tc.downloadTool(url)
}

export async function install(
  downloadPath: string,
  filename: string
): Promise<void> {
  const binPath = `${os.homedir}/bin`
  await io.mkdirP(binPath)
  await io.cp(downloadPath, path.join(binPath, filename))
  core.info(`Copy to: ${binPath}`)
  await exec.exec('chmod', ['+x', `${binPath}/${filename}`])
  return core.addPath(binPath)
}
