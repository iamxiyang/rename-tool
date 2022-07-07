import { red } from 'colorette'
import fse from 'fs-extra'
import { Config } from './types'

export default (
  inputGlob: string,
  outputName: string,
  config: string | boolean
) => {
  let fileConfig: Partial<Config> = {}
  let configPath = config && './renameconfig.json'
  if (config && typeof config === 'string') {
    configPath = config
  }
  if (configPath) {
    try {
      fileConfig = fse.readJSONSync(configPath)
    } catch (err) {
      console.error(red('读取配置文件出错' + err))
    }
  }
  const result = {
    input: {
      glob: inputGlob || fileConfig?.input?.glob || '**',
      'fast-glob': fileConfig?.input?.['fast-glob'] || {},
    },
    output: {
      filename: outputName || fileConfig?.output?.filename || '{name}',
      path: fileConfig?.output?.path || './',
      mapping: fileConfig?.output?.mapping || {},
    },
  }

  return { ...result, configPath }
}
