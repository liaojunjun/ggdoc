> 首先你会写点[markdown](https://www.markdownguide.org/cheat-sheet/)

安装：

```cmd
npm i ggdoc -g
```

创建目录文件，暂定`nav` , 当然可以是其他名称。

```cmd
touch nav
```

写入内容，写入你想要的目录结构，可以是中文哦

```txt
dir file.md
ui设计 设计总览.md 项目设计需求.md
 参考 书籍.md 站点.md
 配合 和前端配合.md
前端
 选型 选项.md
 模块 layoutModule.md
```

使用：

```cmd
ggdoc nav
```

你将会看到创建了`root`文件夹及子文件夹/文件和`doc.html`。

接下来，对`root/dir/file.md`进行编写。

编写完成后，再运行一次上面的命令，将覆盖`doc.html`文件。

用浏览器打开`doc.html`。这就是你的文档了。
