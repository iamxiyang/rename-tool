# rename-tool

批量重命名工具，用来基于特定规则批量对文件进行重命名。

## 特点

- 可以通过配置文件简化常用操作
- 无法通过规则处理时可以名称映射
- 提供md5、拼音、时间等诸多变量
- 可使用过滤器对变量结果再次处理
- 可选择保存到其他目录而不是替换

## 安装

```shell
# npm
npm i rename-tool -g
# yarn 
yarn add rename-tool global
# pnpm
pnpm install rename-tool -g
```

## 使用

### 基础用法

提供了两个方法，rename 或 rename-tool ，作用是完全一样的，以下使用 renmae 举例。

```shell
rename [可选的输入配置]  [可选的输出配置]  [--config可选的使用配置文件]
```

**举例说明：**
<!-- TODO 例子测试 -->
```shell
rename    
```

没有传递任何配置，会启用交互时操作，只适用于简单场景

```shell
rename "{pinyin}"
```

只传递一个配置，会当做输出配置。`{pinyin}` 是内置的变量，表示源文件名的汉语拼音，具体可参照下面的”变量“环节。这个例子表示把当前目录下的文件名都修改成对应的汉语拼音。

```shell
rename "./*.png"  "{pinyin}"    
```

当传递两个信息时，第一个会被当做输入配置，用于过滤文件，过滤写法可参照"过滤文件"环节。第二个会被当做输出配置。这个例子表示只修改当前目录下的.png文件，把文件名修改成对应的汉语拼音

```shell
rename "!./*.png"  "{pinyin}"
```

只修改当前目录下除了.png以外的文件，把文件名修改成对应的汉语拼音，前面带英文感叹号 `!` 表示除此之外，过滤写法可参照"过滤文件"环节。

```shell
rename --config   
```

根据配置文件的配置进行修改，默认配置文件是当前路径下的`rename.config.json`，配置项提供的写法可参照”配置项“环节。  

```shell
rename --config="a.json" 
```

根据配置文件的配置进行修改，指定配置项文件是当前路径下的 a.json ，配置项提供的写法可参照”配置项“环节。  

```shell
rename "{pinyin}" --config 
```

根据配置文件的配置进行修改，除了输出的文件名，因为在命名行中传递了输入输出，优先级更高，输入配置会覆盖配置文件中的 input.glob 、输出配置会覆盖 output.filename 。

### 过滤文件

本项目使用 `fast-glob` 来查询和过滤文件，通过命令行使用时匹配模式只支持string，通过配置文件使用时能够传递string[]。下面介绍一些常见的用法，更多用法可参照 [fast-glob 的文档](https://www.npmjs.com/package/fast-glob)。

#### 基本语法

- (*）- 匹配除斜线（路径分隔符）、隐藏文件（名称以.开头）之外的所有文件。
- (**) - 匹配零个或多个目录。
- (?) - 匹配除斜线（路径分隔符）以外的任何单个字符。
- ([seq]）- 匹配序列中的任何字符。

#### 操作例子

只查询特定目录

```shell
"**"  #当前目录下的所有文件（任何嵌套级别），这也是默认配置
"*"  #当前目录下的所有文件
"src/*" #只查询src目录下的所有文件
"src/**" #只查询src目录的所有文件（任何嵌套级别）
"(src|bin)/**" #查询src和bin目录中的所有文件（任何嵌套级别）
"!(src|bin)/**" #查询除了src和bin中其他目录下的所有文件（任何嵌套级别）
"s*/*" #查询所有以s开头的子目录下的所有文件
"*s*/**|\!./node_modules/**" #所有名称中带s的文件和目录下的文件，除了node_modules目录中的文件
```

基于特定后缀

```shell
"*.png"    #png后缀
"*.jpg"    #png后缀
"*.{png,jpg}" #png和jpg后缀
```

基于特定前缀

```shell
"a*"   #a开头的文件
"{b,p}*" #b开头或p开头的文件
"**/{b,p}*" #b开头或p开头的文件（任何嵌套级别）
```

排除特定文件

```shell
请通过配置项实现，可阅读『配置项』说明。
```

### 可用变量

```{i}```
文件所在目录的修改序号，默认1开始，可以通过|传递起始数字。如{i|100}表示起始值从100开始。

```{pinyin}```
文件原名称的汉语拼音。

```{szm}```
文件原名称的汉语拼音首字母。

```{name}```
文件原名称。

```{ext}```
文件后缀格式，可能为空。

```{filename}```
等同于 `{name}.{ext}`

```{md5}```
文件的md5值。

```{sha256}```
文件的sha256值。

```{date}```
当前时间，默认是YYYY-MM-DD，可以通过过滤器传递时间格式，如`{date|formate('YYYY')}`表示只要年份，传递的时间格式会基于dayjs格式化。

### 过滤器

过滤器是对变量的一个补充，需要配合变量使用，能把变量的结果进行再次处理，通过竖线`|`分割过滤器，如 `{date|formate('yyyy-mm-dd')}` 、 `{name|replace(a,b)}` ，括号内是传递给过滤器的传参，通过英文逗号分割，过滤器传递的内容引号可要可不要。

```formate('yyyy-mm-dd')```
格式化时间，配合date变量使用，把当前时间格式化为特定格式的，基于dayjs。

```replace(a,b)```
对变量内容进行替换，会把所有a替换为b，内部使用的是replaceAll这个方法。

```padStart(10,0)```
对变量内容的长度进行填充，如果内容长度小于10，在前面填充0，基于String.padStart。

```padEnd(10,.)```
对变量内容的长度进行填充，如果内容长度小于10，在后面填充`.`，基于String.padEnd。

### 配置项

```json
{
  // 配置文件是json格式，使用时请删除注释
  // 输入配置
  "input": {
     // 匹配规则，支持fast-glob复杂的string[]格式参数；
    //  通过命令行传递两个参数时第一个参数会覆盖这里的值。
    "glob": "**",
    // 传递给fast-glob的配置项，默认情况下不需要使用。
    // 这里不能传递 onlyFiles,absolute,caseSensitiveMatch,unique,objectMode 这些参数，因为程序依赖这些参数来做数据处理。
    // fast-glob文档：https://www.npmjs.com/package/fast-glob#pattern-syntax
    "fast-glob": {
      // 忽略名单
      "ignore": [".git/**", "node_modules/**"]
    }
  },
  // 输出配置
  "output": {
    // 结果保存路径，默认是在当前目录直接重命名，需要时可以修改这里保存到其他目录
    // 如改成 ../rename/ 就是保存到同级别的 rename 目录
    "path": "./",
    // 输出的文件名，通过命令行传递的配置会覆盖这里的值，能使用各种变量
    "filename": "{pinyin}",
    // 映射关系，这里的优先级最高，如果匹配到这里有对应关系，会忽略输出文件名的变量。
    "mapping": {
        // 举例说明，会把文件名是『素材_地球』的直接改成 earth
        "素材_地球" : "earth",
        // 举例说明，会把文件名是『首页banner』的直接改成 index_banner2
        "首页banner" : "index_banner2"
    }
  }
}
```

### 常见问题

#### 1、为什么有些文件没有被重命名？

程序对某些文件做了过滤，符合以下规则的不会被重命名。

- 所有 .config.ts 、.config.js 、config.json 、.config.json 结尾的文件。
- node_modules 文件夹、package.json、pnpm-lock.yaml 等前端开发常见配置文件。
- 如果你选择了启用配置项，你指定的配置文件也不会被重命名（该规则必须存在）。
- 如果你想取消这个规则，请通过自定义配置项的方式，填写 ignore 参数来覆盖默认参数。

## 参与贡献

非常欢迎你的加入！[提一个 Issue](https://github.com/iamxiyang/rename-tool/issues/) 或者提交一个 Pull Request。

**Pull Request:**

1. Fork 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交`pull request`

**Git 贡献提交规范:**

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))  
  - `feat` 增加新功能  
  - `fix` 修复问题/BUG  
  - `style` 代码风格相关无影响运行结果的  
  - `perf` 优化/性能提升  
  - `refactor` 重构  
  - `revert` 撤销修改  
  - `test` 测试相关  
  - `docs` 文档/注释  
  - `chore` 依赖更新/脚手架配置修改等  
  - `workflow` 工作流改进
  - `ci` 持续集成  
  - `types` 类型定义文件更改  
  - `wip` 开发中  

## 打赏作者

如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励 🍹。

![打赏](https://test-1309419893.cos.ap-shanghai.myqcloud.com/%E6%89%93%E8%B5%8F.jpg)
