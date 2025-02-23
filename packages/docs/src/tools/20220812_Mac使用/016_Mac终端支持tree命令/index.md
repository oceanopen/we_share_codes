# Mac 终端支持 tree 命令

## 1. tree 介绍

`tree` is a recursive directory listing command that produces a depth indented listing of files.

## 2. Installation

To install the latest version, use homebrew:

```bash
brew install tree
```

## 3. Usage

Running `tree` will produce output like this:

```
.
├── Apps
│   ├── Octave.md
│   ├── README.md
│   ├── Settings.md
│   ├── araxis-merge.jpg
│   ├── beyond-compare.png
│   ├── delta-walker.jpg
│   ├── filemerge.png
│   └── kaleidoscope.png
├── CONTRIBUTING.md
├── Cpp
│   └── README.md
├── Docker
│   └── README.md
├── Git
│   ├── README.md
│   └── gitignore.md
└── Go
    └── README.md

5 directories, 14 files

```

To limit the recursion you can pass an `-L` flag and specify the maximum depth `tree` will use when searching.

```bash
tree -L 1
```

will output:

```
.
├── Apps
├── CONTRIBUTING.md
├── Cpp
├── Docker
├── Git
└── Go

5 directories, 1 files

```

## 4. 参考

- [macOS Setup Guide](https://www.bookstack.cn/read/mac-setup/iTerm-tree.md)
