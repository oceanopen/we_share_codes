# Mac Github using SSH over the HTTPS port

## 1. 背景

现有 `~/.ssh/config` 的 `Github` 配置:

```ini
# ...

# github
Host github.com
Hostname github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_github

# ...
```

没有代理的话，会比较慢，所以加上代理配置如下:

```ini
# github
# ...
ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
```

那么就可以使用 `git clone git@github.com:element-plus/element-plus.git` 的方式 `clone` 到本地。

如果增加代理后，`git clone`、`git pull` 等命令还是会出现执行超时的情况，那么就需要通过 `Using SSH over the HTTPS port` 的方式。

[官网文档](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls)如下:

> If you'd rather use SSH but cannot connect over port 22, you might be able to use SSH over the HTTPS port. For more information, see [Using SSH over the HTTPS port](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port).

## 2. Test if SSH over the HTTPS port is possible

[To test if SSH over the HTTPS port is possible](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port), run this SSH command:

```bash
ssh -T -p 443 git@ssh.github.com
# Hi USERNAME! You've successfully authenticated, but GitHub does not
# provide shell access.
```

端口 `443` 的主机名是 `ssh.github.com`，而不是 `github.com`。

If that worked, then skip this step. if not, will this:

```bash
ssh -T -p 443 git@ssh.github.com
# git@ssh.github.com: Permission denied (publickey).

# 或者
ssh -T git@ssh.github.com
# git@ssh.github.com: Permission denied (publickey).
```

then continue [Error: Permission denied (publickey)](https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey).

Check that you are connecting to the correct server:

```bash
ssh -vT git@github.com
# > OpenSSH_8.1p1, LibreSSL 2.7.3
# > debug1: Reading configuration data /Users/YOU/.ssh/config
# > debug1: Reading configuration data /etc/ssh/ssh_config
# > debug1: /etc/ssh/ssh_config line 47: Applying options for *
# > debug1: Connecting to github.com port 22.
```

可以看到默认是 `22` 端口。

You should verify your connection by typing:

```bash
ssh -T git@github.com
# git@github.com: Permission denied (publickey).
```

## 3. Make sure you have a key that is being used

[Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/[username]/.ssh/id_ed25519): /Users/[username]/.ssh/id_ed25519_github_ssh
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/[username]/.ssh/id_ed25519_github_ssh
Your public key has been saved in /Users/[username]/.ssh/id_ed25519_github_ssh.pub
The key fingerprint is:
SHA256:9fPZqbKVnzvnPNTog7qcvpKg5xiu/0Y0ATUKXGhakjI your_email@example.com
The key's randomart image is:
+--[ED25519 256]--+
| o.oooo          |
|E =. ...         |
|.*  .  .  .      |
|.     o  . .     |
|     . .S   o  ..|
|      o      oo+o|
|    .o . .   =+..|
|   ..oo o. oo =+o|
|  .o+=o  oB=o. *B|
+----[SHA256]-----+
```

执行后，查看验证:

```bash
cd ~/.ssh && ll | grep github_ssh
# -rw-------  1 [username]  staff   411B 12 31 17:10 id_ed25519_github_ssh
# -rw-r--r--  1 [username]  staff    99B 12 31 17:10 id_ed25519_github_ssh.pub
```

## 4. Adding your SSH key to the ssh-agent

Start the ssh-agent in the background:

```bash
eval "$(ssh-agent -s)"
# Agent pid 59566

ssh-add ~/.ssh/id_ed25519_github_ssh -l -E sha256
# 256 SHA256:9fPZqbKVnzvnPNTog7qcvpKg5xiu/0Y0ATUKXGhakjI your_email@example.com (ED25519)
```

You can also check that the key is being used by trying to connect to `git@github.com`:

```bash
ssh -vT git@github.com
# OpenSSH_9.4p1, LibreSSL 3.3.6
# debug1: Reading configuration data /Users/[username]/.ssh/config
# debug1: /Users/[username]/.ssh/config line 21: Applying options for github.com
# debug1: Reading configuration data /etc/ssh/ssh_config
# debug1: /etc/ssh/ssh_config line 21: include /etc/ssh/ssh_config.d/* matched no files
# debug1: identity file /Users/[username]/.ssh/id_ed25519_github_ssh type 3
# debug1: identity file /Users/[username]/.ssh/id_ed25519_github_ssh-cert type -1
# debug1: Local version string SSH-2.0-OpenSSH_9.4
# debug1: Remote protocol version 2.0, remote software version 159e461a3
# ...
# debug1: Authentications that can continue: publickey
# debug1: Next authentication method: publickey
# debug1: Offering public key: /Users/[username]/.ssh/id_ed25519_github_ssh ED25519 SHA256:9fPZqbKVnzvnPNTog7qcvpKg5xiu/0Y0ATUKXGhakjI explicit agent
# debug1: Server accepts key: /Users/[username]/.ssh/id_ed25519_github_ssh ED25519 SHA256:9fPZqbKVnzvnPNTog7qcvpKg5xiu/0Y0ATUKXGhakjI explicit agent
# Authenticated to ssh.github.com (via proxy) using "publickey".
# ...
```

In this example, SSH did find any keys.

- `-1` at the end of the `identity file` lines means SSH couldn't find a file to use.
- `Trying private key` lines indicate that no file was found.

配置 SSH:

```bash
touch ~/.ssh/config
```

配置内容为:

```bash
# github
Host github.com
AddKeysToAgent yes
UseKeychain yes
IdentityFile ~/.ssh/id_ed25519_github_ssh
```

You should verify your connection by typing:

```bash
ssh -T git@github.com
# Hi [github-username]! You've successfully authenticated, but GitHub does not provide shell access.
```

## 5. Adding a new SSH key to your GitHub account

- Copy the SSH public key to your clipboard.

  ```bash
  pbcopy < ~/.ssh/id_ed25519_github_ssh.pub
  # Copies the contents of the id_ed25519_github_ssh.pub file to your clipboard
  ```

  或者手动复制:

  ```bash
  cat ~/.ssh/id_ed25519_github_ssh.pub
  ```

- In the upper-right corner of any page on GitHub, click your profile photo, then click Settings.
- In the "Access" section of the sidebar, click SSH and GPG keys.
- Click New SSH key or Add SSH key.
- In the "Key" field, paste your public key.
- Click Add SSH key.

关联后，效果为:

![](./images/Adding_SSH_key_to_GitHub_account.png)

其中，`SHA256:9fPZqbKVnzvnPNTog7qcvpKg5xiu/0Y0ATUKXGhakjI` 需要和 `ssh-add -l -E sha256` 执行结果一致。

## 6. 配置 SSH

完整的配置如下:

```ini
# github
Hostname ssh.github.com
Port 443
User git
AddKeysToAgent yes
UseKeychain yes
IdentityFile ~/.ssh/id_ed25519_github_ssh
ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
```

正常预期，验证结果如下:

```bash
ssh -T -p 443 git@ssh.github.com
# Hi [github-username]! You've successfully authenticated, but GitHub does not provide shell access.

ssh -T git@ssh.github.com
# Hi [github-username]! You've successfully authenticated, but GitHub does not provide shell access.

ssh -T  git@github.com
# Hi [github-username]! You've successfully authenticated, but GitHub does not provide shell access.
```

## 7. 相关链接

- [Cloning with HTTPS URLs](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls)
- [Using SSH over the HTTPS port](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)
- [Error: Permission denied (publickey)](https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey)
- [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
- [Github Account SSH keys](https://github.com/settings/keys)
