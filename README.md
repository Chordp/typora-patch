# typora Cracker

一个typora的解包&解密，打包&加密工具

## 敬告

**请注意：** typoraCracker不会提供破解相关支持，包括但不限于思路、流程、成品。

```
仅供学习和讨论，请不要从事任何非法行为。
由此产生的任何问题都将由用户（您）承担。
```

## Features

- 支持版本1.0.0以上(至少现在是这样)
- 测试通过平台：Win/Ubuntu

## 食用方式

1. `pip install -r requirements.txt`
2. `python typora.py --help`
3. 阅读帮助文档及使用。
4. 做你想做的事。
5. 打包并替换原目录下的 app.asar。 
6. 享受成果。


## 示例

```shell
> python typora.py --help
usage: typora.py [-h] [-u] [-f] asarPath dirPath

[extract and decryption / pack and encryption] app.asar file from [Typora].

positional arguments:
  asarPath    app.asar file path/dir [input/ouput]
  dirPath     as tmp and out directory.

optional arguments:
  -h, --help  show this help message and exit
  -u          pack & encryption (default: extract & decryption)
  -f          enabled prettify/compress (default: disabled)

If you have any questions, please contact [ MasonShi@88.com ]

> python typora.py {installRoot}/Typora/resources/app.asar workstation/outfile/
⋯
# (patch code by yourself in workstation/outfile/dec_app)
> python typora.py -u workstation/outfile/dec_app workstation/outappasar
⋯
> cp {installRoot}/Typora/resources/app.asar {installRoot}/Typora/resources/app.asar.bak
> mv workstation/outappasar/app.asar {installRoot}/Typora/resources/app.asar
> node example/keygen.js
XXXXXX-XXXXXX-XXXXXX-XXXXXX
> typora
# (input info)
email: crack@example.com
serial: XXXXXX-XXXXXX-XXXXXX-XXXXXX
```

## LICENSE
 MIT LICENSE
