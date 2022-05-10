# -*- coding:utf-8 -*-
"""
@Author: Mas0n
@File: typora.py
@Time: 2021-11-29 21:24
@Desc: It's all about getting better.
"""
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from base64 import b64decode, b64encode
from jsbeautifier import beautify
from jsmin import jsmin
from os import listdir, urandom, makedirs
from os.path import isfile, isdir, join as pjoin, split as psplit, exists, abspath
from loguru import logger as log
from masar import extract_asar, pack_asar
from shutil import rmtree
from argparse import ArgumentParser
import struct
import sys

# DEBUG
DEBUG = False

log.remove()
if DEBUG:
    log.add(sys.stderr, level="DEBUG")
else:
    log.add(sys.stderr, level="INFO")

AES_KEY = struct.pack("<4Q", *[0x2cf3148f3552b353 ,0xf06a051f31b90ed0 ,0x5dd4f2f7949fcf1f ,0x108b6cc5f4e2b2b1])
AES_IV = struct.pack("<2Q", *[0x5387fa1533706964 ,0x53f8240ed05f336d])


def _mkDir(_path):
    if not exists(_path):
        makedirs(_path)
    else:
        if _path == psplit(__file__)[0]:
            log.warning("plz try not to use the root dir.")
        else:
            log.warning(f"May FolderExists: {_path}")


def decScript(b64: bytes, prettify: bool):
    lCode = b64decode(b64)
    # iv: the first 16 bytes of the file

    # cipher text

    # AES 256 CBC
    ins = AES.new(key=AES_KEY, iv=AES_IV, mode=AES.MODE_CBC)
    code = unpad(ins.decrypt(lCode), 16, 'pkcs7')
    if prettify:
        code = beautify(code.decode()).encode()
    return code


def extractWdec(asarPath, path, prettify):
    """
    :param prettify: bool
    :param asarPath: asar out dir
    :param path: out dir
    :return: None
    """
    # try to create empty dir to save extract files
    path = pjoin(path, "typoraCrackerTemp")

    if exists(path):
        rmtree(path)
    _mkDir(path)

    log.info(f"extract asar file: {asarPath}")
    # extract app.asar to {path}/*
    extract_asar(asarPath, path)
    log.success(f"extract ended.")

    log.info(f"read Directory: {path}")
    # construct the save directory {pathRoot}/dec_app
    outPath = pjoin(psplit(path)[0], "dec_app")
    # try to create empty dir to save decryption files
    if exists(outPath):
        rmtree(outPath)
    _mkDir(outPath)

    log.info(f"set Directory: {outPath}")
    # enumerate extract files
    fileArr = listdir(path)
    for name in fileArr:
        # read files content
        fpath = pjoin(path, name)
        scode = open(fpath, "rb").read()
        log.info(f"open file: {name}")
        # if file suffix is *.js then decryption file
        if isfile(fpath) and name.endswith(".js"):
            scode = decScript(scode, prettify)
        else:
            log.debug(f"skip file: {name}")
        # save content {outPath}/{name}
        open(pjoin(outPath, name), "wb").write(scode)
        log.success(f"decrypt and save file: {name}")

    rmtree(path)
    log.debug("remove temp dir")


def encScript(_code: bytes, compress):
    if compress:
        _code = jsmin(_code.decode(), quote_chars="'\"`").encode()
    aesIv = AES_IV
    cipherText = _code
    ins = AES.new(key=AES_KEY, iv=aesIv, mode=AES.MODE_CBC)
    enc = ins.encrypt(pad(cipherText, 16, 'pkcs7'))
    lCode = b64encode(enc)
    return lCode


def packWenc(path, outPath, compress):
    """
    :param path: out dir
    :param outPath: pack path app.asar
    :param compress: Bool
    :return: None
    """
    # check out path
    if isfile(outPath):
        log.error("plz input Directory for app.asar")
        raise NotADirectoryError

    _mkDir(outPath)

    encFilePath = pjoin(psplit(outPath)[0], "typoraCrackerTemp")
    if exists(encFilePath):
        rmtree(encFilePath)
    _mkDir(encFilePath)

    outFilePath = pjoin(outPath, "app.asar")
    log.info(f"set outFilePath: {outFilePath}")
    fileArr = listdir(path)

    for name in fileArr:
        fpath = pjoin(path, name)
        if isdir(fpath):
            log.error("TODO: found folder")
            raise IsADirectoryError

        scode = open(fpath, "rb").read()
        log.info(f"open file: {name}")
        if isfile(fpath) and name.endswith(".js"):
            log.info(f"encScript file: {name}")
            scode = encScript(scode, compress)

        open(pjoin(encFilePath, name), "wb").write(scode)
        log.success(f"encrypt and save file: {name}")

    log.info("ready to pack")
    pack_asar(encFilePath, outFilePath)
    log.success("pack done")

    rmtree(encFilePath)
    log.debug("remove temp dir")


def main():
    argParser = ArgumentParser(
        description="[extract and decryption / pack and encryption] app.asar file from [Typora].",
        epilog="If you have any questions, please contact [ MasonShi@88.com ]")
    argParser.add_argument("asarPath", type=str, help="app.asar file path/dir [input/ouput]")
    argParser.add_argument("dirPath", type=str, help="as tmp and out directory.")

    argParser.add_argument('-u', dest='mode', action='store_const',
                           const=packWenc, default=extractWdec,
                           help='pack & encryption (default: extract & decryption)')
    argParser.add_argument('-f', dest='format', action='store_const',
                           const=True, default=False,
                           help='enabled prettify/compress (default: disabled)')
    args = argParser.parse_args()

    args.mode(args.asarPath, args.dirPath, args.format)
    log.success("Done!")


if __name__ == '__main__':
    main()
