import { red } from 'colorette'
import defu from 'defu'
import fse from 'fs-extra'
import { Config, Options } from './types'

// 合并配置项
const defaultConfig: Config = {
  input: {
    glob: '**',
    'fast-glob': {},
  },
  output: {
    // 保存到什么目录，TODO 暂不支持
    path: './',
    // 文件默认规则
    filename: '{pinyin}.{ext}',
    mapping: {
      // 映射关系优先级最高，key是原始文件名，不包含后缀
      // "": ""
    },
  },
}

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

  const result = defu(options, fileConfig, defaultConfig)

  return result
}
