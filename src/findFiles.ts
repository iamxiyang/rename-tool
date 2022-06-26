import defu from 'defu'
import FastGlob from 'fast-glob'
import fg from 'fast-glob'
import { Input } from './types'

// 寻找需要修改的文件列表
export default async (input: Input, configPath: string | boolean = '') => {
  const baseConfig: FastGlob.Options = {
    onlyFiles: true,
    absolute: true,
    caseSensitiveMatch: false,
    unique: false,
    objectMode: false,
    ignore: ['node_modules', '**/node_modules'],
  }
  if (configPath && typeof configPath === 'string') {
    baseConfig['ignore']?.push(configPath)
  }
  const config = defu(baseConfig, input['fast-glob'])
  const files = await fg(input.glob, config)
  return files
}
