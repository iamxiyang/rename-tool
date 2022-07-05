import fse from 'fs-extra'
import { parse, resolve } from 'pathe'
import { red } from 'colorette'
import { Output } from './types'

// 修改文件名
export default async (oldPath: string, name: string, output: Output) => {
  try {
    const { dir, ext } = parse(oldPath)
    const newPath = resolve(dir, output.path + '', name + ext)
    if (dir !== resolve(dir, output.path + '')) {
      fse.copySync(oldPath, newPath)
    } else {
      fse.renameSync(oldPath, newPath)
    }
  } catch (err) {
    console.error(red('修改出错:' + oldPath), err)
  }
}
