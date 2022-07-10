import FastGlob from 'fast-glob'
import fg from 'fast-glob'
import { Input } from './types'

// 寻找需要修改的文件列表
export default async (input: Input, configPath: string | boolean = '') => {
  const fileFastGlobConfig: { [key: string]: unknown } = {
    ...input['fast-glob'],
  }
  const disabledConfig = [
    'onlyFiles',
    'absolute',
    'caseSensitiveMatch',
    'unique',
    'objectMode',
  ]
  disabledConfig.forEach((item) => {
    if (fileFastGlobConfig[item]) {
      console.warn(`${item} 将被忽略，因为程序需要依赖这些配置项，不能进行修改`)
    }
  })

  const config: FastGlob.Options = {
    ignore: [
      '**/*.config.{ts,js}',
      '**/*congig.json',
      '**/*.config.json',
      '**/node_modules/**',
      '**/package.json',
      '**/pnpm-lock.yaml',
    ],
    ...fileFastGlobConfig,
    onlyFiles: true,
    absolute: true,
    caseSensitiveMatch: false,
    unique: false,
    objectMode: false,
  }

  if (configPath && typeof configPath === 'string') {
    config['ignore']?.push(configPath)
  }

  const files = await fg(input.glob, config)
  return files
}
