import { Command } from 'commander'
import updateNotifier from 'update-notifier'
import { cyan } from 'colorette'
import pkg from '../package.json'
import inquirer from 'inquirer'
import open from 'open'

const program = new Command()

export default async () => {
  updateNotifier({ pkg }).notify()

  program
    .name('rename-tool or rename')
    .usage('<input> <output>')
    .version(pkg.version)

  program.on('--help', () => {
    console.log('')
    console.log(cyan('简单操作:'))
    console.log(`${cyan('$ ')}rename`)
    console.log(cyan('指定输出配置:'))
    console.log(`${cyan('$ ')}rename [pinyin]`)
    console.log(cyan('指定输入输出配置:'))
    console.log(`${cyan('$ ')}rename ./**.png [pinyin]`)
    console.log(cyan('通过配置文件操作:'))
    console.log(`${cyan('$ ')}rename --config`)
    console.log(cyan('指定配置文件路径:'))
    console.log(`${cyan('$ ')}rename --config ./renameconfig.json`)
    console.log('')
    console.log(cyan('首次使用推荐查看文档:'))
    console.log(`https://github.com/iamxiyang/rename-tool#readme`)
    console.log('')
  })

  program.option('-c, --config [path]', 'config file path')

  program.parse(process.argv)

  const options = program.opts()

  const input = {
    glob: '**',
    'fast-glob': {},
  }
  const output = {
    path: './',
    filename: '{pinyin}',
    mapping: {},
  }

  if (program.args.length === 0) {
    // 交互式选择
    const question = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'ask-rule',
        message: '选择操作：',
        pageSize: 20,
        choices: [
          '当前目录下文件名改成拼音',
          '当前目录下文件名改成首字母',
          '打开帮助文档【第一次使用建议看下】',
        ],
      },
    ])
    if (question['ask-rule'] === '当前目录下文件名改成拼音') {
      input.glob = '**'
      output.filename = '{pinyin}'
    } else if (question['ask-rule'] === '当前目录下文件名改成首字母') {
      input.glob = '**'
      output.filename = '{szm}'
    } else if (question['ask-rule'] === '打开帮助文档【第一次使用建议看下】') {
      console.log(cyan('正在打开'), pkg.homepage)
      console.log('看完文档可根据需要重新执行命令')
      await open(pkg.homepage)
      process.exit(1)
    }
  } else if (program.args.length === 1) {
    output['filename'] = program.args[0]
  } else if (program.args.length >= 2) {
    input['glob'] = program.args[0]
    output['filename'] = program.args[1]
  }
  return { input, output, config: options.config }
}
