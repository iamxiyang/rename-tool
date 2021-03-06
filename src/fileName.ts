import { parse } from 'pathe'
import { getPinyin, md5File, sha256File } from './utils'
import { Output } from './types'
import dayjs from 'dayjs'

// 记录目录的序号
const dirI: { [path: string]: number } = {}

const removeMarks = (str: string): string => {
  if (['"', '`', "'"].includes(str[0]) && str[0] === str[str.length - 1]) {
    return str.slice(1, -1)
  }
  return str
}

const filter = (name: string, action: string[]): string => {
  let str = name
  action.forEach((item) => {
    const args = /\((\S+?)\)/.exec(item)?.[1]?.split(',')
    if (item.startsWith('replace') && args && args?.length >= 2) {
      // {name|replace(1,2)} 把1替换成2
      str = str.replaceAll(removeMarks(args[0]), removeMarks(args[1]))
    } else if (item.startsWith('format') && args) {
      // {date|format(YYYY-MM-DD)} 把日期格式化成YYYY-MM-DD
      str = dayjs(str).format(removeMarks(args[0]))
    } else if (item.startsWith('padStart') && args) {
      // {i|padStart(3,0)} 如果位数不足2位，前面补充0
      str = str.padStart(Number(args[0]), removeMarks(args[1]))
    } else if (item.startsWith('padEnd') && args) {
      // {name|padEnd(10,0)} 如果位数不足10位，后面补充0
      str = str.padEnd(Number(args[0]), removeMarks(args[1]))
    }
  })
  return str
}

export default async (path: string, output: Output) => {
  if (!path) return ''
  const { ext, name, dir } = parse(path)
  if (output.mapping && output.mapping[name]) {
    return output.mapping[name]
  }
  // 如果包含md5、sha1 等异步操作，提前计算，replace 中不支持await
  let md5 = ''
  if (output.filename.includes('md5')) {
    md5 = await md5File(path)
  }
  let sha256 = ''
  if (output.filename.includes('sha256')) {
    sha256 = await sha256File(path)
  }

  let filename = output.filename || name
  filename = filename.replace(/{(\S+?)}/g, (match, p1) => {
    const actions = p1.split('|')
    const variable = actions.shift()
    let _str: string = p1
    switch (variable) {
      case 'pinyin':
        _str = getPinyin(name)
        break
      case 'szm':
        _str = getPinyin(name, { pattern: 'first' })
        break
      case 'md5':
        _str = md5
        break
      case 'sha256':
        _str = sha256
        break
      case 'i':
        if (typeof dirI[dir] === 'undefined') {
          // {i|起始值}
          const de = actions.shift()
          dirI[dir] = isNaN(Number(de)) ? 1 : Number(de) ?? 1
        } else {
          dirI[dir]++
        }
        _str = String(dirI[dir])
        break
      case 'name':
        _str = name
        break
      case 'ext':
        _str = ext
        break
      case 'filename':
        _str = name + ext
        break
      case 'date':
        if (!actions.length) {
          _str = dayjs().format('YYYY-MM-DD')
        } else {
          _str = new Date().toISOString()
        }
        break
    }

    if (actions.length) {
      _str = filter(_str, actions)
    }
    return _str
  })

  return filename
}
