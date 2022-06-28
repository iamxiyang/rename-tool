# rename-tool

用来批量重命名的命令行工具，能够对当前目录下的文件基于特定规则进行重命名。

> 目前还是beta版本，还有部分功能仍处于开发中，仍可能有较大的变更，请使用时额外注意版本变化，如果你有什么建议也可以到 [Issues](https://github.com/iamxiyang/rename-tool/issues) 反馈。

## 安装

```shell
npm i -g rename-tool
```

## 用法

```shell
rename [输入配置] 输出配置 [-config]
```

或者只需要执行 `rename` 根据交互提示操作。

> 输入基于 fast-glob 进行匹配（仅支持第一个参数，字符串或数组），输出基于 fs。

示例：

修改当前目录下的文件为拼音

```shell
rename {pinyin}
```

修改当前目录下的 png 文件名称为拼音首字母

```shell
rename "./**.png" {szm}
```

修改当前目录下的 png 和jpg 文件名称，在原有名称前添加图片

```shell
rename "[./**.png,./**.jpg]" "图片{name}"
```

修改当前目录下的文件名称中的 你好 为 您好

```shell
rename "./**" "{name|replace('你好','您好')}"
```

> 约定 | 后面会被再做一次处理，目前只支持对变量进行替换，后续可能会支持驼峰、下划线等转换。

使用配置项进行重命名

```shell
rename --config
```

> 默认配置项是当前目录下的 renameconfig.json ，具体配置可以参考 src/config.ts ，主要是用来处理无规则的文件名，进行映射。

指定配置项的路径

```shell
rename --config ./renameconfig2.json
```

注意事项：默认.开头的不处理，文件夹名称不处理，配置文件 不处理（renameconfig.json 或传参指定的 ），node_modules 目录下的不处理
