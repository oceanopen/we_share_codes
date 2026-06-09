# Rust 开发环境安装

## 1. 安装 Rust 版本管理器 rustup

`rustup` 是 Rust 官方的版本管理工具，类似于 Node 生态中的 `nvm`，用于安装和管理 Rust 编译器（`rustc`）及工具链。

### 1.1 Mac / Linux 安装

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装过程中选择默认选项（`1`）即可。安装完成后，重新加载环境变量：

```bash
source "$HOME/.cargo/env"
```

### 1.2 Windows 安装

下载并运行 [rustup-init.exe](https://www.rust-lang.org/tools/install)，按提示完成安装。

### 1.3 验证安装

```bash
rustc --version
# rustc 1.87.0 (xxx)

cargo --version
# cargo 1.87.0 (xxx)

rustup --version
# rustup 1.28.2 (xxx)
```

### 1.4 rustup 常用命令

```bash
# 安装最新稳定版工具链
rustup install stable

# 安装特定版本
rustup install 1.87.0

# 切换默认工具链
rustup default stable

# 更新到最新版本
rustup update

# 查看已安装的工具链
rustup toolchain list

# 卸载 Rust（含 rustup 和所有工具链）
rustup self uninstall
```

### 1.5 设置镜像源（国内加速）

在 `~/.bash_profile` 或 `~/.zshrc` 中添加：

```bash
export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
```

Cargo 镜像源，编辑 `~/.cargo/config.toml`：

```toml
[source.crates-io]
replace-with = "ustc"

[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"
```

保存后执行 `source ~/.bash_profile` 或 `source ~/.zshrc` 使配置生效。

### 1.6 离线安装

在有网络的机器上提前下载安装包，拷贝到离线环境安装。

**第一步：下载安装器和工具链包**

在联网机器上访问 [Rust 官方归档](https://forge.rust-lang.org/infra/other-installation-methods.html#standalone-installers)，下载对应平台的文件：

| 平台                | 安装器                                        | 工具链包                                         |
| ------------------- | --------------------------------------------- | ------------------------------------------------ |
| Mac (Apple Silicon) | `rustup-init-aarch64-apple-darwin`            | `rust-<version>-aarch64-apple-darwin.tar.gz`     |
| Mac (Intel)         | `rustup-init-x86_64-apple-darwin`             | `rust-<version>-x86_64-apple-darwin.tar.gz`      |
| Linux (x86_64)      | `rustup-init-x86_64-unknown-linux-gnu.tar.gz` | `rust-<version>-x86_64-unknown-linux-gnu.tar.gz` |
| Windows             | `rustup-init-x86_64-pc-windows-msvc.msi`      | `rust-<version>-x86_64-pc-windows-msvc.msi`      |

工具链包也可直接从 `https://static.rust-lang.org/dist/` 目录下载，例如：

```
https://static.rust-lang.org/dist/rust-1.87.0-aarch64-apple-darwin.tar.gz
```

**第二步：离线安装**

Mac / Linux：

```bash
# 赋予执行权限
chmod +x rustup-init-aarch64-apple-darwin

# 运行安装器（跳过自动下载工具链）
./rustup-init-aarch64-apple-darwin --default-toolchain none -y

# 解压工具链包并安装
tar -xzf rust-1.87.0-aarch64-apple-darwin.tar.gz
cd rust-1.87.0-aarch64-apple-darwin
./install.sh --prefix="$HOME/.rustup/toolchains/1.87.0"

# 设置默认工具链
rustup default 1.87.0
```

Windows：直接双击 `.msi` 安装器按提示完成即可。

**离线安装 Cargo 依赖（crate 包）**

在联网机器上提前下载依赖，拷贝到离线环境：

```bash
# 联网环境下，在项目目录执行
cargo vendor

# 将生成的 vendor/ 目录和 .cargo/config.toml 一起拷贝到离线机器
# 离线机器上构建时 cargo 会从本地 vendor/ 目录读取依赖
cargo build --offline
```

## 2. Rust 工具链 vs Node 生态工具对照表

| Rust 工具       | 说明                             | Node 生态对应                          | 说明            |
| --------------- | -------------------------------- | -------------------------------------- | --------------- |
| `rustup`        | Rust 版本管理器，安装/切换工具链 | `nvm`                                  | Node 版本管理器 |
| `rustc`         | Rust 编译器                      | `node`                                 | Node.js 运行时  |
| `cargo`         | 包管理器 + 构建工具 + 任务运行器 | `pnpm` / `npm`                         | 包管理器        |
| `Cargo.toml`    | 项目配置文件（依赖、元信息）     | `package.json`                         | 项目配置文件    |
| `Cargo.lock`    | 锁定依赖版本                     | `pnpm-lock.yaml` / `package-lock.json` | 锁文件          |
| `crates.io`     | 包注册中心                       | `npmjs.com`                            | 包注册中心      |
| `cargo install` | 全局安装二进制工具               | `npm install -g` / `pnpm add -g`       | 全局安装        |
| `cargo add`     | 添加项目依赖                     | `pnpm add` / `npm install`             | 添加依赖        |
| `cargo build`   | 编译项目                         | `npm run build`                        | 构建项目        |
| `cargo run`     | 编译并运行项目                   | `npm run dev` / `node index.js`        | 运行项目        |
| `cargo test`    | 运行测试                         | `npm test`                             | 运行测试        |
| `cargo fmt`     | 代码格式化                       | `eslint --fix` / `prettier`            | 代码格式化      |
| `cargo clippy`  | 代码 lint 检查                   | `eslint`                               | 代码检查        |
| `cargo doc`     | 生成文档                         | `jsdoc` / `typedoc`                    | 生成文档        |
| `cargo publish` | 发布包到 crates.io               | `npm publish`                          | 发布包到 npm    |
| `rust-analyzer` | IDE 语言服务（LSP）              | `typescript-language-server`           | IDE 语言服务    |

### 补充说明

- `cargo` 是一个**一体化工具**，集成了 Node 生态中 `npm`、`webpack`/`vite`、`eslint`、`prettier` 等多个工具的职责。
- Rust 项目结构中，库（library）和二进制（binary）可以在同一个 `Cargo.toml` 中共存，无需像 Node 那样区分包的类型。
- `cargo` 的 `run` 命令会自动检测代码变更并增量编译，开发体验类似于 `nodemon`。

## 3. 创建第一个项目

```bash
# 创建新项目
cargo new hello-rust
cd hello-rust

# 项目结构
# hello-rust/
# ├── Cargo.toml      # 项目配置
# ├── src/
# │   └── main.rs     # 入口文件
# └── .gitignore

# 运行项目
cargo run
# Hello, world!

# 构建发布版本（优化编译）
cargo build --release
```

## 4. 官方参考文档

- [Rust 官网](https://www.rust-lang.org/)
- [Rust 安装指南](https://www.rust-lang.org/tools/install)
- [rustup 官方文档](https://rust-lang.github.io/rustup/)
- [The Rust Programming Language（官方教程）](https://doc.rust-lang.org/book/)
- [Rust by Example（示例学习）](https://doc.rust-lang.org/rust-by-example/)
- [Cargo 官方文档](https://doc.rust-lang.org/cargo/)
- [crates.io（包注册中心）](https://crates.io/)
- [Rust 标准库文档](https://doc.rust-lang.org/std/)
- [Rust 语言中文社区](https://rustcc.cn/)
