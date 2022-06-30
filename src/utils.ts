import fs from 'fs'
import fes from 'fs-extra'
import crypto from 'crypto'
import { pinyin } from 'pinyin-pro'

export const md5File = (file: string): Promise<string> => {
  return new Promise((resolve) => {
    const md5sum = crypto.createHash('md5')
    const stream = fs.createReadStream(file)
    stream.on('data', (chunk) => md5sum.update(chunk))
    stream.on('end', () => resolve(md5sum.digest('hex').toLowerCase()))
  })
}

export const sha256File = (file: string): Promise<string> => {
  return new Promise((resolve) => {
    const md5sum = crypto.createHash('sha256')
    const stream = fes.createReadStream(file)
    stream.on('data', (chunk) => md5sum.update(chunk))
    stream.on('end', () => resolve(md5sum.digest('hex').toLowerCase()))
  })
}

export const getPinyin = (
  name: string,
  options: { [key: string]: string | number | boolean } = {}
) => {
  return pinyin(name, {
    toneType: 'none',
    ...options,
  }).replace(/\s/g, '')
}
