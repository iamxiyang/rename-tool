import FastGlob from 'fast-glob'
import fg from 'fast-glob'
import { Input } from './types'

// 寻找需要修改的文件列表
export default async (input: Input, configPath: string | boolean = '') => {
  const config: FastGlob.Options = {
    ...input['fast-glob'],
    onlyFiles: true,
    absolute: true,
    caseSensitiveMatch: false,
    unique: false,
    objectMode: false,
    ignore: ['node_modules', '**/node_modules'],
  }
  if (configPath && typeof configPath === 'string') {
    config['ignore']?.push(configPath)
  }
  const files = await fg(input.glob, config)
  return files
}
