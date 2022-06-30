import { red } from 'colorette'
import defu from 'defu'
import fse from 'fs-extra'
import { Options } from './types'

export default (options: Options) => {
  let fileConfig = {}
  if (options.config === true) {
    options.config = './renameconfig.json'
  } else if (typeof options.config === 'string') {
    options.config = options.config
  }

  if (options.config) {
    try {
      fileConfig = fse.readJSONSync(options.config)
    } catch (err) {
      console.error(red('读取配置文件出错' + err))
    }
  }
  const result = defu(options, fileConfig)
  return result
}
