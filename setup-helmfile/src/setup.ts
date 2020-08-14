import * as os from 'os'
import * as path from 'path'
import * as io from '@actions/io'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

export async function wait(milliseconds: number): Promise<string> {
  return new Promise(resolve => {
    if (isNaN(milliseconds)) {
      throw new Error('milliseconds not a number')
    }

    setTimeout(() => resolve('done!'), milliseconds)
  })
}


export async function installHelmPlugins() {
  exec.exec("helm plugin install https://github.com/databus23/helm-diff")
  exec.exec("helm plugin install https://github.com/zendesk/helm-secrets")
}

export async function installHelmfile(version: string) {
  const baseUrl = "https://github.com/roboll/helmfile/releases/download"
  const downloadPath = await download(`${baseUrl}/${version}/helmfile_linux_amd64`);
  await install(downloadPath, "helmfile");
}

export async function download(url: string): Promise<string> {
  console.log("Downloading from: " + url);
  const downloadPath = await tc.downloadTool(url);
  console.log("Downloaded to: " + downloadPath);
  return downloadPath;
}

export async function install(downloadPath: string, filename: string) {
  const binPath = `${os.homedir}/bin`;
  await io.mkdirP(binPath);
  await io.cp(downloadPath, path.join(binPath, filename));
  await exec.exec("chmod", ["+x", `${binPath}/${filename}`]);
  core.addPath(binPath);
}