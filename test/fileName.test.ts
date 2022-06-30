import { describe, expect, it } from 'vitest'
import getFileName from '../src/fileName'

describe('fileName', () => {
  it('拼音{pinyin}', async () => {
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{pinyin}',
        mapping: {},
        path: './',
      })
    ).toEqual('hahaha')
    expect(
      await getFileName('有意思yy.png', {
        filename: '{pinyin|replace(yy,heihei)}',
        mapping: {},
        path: './',
      })
    ).toEqual('youyisiheihei')
  })
  //
  it('首字母{szm}', async () => {
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{szm}',
        mapping: {},
        path: './',
      })
    ).toEqual('hhh')
    expect(
      await getFileName('2123火锅.png', {
        filename: '{szm}',
        mapping: {},
        path: './',
      })
    ).toEqual('2123hg')
  })
  it('序号{i}', async () => {
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{i|100}',
        mapping: {},
        path: './',
      })
    ).toEqual('100')
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{i}',
        mapping: {},
        path: './',
      })
    ).toEqual('101')
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{i}hh',
        mapping: {},
        path: './',
      })
    ).toEqual('102hh')
  })
  it('{md5}', async () => {
    expect(
      await getFileName('./LICENSE', {
        filename: '{md5}',
        mapping: {},
        path: './',
      })
    ).toEqual('cd7691c2b109c9c7881df14eaea3d66a')
  })
  it('{sha256}', async () => {
    expect(
      await getFileName('./LICENSE', {
        filename: '{sha256}',
        mapping: {},
        path: './',
      })
    ).toEqual(
      '924fef5cf9b74bb8c16feb3a9f5a72e7e61332fa5baf9b55a12d688a436eb6f9'
    )
  })
  it('{name}', async () => {
    expect(
      await getFileName('你好.png', {
        filename: '{name}',
        mapping: {},
        path: './',
      })
    ).toEqual('你好')
    expect(
      await getFileName('你好.png', {
        filename: '{name}test',
        mapping: {},
        path: './',
      })
    ).toEqual('你好test')
    expect(
      await getFileName('你好.png', {
        filename: '{name|replace(你,您)}',
        mapping: {},
        path: './',
      })
    ).toEqual('您好')
  })
  it('{ext}', async () => {
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{ext}',
        mapping: {},
        path: './',
      })
    ).toEqual('.png')
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{ext}格式',
        mapping: {},
        path: './',
      })
    ).toEqual('.png格式')
  })
  it('{filename}', async () => {
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{filename}',
        mapping: {},
        path: './',
      })
    ).toEqual('哈哈哈.png')
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{filename}-test',
        mapping: {},
        path: './',
      })
    ).toEqual('哈哈哈.png-test')
  })
  it('混用', async () => {
    expect(
      await getFileName('哈哈哈.png', {
        filename: '{szm}-{pinyin}',
        mapping: {},
        path: './',
      })
    ).toEqual('hhh-hahaha')
  })
})
