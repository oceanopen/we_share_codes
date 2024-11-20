# Mac 确定架构类型

确定 `Mac\Linux` 系统的架构类型是 `x86-64（amd64）`，还是 `arm64` 架构。

## 1. 使用 uname 命令

打开终端，并运行以下命令:

```bash
uname -m
```

- 在 `MAC` 中:
  如果输出结果是 `x86_64`, 则表示你的系统是 `x86-64` 架构。
  如果输出结果是 `arm64`, 则表示你的系统是 `arm64` 架构。

- 在 `Linux` 中:
  如果输出结果是 `x86_64`, 则表示你的系统是 `x86-64` 架构。
  如果输出结果是 `arch64`, 则表示你的系统是 `arm64` 架构。

## 2. 使用 arch 命令

在终端中运行以下命令:

```bash
arch
```

- 在 `MAC` 中:
  如果输出结果是 `x86_64`，则表示你的系统是 `x86-64` 架构。
  如果输出结果是 `arm64`，则表示你的系统是 `arm64` 架构。

- 在 `Linux` 中:
  如果输出结果是 `x86_64`，则表示你的系统是 `x86-64` 架构。
  如果输出结果是 `arch64`，则表示你的系统是 `arm64` 架构。

## 3. 查看系统信息

在终端中运行以下命令:

- 在 `MAC` 中:

```bash
system_profiler SPHardwareDataType
```

如果输出包含 `Processor Name: Apple M{X}” 或者 “Chip: Apple M{X}` , 表示你的系统是 `arm64` 架构。
如果输出包含 `Processor Name: Intel Core” 或者 “Chip: Intel Core` , 表示你的系统是 `x86-64` 架构。

- 在 `Linux` 中:

```bash
lscpu | grep "Architecture"
```

如果输出结果是 `Architecture: x86_64`, 则表示你的系统是 `x86-64` 架构。
如果输出结果是 `Architecture: aarch64`, 则表示你的系统是 `arm64` 架构。

## 4. 实际运行

`Apple M2` 芯片运行结果为:

```bash
uname -m
# arm64

arch
# arm64

system_profiler SPHardwareDataType
# Hardware:

#     Hardware Overview:

#       Model Name: MacBook Air
#       Model Identifier: Mac14,2
#       Model Number: Z15W0003CCH/A
#       Chip: Apple M2
#       Total Number of Cores: 8 (4 performance and 4 efficiency)
#       Memory: 16 GB
#       System Firmware Version: 10151.61.4
#       OS Loader Version: 10151.61.4
#       Serial Number (system): QKXR4PXCP9
#       Hardware UUID: 110BAD97-56D1-5916-A579-8353585E50A2
#       Provisioning UDID: 00008112-001E45913CC1A01E
#       Activation Lock Status: Enabled
```
