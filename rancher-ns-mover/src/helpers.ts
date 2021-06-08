/**
 * Remove trailing space on a given string
 * Example: www.google.com/ will be converted to www.google.com
 *
 * @param url - URL addess
 * @return new URL address without trailing slash
 */
export async function stripTrailingSlash(url: string): Promise<string> {
  return url.replace(/\/$/, '')
}
