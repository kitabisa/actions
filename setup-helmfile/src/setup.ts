import * as os from 'os'
import * as path from 'path'
import * as io from '@actions/io'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

export async function installHelmPlugins(): Promise<void> {
  await exec.exec('helm plugin install https://github.com/databus23/helm-diff')
  await exec.exec('helm plugin install https://github.com/zendesk/helm-secrets')
}

export async function installHelmfile(version: string): Promise<void> {
  const baseUrl = 'https://github.com/roboll/helmfile/releases/download'
  const downloadPath = await download(
    `${baseUrl}/${version}/helmfile_linux_amd64`
  )
  await install(downloadPath, 'helmfile')
}

export async function download(url: string): Promise<string> {
  core.info(`Downloading from: ${url}`)
  const downloadPath = await tc.downloadTool(url)
  core.info(`Downloaded to: ${downloadPath}`)
  return downloadPath
}

export async function install(
  downloadPath: string,
  filename: string
): Promise<void> {
  const binPath = `${os.homedir}/bin`
  await io.mkdirP(binPath)
  await io.cp(downloadPath, path.join(binPath, filename))
  await exec.exec('chmod', ['+x', `${binPath}/${filename}`])
  core.addPath(binPath)
}
