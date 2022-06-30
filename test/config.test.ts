import { describe, expect, it } from 'vitest'
import getConfig from '../src/config'

describe('config', () => {
  it.todo('传入基本配置', async () => {
    expect(
      getConfig({
        input: {
          glob: '**',
        },
        output: {
          filename: '{pinyin}',
        },
      })
    ).toEqual({})
  })
  it.todo('传入配置项', async () => {
    expect(
      getConfig({
        input: {
          glob: '**',
        },
        output: {
          filename: '{pinyin}',
        },
        config: true,
      })
    ).toEqual({})
  })
})
