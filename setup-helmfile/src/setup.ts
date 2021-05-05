import * as os from 'os'
import * as path from 'path'
import * as io from '@actions/io'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

export async function installHelmPlugins(plugins: string[]): Promise<void> {
  try {
    for (const plugin of plugins) {
      await exec.exec(`helm plugin install ${plugin}`)
    }
  } catch (error) {
    throw error
  }
}

export async function installHelmfile(version: string): Promise<void> {
  try {
    const baseUrl = 'https://github.com/roboll/helmfile/releases/download'
    const downloadPath = await download(
      `${baseUrl}/${version}/helmfile_linux_amd64`
    )
    await install(downloadPath, 'helmfile')
  } catch (error) {
    throw error
  }
}

export async function download(url: string): Promise<string> {
  try {
    core.info(`Downloading from: ${url}`)
    const downloadPath = await tc.downloadTool(url)
    core.info(`Downloaded to: ${downloadPath}`)
    return downloadPath
  } catch (error) {
    throw error
  }
}

export async function install(
  downloadPath: string,
  filename: string
): Promise<void> {
  try {
    const binPath = `${os.homedir}/bin`
    await io.mkdirP(binPath)
    await io.cp(downloadPath, path.join(binPath, filename))
    core.info(`Copy to: ${binPath}`)
    await exec.exec('chmod', ['+x', `${binPath}/${filename}`])
    core.addPath(binPath)
  } catch (error) {
    throw error
  }
}
