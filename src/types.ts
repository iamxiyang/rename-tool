import FastGlob from 'fast-glob'

export interface Input {
  glob: string
  'fast-glob'?: FastGlob.Options
}

export interface Output {
  path?: string
  filename: string
  mapping?: {
    [key: string]: string
  }
}

export interface Config {
  input: Input
  output: Output
}

export interface Options extends Config {
  config?: string | boolean
}
