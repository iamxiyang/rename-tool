import command from './command'
import getConfig from './config'
import findFiles from './findFiles'
import getFileName from './fileName'
import replaceFileName from './replaceName'

const rename = async () => {
  const options = await command()

  const useConfig = getConfig(options)

  // 调用find查找所有文件
  const files = await findFiles(useConfig.input, useConfig.config)

  // 循环修改 files
  for (const file of files) {
    // 获取文件名
    const newName = await getFileName(file, useConfig.output)
    if (newName) {
      // 修改文件名
      await replaceFileName(file, newName)
    }
  }
  console.log('全部修改完成')
}

export default rename
