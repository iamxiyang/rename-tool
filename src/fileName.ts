import { parse } from 'pathe'
import { getPinyin, md5File, sha256File } from './utils'
import { Output } from './types'

// 计算各个变量需要返回的新名字
const dirIndex: { [path: string]: number } = {}

export default async (path: string, output: Output) => {
  if (!path) return ''
  const { ext, name, dir } = parse(path)
  if (output.mapping && output.mapping[name]) {
    return output.mapping[name]
  }
  // 如果包含md5、sha1 等异步操作，提前计算，replace不支持await
  let md5 = ''
  if (output.filename.includes('{md5}')) {
    md5 = await md5File(path)
  }
  let sha256 = ''
  if (output.filename.includes('{sha256}')) {
    sha256 = await sha256File(path)
  }

  let _name = output.filename || name
  // if (_name.startsWith('{replace') && _name.endsWith('}')) {
  //   // 支持有限的简单字符替换，需要用引号包裹变量，如 "{replace name=a \"jjj = 有点意思 }"
  //   // TODO 暂不支持，后续通过命令行额外参数实现
  //   return dir
  // }
  _name = _name.replace(/({\S+?})/g, (match, p1) => {
    console.log(2, _name, match, p1)
    switch (p1) {
      case '{pinyin}':
        return getPinyin(name)
      case '{szm}':
        return getPinyin(name, { pattern: 'first' })
      // case '{english}':
      //   // TODO 后续考虑支持
      //   return name
      case '{ext}':
        return ext
      case '{md5}':
        return md5
      case '{sha256}':
        return sha256
      case '{index}':
        if (!dirIndex[dir]) {
          dirIndex[dir] = 1
        } else {
          dirIndex[dir]++
        }
        return dirIndex[dir] - 1
      case '{name}':
        // 原文件名，不带后缀
        return name
      case '{filename}':
        return name + ext
      // case '{year}':
      //   // TODO 是文件的年月日还是当前的年月日待定
      //   return name
      // case '{month}':
      //   return name
      // case '{day}':
      //   return name
      // case '{hour}':
      //   return name
      // case '{minute}':
      //   return name
      // case '{second}':
      //   return name
      // case '{timestamp}':
      //   return name
      default:
        return p1
    }
  })

  // 输出允许配置变量 {pinyin} {szm}(首字母) {english} {md5} {sha1} {index}(当前目录序号) {name}(原文件名，用于追加内容) {ext}(后缀)  {filename}(源文件名，带后缀) {year}{month}{day}{hour}{minute}{second} {timestamp} {replace('a','b')}  {aindex} {Aindex}
  return _name
}
