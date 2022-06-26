import fs from 'fs'
import { parse } from 'pathe'
import { red } from 'colorette'

// 修改文件名
export default async (path: string, name: string) => {
  const { dir, ext } = parse(path)
  fs.rename(path, `${dir}/${name}${ext}`, (err) => {
    if (err) {
      console.error(red(path + '修改出错'), err)
      return
    }
  })
}
