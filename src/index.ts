import command from './command'
import getConfig from './config'
import findFiles from './findFiles'
import getFileName from './fileName'
import replaceFileName from './replaceName'
import inquirer from 'inquirer'
import { gray, red, white } from 'colorette'
import { parse } from 'pathe'

const rename = async () => {
  const { inputGlob = '', outputName = '', config } = await command()

  const useConfig = getConfig(inputGlob, outputName, config)

  // 调用find查找所有文件
  const files = await findFiles(useConfig.input, useConfig.configPath)

  if (files.length === 0) {
    console.log(red('没有找到需要修改的文件'))
    return
  }

  // 循环 files 获取新的文件名
  const filesNameMap = new Map()
  for (const file of files) {
    const newName = await getFileName(file, useConfig.output)
    if (newName) {
      filesNameMap.set(file, newName)
    }
  }

  console.log(
    `* 预计需要替换 ${filesNameMap.size} 个文件，为避免出现错误，请预览修改效果，确认后继续`
  )
  console.log(`原始路径 ---> 新路径`)
  for (const [oldPath, newPath] of [...filesNameMap].splice(0, 5)) {
    const { dir, ext } = parse(oldPath)
    console.log(
      `${gray(oldPath.replace(dir, ''))} ---> ${white(`/${newPath}${ext}`)}`
    )
  }

  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'ask-confirm',
      message: `是否确认替换 ？`,
    },
  ])
  if (!confirm['ask-confirm']) {
    console.log('取消操作')
    return
  }

  for (const [oldPath, newPath] of filesNameMap) {
    await replaceFileName(oldPath, newPath, useConfig.output)
  }
  console.log('全部修改完成')
}

export default rename
