module.exports = function (k) {
};
(() => {
    var n = {
        883: (t, n, a) => {
            var l = a(134), s = l.app, e = l.ipcMain, c = l.BrowserWindow, d = "win32" == process.platform,
                u = "linux" == process.platform, r = a(156), i = a(344);
            n.bindJumplist = () => {
                var t;
                d && (t = [{
                    type: "custom",
                    name: "Recent Locations",
                    items: s.setting.getRecentFolders().slice(0, 5).map(function (e) {
                        return {
                            type: "task",
                            title: e.name,
                            description: e.path,
                            program: process.execPath,
                            args: JSON.stringify(e.path),
                            iconPath: "explorer.exe",
                            iconIndex: 0
                        }
                    })
                }, {type: "recent"}, {
                    type: "tasks",
                    items: [{
                        type: "task",
                        program: process.execPath,
                        arguments: "--new",
                        iconPath: process.execPath,
                        iconIndex: 0,
                        title: "New"
                    }]
                }], s.setAppUserModelId("abnerworks.Typora"), s.setJumpList(t), i.loadDict().then(e => {
                    t[0].name = e["Recent Locations"] || "Recent Locations", t[2].items[0].title = e.New || "New", s.setAppUserModelId("abnerworks.Typora"), s.setJumpList(t)
                }))
            }, e.handle("shell.saveItem", (e, {path: n, data: o}) => new Promise(t => {
                a(833).writeFile(n, o, function (e) {
                    t()
                })
            })), e.handle("shell.openItem", (e, t) => l.shell.openPath(a(541).normalize(t))), e.handle("shell.trashItem", async (e, t) => {
                try {
                    return await l.shell.trashItem(t), !0
                } catch (e) {
                    return !1
                }
            }), e.handle("shell.openExternal", (e, t) => {
                if ("about:blank" != t) return l.shell.openExternal(t)
            }), e.handle("shell.showItemInFolder", (e, t) => (d && (t = t.replace(/\//g, "\\")), l.shell.showItemInFolder(t))), e.handle("shell.showDownload", (e, t) => {
                e = c.fromWebContents(e.sender);
                const n = a(554)["download"];
                n(e, t, {saveAs: !0})
            }), e.handle("dialog.showMessageBox", (e, t) => {
                e = c.fromWebContents(e.sender);
                return l.dialog.showMessageBox(u ? null : e, t)
            }), e.handle("dialog.showSaveDialog", (e, t) => {
                e = c.fromWebContents(e.sender);
                return l.dialog.showSaveDialog(u ? null : e, t)
            }), e.handle("dialog.showOpenDialog", (e, t) => {
                e = c.fromWebContents(e.sender);
                return l.dialog.showOpenDialog(u ? null : e, t)
            }), e.handle("dialog.showOpenDialogAlone", (e, t) => l.dialog.showOpenDialog(t));
            const p = t => new Promise(e => {
                setTimeout(() => {
                    e("sleep")
                }, t)
            }), h = async (e, t) => {
                var n = new c({
                    skipTaskbar: !0,
                    title: "Print PDF Preview",
                    show: !1,
                    webPreferences: {
                        webSecurity: !1,
                        allowDisplayingInsecureContent: !0,
                        allowRunningInsecureContent: !1,
                        nodeIntegration: !1,
                        safeDialogs: !1,
                        directWrite: s.setting.config.directWrite,
                        defaultFontFamily: s.setting.config.defaultFontFamily,
                        zoomFactor: +(s.setting.get("zoomFactor") || "1"),
                        backgroundThrottling: !1
                    }
                });
                try {
                    var o, i,
                        r = t ? (console.log("load file [" + t + "] for PDF export"), n.loadURL("file:///" + t)) : (o = a(541).join(s.setting.tempPath || s.getPath("temp"), +new Date + "tmp.html"), i = a(728), console.log("write output to temp file [" + o + "] for PDF export"), await i.outputFile(o, e), n.loadURL("file:///" + o))
                } catch (e) {
                    return console.error(e), n && n.destroy(), null
                }
                return Promise.race([p(1e4), r]).then(e => "sleep" === e ? (g(n.id), console.warn("Timeout for loading print view"), null) : n.id).catch(e => (console.error(e), n && n.destroy(), null))
            }, g = (e.handle("export.genPrintView", (e, t, n) => (n && g(n), h(null, t))), e => {
                e = c.fromId(e);
                e && (e.isDestroyed() || e.destroy())
            });
            e.handle("export.destroyPrintView", (e, t) => {
                g(t)
            }), e.handle("export.getPageColor", async (e, t) => {
                try {
                    var n = await h(null, t);
                    if (console.log("generate print preview window with id " + n), !n) return null;
                    printWin = c.fromId(n), await p(200);
                    var o = await printWin.webContents.executeJavaScript("window.getComputedStyle(document.body).backgroundColor")
                } catch (e) {
                    console.error(e)
                } finally {
                    printWin && printWin.destroy()
                }
                return o
            }), e.handle("export.print", (e, n, o) => {
                var i = c.fromId(n);
                o = o || {}, i.webContents.print(o, (e, t) => {
                    if (!e && !/cancel/.exec(t || "")) {
                        if ("no valid printers available" === t) return void i.webContents.executeJavaScript("window.print()").then(() => {
                            o.skipCleanUp || g(n)
                        });
                        l.dialog.showMessageBox({
                            type: "error",
                            message: r.getPanelString("Error"),
                            detail: t,
                            buttons: ["OK"]
                        })
                    }
                    o.skipCleanUp || g(n)
                })
            }), e.handle("export.printToPDF", async (e, t, n) => {
                let o = null, i = null, r = "", a = "";
                try {
                    var l = await h(null, t);
                    if (console.log("generate print window with id " + l), !l) return [i, r];
                    o = c.fromId(l), await p(200), i = await o.webContents.printToPDF(n), console.log("get PDF data"), r = await o.webContents.executeJavaScript("window.getComputedStyle(document.querySelector('#write')).color"), console.log("get background color")
                } catch (e) {
                    a = e.message || "", console.error(e)
                } finally {
                    o && o.destroy()
                }
                return [i, r, a]
            });
            var m, o, f = d ? 8e3 : 960, w = 1;

            function b() {
                console.log("updateTheme");
                var e = s.setting.curTheme(),
                    t = (s.execInAll("window.ClientCommand && File.setTheme('" + e + "');"), e.replace(/\.css$/, "").replace(/(^|-|_)(\w)/g, function (e, t, n, o) {
                        return (t ? " " : "") + n.toUpperCase()
                    })), e = l.Menu.getApplicationMenu().getItem("Themes");
                e && e.submenu.items.map(function (e) {
                    e.checked = e.label == t
                })
            }

            e.handle("export.prepareImageCapture", async (e, t, n) => {
                var o;
                try {
                    if (w = l.screen.getPrimaryDisplay().scaleFactor || 1, m = n.imageWidth, await (o = new c({
                        skipTaskbar: !0,
                        show: !1,
                        webPreferences: {
                            devTools: !1,
                            webSecurity: !1,
                            allowDisplayingInsecureContent: !0,
                            allowRunningInsecureContent: !0,
                            nodeIntegration: !1,
                            directWrite: s.setting.config.directWrite,
                            defaultFontFamily: s.setting.config.defaultFontFamily,
                            safeDialogs: !0
                        },
                        webgl: !1,
                        useContentSize: !0,
                        width: n.imageWidth,
                        height: f,
                        frame: !1,
                        enableLargerThanScreen: !!d,
                        offscreen: !0,
                        alwaysOnTop: !0,
                        minimizable: !1,
                        closable: !0
                    })).loadURL("file:///" + t), o.isDestroyed()) return null;
                    if (await p(2e3), o.isDestroyed()) return null;
                    var i = +await o.webContents.executeJavaScript("window.innerHeight");
                    if (o.isDestroyed()) return null;
                    var r = +await o.webContents.executeJavaScript("document.body.parentElement.scrollTop = document.body.clientHeight;\nMath.max(document.body.clientHeight, document.body.parentElement.scrollHeight)");
                    return o.isDestroyed() ? null : Number.isNaN(r) || Number.isNaN(i) ? void 0 : (u && (f = i), {
                        winId: o.id,
                        totalHeight: r,
                        pageHeight: f,
                        imageWidth: n.imageWidth
                    })
                } catch (e) {
                    return console.error(e), null == o || o.isDestroyed() || o.destroy(), null
                }
            }), e.handle("export.captureImage", async (e, t, n, o) => {
                t = c.fromId(t);
                if (!t || t.isDestroyed()) return null;
                try {
                    o && (t.setSize(o.imageWidth, o.pageHeight), t.setContentSize(o.imageWidth, o.pageHeight));
                    var i = +await t.webContents.executeJavaScript("document.body.parentElement.scrollTop = {d}; document.body.parentElement.scrollHeight;".replace("{d}", n));
                    if (await p(1e3), t.isDestroyed() || Number.isNaN(i)) return null;
                    var r = await t.webContents.capturePage();
                    return !r || r.isEmpty() ? null : (1 < w && (r = r.resize({
                        width: o.imageWidth || m,
                        quality: "best"
                    })), JSON.stringify({newScrollHeight: i, data: r.toDataURL()}))
                } catch (e) {
                    return console.error(e), t.destroy(), null
                }
            }), e.handle("url.request", (e, o) => new Promise((t, e) => {
                try {
                    var n = l.net.request({url: o, redirect: "follow"});
                    n.on("response", function (e) {
                        try {
                            if (200 != e.statusCode) return t(null);
                            if (!e.data) return t(null);
                            t({type: (e.headers["content-type"] || [""])[0], data: e.data})
                        } catch (e) {
                            t(null)
                        }
                    }), n.end()
                } catch (e) {
                    t(null)
                }
            })), e.handle("clipboard.write", (e, t, n) => {
                n && l.clipboard.clear(), l.clipboard.write(JSON.parse(t))
            }), e.handle("pandoc.import", (e, n) => {
                var o = {
                        "\b": "\\b",
                        "\t": "\\t",
                        "\n": "\\n",
                        "\f": "\\f",
                        "\r": "\\r",
                        '"': '\\"',
                        "'": "\\'",
                        "\\": "\\\\"
                    }, e = c.fromWebContents(e.sender),
                    t = n ? Promise.resolve(e) : s.openFile(null, {syncAndPrepOnly: !0}).then(n => new Promise(e => {
                        let t = n.activeWindow.webContents;
                        t.isLoading() ? t.once("did-finish-load", function () {
                            e(n.activeWindow)
                        }) : e(n.activeWindow)
                    })), e = l.dialog.showOpenDialog(n ? e : null, {
                        title: i.getMenuDict.Import,
                        properties: ["openFile"],
                        filters: [{
                            name: r.getPanelString("All Supported Formats"),
                            extensions: ["docx", "rtf", "latex", "tex", "ltx", "rst", "rest", "org", "wiki", "dokuwiki", "mediawiki", "textile", "opml", "epub"]
                        }, {name: "MS Word", extensions: ["docx"]}, {name: "RTF", extensions: ["rtf"]}, {
                            name: "TeX/LaTeX",
                            extensions: ["latex", "tex", "ltx"]
                        }, {name: "reStructuredText", extensions: ["rst", "rest"]}, {
                            name: "org-mode",
                            extensions: ["org"]
                        }, {name: "Wiki", extensions: ["wiki", "dokuwiki", "mediawiki"]}, {
                            name: "Epub",
                            extensions: ["epub"]
                        }, {name: "Textile", extensions: ["textile"]}, {name: "OPML", extensions: ["opml"]}]
                    }).then(({filePaths: e}) => (e || [null])[0]);
                return Promise.all([t, e]).then(async ([e, t]) => {
                    t ? (await p(100), e.show(), e.webContents.executeJavaScript('window.getSelection().removeAllRanges();ClientCommand.doImport("' + t.replace(/["'\\\b\t\n\f\r]/g, function (e) {
                        return o[e]
                    }).replace(/\u200b/g, "") + '")')) : n || e.destroy()
                })
            }), e.handle("pandoc.version", () => o), e.handle("pandoc.setVersion", (e, t) => {
                o = t
            }), l.nativeTheme.on("updated", function () {
                null !== s.setting.useDarkThemeBefore() && s.setting.useDarkThemeBefore() !== s.setting.useDarkTheme() && b()
            }), e.handle("theme.apply", () => {
                b()
            }), e.handle("theme.setThemeSource", (e, t) => {
                "system" !== (t = t || "system") && s.setting.get("useSeparateDarkTheme") || (l.nativeTheme.themeSource = t)
            }), e.on("ondragstart", function (t, n, o) {
                setTimeout(function () {
                    var e = l.nativeImage;
                    t.sender.startDrag({
                        file: n,
                        icon: o ? e.createFromPath(a(541).normalize(o)) : e.createEmpty()
                    }), console.log("ondragstart " + n + " " + o)
                }, 100)
            }), e.handle("getPath", (e, t) => s.getPath(t))
        }, 156: (e, t, n) => {
            var o = n(134).app, i = n(728), r = n(541).join(__dirname, "../"),
                a = ["Operation Failed", "Save As", "All Supported Formats", "Error", "Check updates automatically", "Skip This Version", "Remind Me Later", "Download Update", "New version available.", "Latest version is $1, your version is $2", "Updater", "Checking Updates…", "Downloading Updates…", "You're up to date!", "Check Update Failed", "Download failed", "Install Updates ?", "Quit and Install", "Cancel", "Download", "Downloading…", "Extracting binary…", "This dev version of Typora is expired, please download and install a newer version.", "This device has been deactivated", "Typora is now deactivated", "UNREGISTERED"],
                l = {}, s = !1;
            e.exports = {
                initDict: function () {
                    if (s) return Promise.resolve();
                    var e = n(541).join(r, o.setting.getLocaleFolder("Panel"));
                    return i.readJSON(e, "utf8").then(function (t) {
                        s = !0, a.map(function (e) {
                            l[e] = t[e] || e
                        })
                    }).catch(function () {
                    })
                }, getPanelString: function (e) {
                    return l[e] || e
                }
            }
        }, 351: (r, l, c) => {
            function d(e, t) {
                this.activeWindow = t || null, this.windows = new Set(t), this.path = e || null, this.snap = null, this.lastSync, this.content, this.backupState = null
            }

            var e = c(134), u = e.app, a = e.BrowserWindow, s = e.powerMonitor, h = c(728), e = c(232),
                g = (c(266), process.platform, process.platform, "linux" == process.platform), m = c(468), f = c(587),
                t = c(134).ipcMain, o = (t.on("doc.syncChange", function (e, t) {
                    var n = a.fromWebContents(e.sender), o = u.documentController.getDocumentFromWindowId(n.id);
                    n == o.activeWindow && 1 < o.windows.size && (t = JSON.parse(t), o.syncChange(t || []), e.sender.send("scheduleFullContentSync"))
                }), d.prototype.setContent = function (e) {
                    this.content = e
                }, d.prototype.getContent = function () {
                    return this.content
                }, d.prototype.switchToUntitled = function (t) {
                    this.path && (this.rename(null), this.windows.forEach(function (e) {
                        t && e != this.activeWindow ? e.close() : e.webContents.executeJavaScript("window.clientHandlerOnPresentationMoved()")
                    }, this))
                }, d.prototype.rename = function (e) {
                    p(this.path) != p(e || "") && (this.path && (i.path2doc.delete(p(this.path)), i.name2docs.get(p(o(this.path))).delete(this), u.setting.removeRecentDocument(this.path)), e && i.forceCloseFromPath(e), (this.path = e) && (i.path2doc.set(p(e), this), i.solveDuplicateName_(this), u.setting.addRecentDocument(e)))
                }, d.prototype.shouldSaveSnap = function () {
                    return this.path || 1 < this.windows.size || this.snap
                }, d.prototype.syncChange = function (t) {
                    var n;
                    this.windows.size <= 1 || t && t.length && this.windows.forEach(function (e) {
                        try {
                            e !== this.activeWindow && (e.isDestroyed() || e.webContents.isDestroyed() || (n = n || JSON.stringify(t), e.webContents.executeJavaScript("File.editor.applyChange(" + n + ")")))
                        } catch (e) {
                            m.captureException(e, {
                                extra: {
                                    changes: t.map ? t.map(function (e) {
                                        return e.type
                                    }) : "unknown"
                                }
                            })
                        }
                    }, this)
                }, d.prototype.addSnap = function (e) {
                    !this.path && this.windows.size <= 1 || !e ? this.snap = null : (e.fromSourceMode ? e.srcContent = e.content : this.snap && (e.srcHist = this.snap.srcHist, e.srcContent = this.snap.srcContent), this.snap = e)
                }, d.prototype.enterOversize = function () {
                    this.windows.forEach(function (e) {
                        this.activeWindow != e && e.webContents.executeJavaScript("File.tryEnterOversize('', true, true)")
                    })
                }, d.prototype.getSnap = function (e) {
                    return this.snap && 0 < this.snap.timeStamp && this.snap.timeStamp == e ? null : (this.snap && (this.snap.lastSync = this.lastSync), this.snap)
                }, d.prototype.setLastSync = function (e) {
                    this.lastSync = e
                }, d.prototype.setActiveWindow = function (t) {
                    var n = this, o = t == this.activeWindow, i = u.focusedWindow == t;
                    return !this.activeWindow || o || this.activeWindow.isDestroyed() ? o ? (t.webContents.executeJavaScript("window.onWindowFocusForNode && window.onWindowFocusForNode(true, " + i + ")"), n.activeWindow = t, Promise.resolve()) : (n.activeWindow = t).webContents.executeJavaScript("window.onWindowFocusForNode && window.onWindowFocusForNode(" + o + ", " + i + ")") : n.activeWindow.webContents.executeJavaScript("window.onWindowResignForNode && window.onWindowResignForNode()").then(function (e) {
                        return (n.activeWindow = t).webContents.executeJavaScript("window.onWindowFocusForNode && window.onWindowFocusForNode(" + o + ", " + i + ")")
                    })
                }, d.prototype.saveFromUntitled = function (t) {
                    this.windows.forEach(function (e) {
                        e.webContents.send("saveFromUntitled", t)
                    })
                }, d.prototype.shouldReadFromDisk = async function () {
                    return !await this.isSnapValid()
                }, d.prototype.isSnapValid = async function () {
                    if (!this.path && this.snap) return !0;
                    if (this.snap && -1 != this.lastSync) {
                        if (this.snap.changeCounter && !this.snap.changeCounter.curState) return !0;
                        try {
                            var e = (await h.stat(this.path)).mtimeMs;
                            return this.lastSync, this.snap.timeStamp, !this.lastSync || this.lastSync >= e
                        } catch (e) {
                            console.warn(e)
                        }
                        return !1
                    }
                }, d.prototype.getWindowToFocus = function () {
                    var e = this.activeWindow || this.windows.keys().next().value;
                    if (e) {
                        if (!e.isDestroyed()) return e;
                        this.activeWindow = null, this.windows.delete(e)
                    }
                    return null
                }, d.prototype.syncFullContent = function (t) {
                    var e, n = !1;
                    if (this.windows.forEach(function (e) {
                        this.activeWindow != e && !n && (e.inSourceMode && !t || !e.inSourceMode && t) && (n = !0)
                    }), n) return e = this.windows, this.activeWindow.webContents.executeJavaScript("File.sync(false, true);1;").then(function () {
                        e.forEach(function (e) {
                            this.activeWindow != e && (e.inSourceMode && !t || !e.inSourceMode && t) && e.webContents.executeJavaScript("File.editor.applyFullContent(" + !!t + ")")
                        })
                    }), null
                }, d.prototype.popBackupState = async function () {
                    var e = this.backupState;
                    return this.backupState = void 0, Promise, e
                }, function (e) {
                    return c(541).basename(e)
                }), w = e.isCaseInsensitive();

            function p(e) {
                return w ? e && e.toLowerCase() : e
            }

            function n() {
                this.documents = new Set, this.path2doc = new Map, this.win2doc = new Map, this.name2docs = new Map, this.frozenDocs = [], this.watchSystemPause()
            }

            n.prototype.watchSystemPause = function () {
                u.whenReady().then(() => {
                    s.on("suspend", () => {
                        console.log("The system is going to sleep"), this.documents.forEach(e => {
                            e.activeWindow && e.activeWindow.webContents.executeJavaScript("window.File && File.saveAndBackup()")
                        })
                    })
                })
            }, n.prototype.setContentForWindow = function (e, t) {
                var n = this.getDocumentFromWindowId(t);
                (n.activeWindow || {}).id == t && n.setContent(e)
            }, n.prototype.solveDuplicateName_ = function (e) {
                var t = e.path, t = p(o(t)), n = this.name2docs.get(t) || new Set;
                this.name2docs.set(t, n), 0 < n.length && n.forEach(function (e) {
                    var t;
                    t = "File.FileInfoPanel.onFilePathUpdated();", e.windows.forEach(function (e) {
                        try {
                            e.isDestroyed() || e.webContents.isDestroyed() || webContent.executeJavaScript(t)
                        } catch (e) {
                            m.captureException(e, {
                                level: "warning",
                                extra: {js: t}
                            }), console.error("Execute js {" + t + "} on every window failed " + e.message)
                        }
                    })
                }), n.add(e)
            }, n.prototype.openFile = function (e, t) {
                t = t || {};
                var n = this, o = this.getDocument(e), {
                    prepWindow: i,
                    displayNow: r,
                    forceCreateWindow: a,
                    anchor: l
                } = t;
                if (o) {
                    var s = o.getWindowToFocus();
                    if (r && s && (s.focus(), l && s.webContent.executeJavaScript(`File.editor && File.editor.tryOpenUrl('${l.replace(/'/g, "")}')`)), !a && (!i || s)) return Promise.resolve(o)
                } else e = e && c(541).normalize(e), o = this.recallDoc(e) || new d(e), e && (this.path2doc.set(p(e), o), this.documents.add(o), this.solveDuplicateName_(o), u.setting.addRecentDocument(e)), t.backupState && (o.backupState = t.backupState);
                return (i ? (s = f.makeWindow(r, {
                    initMountFolder: t.mountFolder,
                    mountFolder: t.mountFolder,
                    pinFolder: t.pinFolder,
                    silentOpenFailure: t.silent,
                    showSidebar: t.showSidebar,
                    initFilePath: e || "",
                    initAnchor: l || ""
                }), n.addWindowToDocument_(o, s).then(function () {
                    g && process.argv.length <= 1 && b(s), r && s.focus()
                })) : Promise.resolve()).then(function () {
                    return o
                })
            }, n.prototype.addWindowToDocument_ = function (e, t) {
                return this.win2doc.set(t.id, e), e.windows.add(t), u.addBackup({
                    id: t.id,
                    path: e.path
                }), e.setActiveWindow(t)
            }, n.prototype.getDocument = function (e) {
                return e ? (e = p(c(541).normalize(e)), this.path2doc.get(e)) : null
            }, n.prototype.getDocumentFromWindowId = function (e) {
                var t = this.win2doc.get(e);
                return t && t.activeWindow && t.activeWindow.isDestroyed() && t.setActiveWindow(a.fromId(e)), t
            }, n.prototype.removeWindow = function (e) {
                var t = this.getDocumentFromWindowId(e), n = this, o = a.fromId(e);

                function i() {
                    t.activeWindow == o && (t.activeWindow = null), u.focusedWindow == o && (u.focusedWindow = null), t.windows.delete(o), 0 == t.windows.size && (u.removeBackup(e), n.removeDocument(t)), n.win2doc.delete(e)
                }

                if (t) {
                    if (t.activeWindow == o) return o.webContents.executeJavaScript("window.File && File.backupDocumentSnap && File.backupDocumentSnap()").then(i);
                    i()
                }
                return Promise.resolve()
            }, n.prototype.frozenDoc = function (e) {
                e.snap && e.snap.nodeMap && e.path && (10 < this.frozenDocs.length && this.frozenDocs.splice(5, this.frozenDocs.length - 5), this.frozenDocs.push(e))
            }, n.prototype.recallDoc = function (e) {
                if (e) {
                    for (var t, n = this.frozenDocs.length, o = 0, i = -1; o < n; o++) {
                        var r = this.frozenDocs[o];
                        if (r.path && (w ? r.path.toLowerCase() == e.toLowerCase() : r.path == e)) {
                            i = o, t = r;
                            break
                        }
                    }
                    return this.frozenDocs.splice(i, 1), t
                }
            }, n.prototype.removeDocument = function (e) {
                this.documents.delete(e), e.path && (this.path2doc.delete(p(e.path)), this.name2docs.get(p(o(e.path))).delete(e), e.activeWindow = null, e.windows = new Set, this.frozenDoc(e))
            }, n.prototype.forceCloseFromPath = function (e) {
                !e || (e = this.getDocument(e)) && Array.from(e.windows).forEach(function (e) {
                    this.removeWindow(e.id).then(function () {
                        e.destroy()
                    })
                }, this)
            }, n.prototype.hasDuplicateName = function (e) {
                return !!e && 1 < (this.name2docs.get(p(e)) || []).length
            }, n.prototype.switchDocument = function (t, e) {
                var n = a.fromId(t), o = this.getDocumentFromWindowId(t), i = this.getDocument(e), r = this;
                return o == i ? Promise.resolve(i) : (console.log("switchDocument " + t + " [" + e + "]"), (i ? Promise.resolve(i) : this.openFile(e)).then(function (e) {
                    return i = e, r.removeWindow(t)
                }).then(function () {
                    return r.addWindowToDocument_(i, n)
                }).then(function () {
                    return i
                }))
            };
            var b = function (t) {
                var n = [];
                process.stdin.setEncoding("utf8"), process.stdin.on("data", function (e) {
                    console.log("==read==\n" + e), n.push(e)
                }), process.stdin.on("end", function () {
                    if (n.length) try {
                        var e = "File.reloadContent(" + JSON.stringify(n.join("\n")) + ")";
                        t.webContents.executeJavaScript(e)
                    } catch (e) {
                        console.error(e.message)
                    }
                })
            };
            t.handle("document.switchToUntitled", (e, t, n) => {
                e = a.fromWebContents(e.sender), t = t ? u.getDocumentController().getDocument(t) : u.documentController.getDocumentFromWindowId(e.id);
                t && t.activeWindow == e && t && t.switchToUntitled(n)
            }), t.handle("document.setLastSync", (e, t) => {
                e = a.fromWebContents(e.sender);
                u.documentController.getDocumentFromWindowId(e.id).setLastSync(t)
            }), t.handle("document.syncFullContent", (e, t) => {
                e = a.fromWebContents(e.sender);
                u.documentController.getDocumentFromWindowId(e.id).syncFullContent(t)
            }), t.handle("document.getContent", e => {
                e = a.fromWebContents(e.sender);
                u.documentController.getDocumentFromWindowId(e.id).getContent()
            }), t.handle("document.currentPath", e => {
                e = a.fromWebContents(e.sender);
                return u.documentController.getDocumentFromWindowId(e.id).path
            });
            const y = async e => {
                var t = e.getSnap(null), n = e.path, o = !1, i = null;
                return (t || {}).nodeMap ? o = await e.shouldReadFromDisk() : i = await e.popBackupState(), i && i.hasUnsaved ? console.log("load from recover content length: " + i.content.length) : i = null, JSON.stringify({
                    snap: t,
                    filePath: n,
                    backups: i,
                    shouldReadFromDisk: o,
                    windowCounts: e.windows.size
                })
            };
            t.handle("document.loadData", async e => {
                console.log("handle document.loadData");
                new Date;
                e = a.fromWebContents(e.sender), e = u.documentController.getDocumentFromWindowId(e.id), e = await y(e);
                return new Date, e
            }), t.handle("document.switchDocument", async (e, t) => {
                e = a.fromWebContents(e.sender), e = await u.getDocumentController().switchDocument(e.id, t);
                return y(e)
            }), t.handle("document.rename", (e, t) => {
                e = a.fromWebContents(e.sender);
                return u.documentController.getDocumentFromWindowId(e.id).rename(t), !0
            }), t.handle("document.setContent", (e, t) => {
                var e = a.fromWebContents(e.sender), e = u.documentController.getDocumentFromWindowId(e.id),
                    n = e.content == t;
                return e.setContent(t), n
            }), t.handle("document.addSnap", (e, t) => {
                e = a.fromWebContents(e.sender), e = u.documentController.getDocumentFromWindowId(e.id);
                return t ? e.addSnap(JSON.parse(t)) : e.addSnap(null), !0
            }), t.handle("document.addSnapAndLastSync", (e, t) => {
                try {
                    var n, o, i = a.fromWebContents(e.sender), r = u.documentController.getDocumentFromWindowId(i.id);
                    t ? ({snap: n, lastSync: o} = JSON.parse(t), r.addSnap(n), r.setLastSync(o)) : r.addSnap(null)
                } catch (e) {
                    console.error(e)
                }
                return !0
            }), t.handle("document.shouldSaveSnap", e => {
                e = a.fromWebContents(e.sender);
                return u.documentController.getDocumentFromWindowId(e.id).shouldSaveSnap()
            }), t.handle("document.getSnap", (e, t) => {
                e = a.fromWebContents(e.sender), e = u.documentController.getDocumentFromWindowId(e.id);
                return JSON.stringify(e.getSnap(t))
            }), t.handle("document.getSnapWithValidation", async (e, t) => {
                var e = a.fromWebContents(e.sender), e = u.documentController.getDocumentFromWindowId(e.id),
                    n = await e.isSnapValid();
                return JSON.stringify({snap: e.getSnap(t), shouldReadFromDisk: 0 == n})
            }), t.handle("document.enterOversize", e => {
                e = a.fromWebContents(e.sender), e = u.documentController.getDocumentFromWindowId(e.id);
                e && e.enterOversize()
            }), t.handle("document.newWindow", e => {
                3 == u.setting.get("restoreWhenLaunch") ? u.openFile(null, {
                    mountFolder: u.setting.get("pinFolder"),
                    silent: "pinFolder"
                }) : u.openFile()
            }), t.handle("document.checkIfMoveOnSave", (e, t) => {
                var e = a.fromWebContents(e.sender), n = u.documentController.getDocument(t);
                return !n && ((n = u.documentController.getDocumentFromWindowId(e.id)).rename(t), !0)
            }), t.handle("document.hasDuplicateName", (e, t) => u.documentController.hasDuplicateName(t)), t.handle("document.noOtherWindow", (e, t) => {
                e = a.fromWebContents(e.sender);
                return u.documentController.getDocumentFromWindowId(e.id).windows.size <= 1
            });
            var i = new n;
            r.exports = i
        }, 824: (e, t, s) => {
            var c = s(728), d = s(541), u = {
                title: "Download",
                text: "Downloading…",
                indeterminate: !1,
                initialValue: 0,
                maxValue: 1,
                closeOnComplete: !1,
                abortOnError: !1,
                style: {text: {padding: "3px 0"}},
                browserWindow: {modal: !1, closable: !0, webPreferences: {nodeIntegration: !0, contextIsolation: !1}}
            };

            function p(e) {
                if (e < 1024) return e + " B";
                var t = e / Math.pow(1024, 1), e = e / Math.pow(1024, 2);
                return e < 1 ? (t + "").replace(/(\..)(.+)$/, "$1") + "KB" : (e + "").replace(/(\..)(.+)$/, "$1") + "MB"
            }

            function n(e, t, n) {
                this.onAbort = null, this.onSuccess = null, this.onError = null, this.downloadURL = e, this.dist = t, this.displayOption = n || {}, this.progressBar = null, this.downloadItem = null
            }

            n.prototype.cancel = function () {
                if (this.downloadItem) {
                    try {
                        this.downloadItem.cancel()
                    } catch (e) {
                    }
                    this.downloadItem = null
                }
                this.setCompleted(), this.onAbort && this.onAbort()
            }, n.prototype.setCompleted = function () {
                this.downloadItem = null, this.progressBar && (this.progressBar.setCompleted(), this.progressBar.close(), this.progressBar = null)
            }, n.prototype.download = function () {
                var e = s(477), t = s(554), n = this, o = this.downloadURL, i = this.dist, r = this.displayOption,
                    a = new e(Object.assign({}, u, r)), l = ((this.progressBar = a).on("aborted", function () {
                        n.cancel()
                    }), d.dirname(i));
                Promise.all([new Promise(function (e) {
                    a.on("ready", e)
                }), c.ensureDir(l)]).then(function () {
                    console.record("[downloader] downloading " + o, "DEBUG"), t.download(a._window, o, {
                        showBadge: r.showBadge || !1,
                        directory: l,
                        filename: d.basename(i),
                        onProgress: function (e) {
                            a && (a.value = e.percent * (r.processOnComplete || 1), a.detail = p(e.transferredBytes) + " / " + p(e.totalBytes))
                        },
                        onStarted: function (e) {
                            console.log("start downloading " + e.getURL()), n.downloadItem = e
                        },
                        onCancel: function () {
                            console.log("canceled downloading " + downloadItem.getURL()), n.cancel()
                        }
                    }).then(function (e) {
                        n.onSuccess(e, a)
                    }).catch(function (e) {
                        console.log("error downloading " + (n.downloadItem && n.downloadItem.getURL())), n.onError(e)
                    })
                })
            }, e.exports = n
        }, 405: (e, t, n) => {
            var n = n(134), o = n.app, n = n.ipcMain, i = global.t_workingDir, r = o.getVersion(),
                a = (/-([a-z]+)/.exec(r) || [])[1], l = r;

            function s(e, t) {
                var n, o, i;
                for (e = (e || "").replace(/-[a-z]+/, ""), t = (t || "").replace(/-[a-z]+/, ""), e = e.split("."), t = t.split("."), o = Math.min(e.length, t.length), n = 0; n < o; n++) if (0 != (i = parseInt(e[n], 10) - parseInt(t[n], 10))) return i;
                return e.length - t.length
            }

            a && (l = r.substr(r.length - 1 - a.length), global.devVersion = !0), s(l, "1.0.0") < 0 && process.exit(), n.handle("env.info", e => ({
                PRODUCTION_MODE: global.PRODUCTION_MODE,
                DEBUG_MODE: global.DEBUG_MODE,
                version: o.getVersion(),
                devVersion: global.devVersion
            })), global.compareVersion = s, global.t_workingDir = i, global.PRODUCTION_MODE = !0, global.DEBUG_MODE = !1
        }, 932: (e, t, n) => {
            function o() {
                this.clearUndo()
            }

            function i(e) {
                r.dialog.showErrorBox(l.getPanelString("Operation Failed"), e.message)
            }

            var r = n(134), a = r.app, l = n(156), s = n(728), n = r.ipcMain, c = (o.prototype.hasUndo = function (e) {
                return !(!this.hasUndo_ || !e) && (0 == (this.undoTo_ || "").indexOf(e) || 0 == (this.undoFrom_ || "").indexOf(e))
            }, o.prototype.undoLabel = function () {
                return this.undoLabel_
            }, o.prototype.clearUndo = function () {
                this.undoFrom_ = "", this.undoTo_ = "", this.undoLabel_ = "", this.hasUndo_ = !1
            }, o.prototype.registerUndo = function (e, t, n) {
                this.undoFrom_ = e, this.undoTo_ = t, this.undoLabel_ = n, this.hasUndo_ = !0
            }, o.prototype.getFocusPath = function () {
                return this.hasUndo_ && this.undoTo_
            }, o.prototype.performUndo = function () {
                var t;

                function n() {
                    r.dialog.showMessageBox({
                        type: "warning",
                        message: l.getPanelString("Operation Failed"),
                        defaultId: 0,
                        cancelId: 1,
                        buttons: [l.getPanelString("Save As"), l.getPanelString("Cancel")]
                    }).then(({response: e}) => {
                        0 == e ? r.dialog.showSaveDialog({
                            defaultPath: t.undoTo_,
                            properties: ["showOverwriteConfirmation"]
                        }).then(({filePath: e}) => {
                            e && e != t.undoFrom_ && s.rename(t.undoFrom_, e, function (e) {
                                e && i(e)
                            }), t.clearUndo()
                        }) : t.clearUndo()
                    })
                }

                this.hasUndo_ && (this.hasUndo_ = !1, (t = this).undoTo_ ? s.existsSync(this.undoTo_) ? n() : (a.sendEvent("willRename", {
                    oldPath: t.undoFrom_,
                    newPath: t.undoTo_
                }), s.copyFile(this.undoFrom_, this.undoTo_, function (e) {
                    s.unlink(t.undoFrom_, function () {
                    }), e ? (n(), a.sendEvent("didRename", {
                        oldPath: t.undoFrom_,
                        newPath: t.undoFrom_
                    })) : (a.sendEvent("didRename", {oldPath: t.undoFrom_, newPath: t.undoTo_}), t.clearUndo())
                })) : s.remove(this.undoFrom_, function (e) {
                    e ? i(e) : (t.clearUndo(), a.sendEvent("updateQuickOpenCache", {toDel: this.undoFrom_}))
                }))
            }, new o);
            n.handle("filesOp.registerUndo", (e, t, n, o) => {
                c.registerUndo(t, n, o)
            }), n.handle("filesOp.clearUndo", e => {
                c.clearUndo()
            }), n.handle("filesOp.performUndo", e => {
                c.performUndo()
            }), n.handle("filesOp.getFocusPath", e => c.getFocusPath()), n.handle("filesOp.undoLabel", (e, t) => c.hasUndo(t) ? c.undoLabel() : null), t.default = c
        }, 445: (o, e, i) => {
            i(405);
            var u, p = i(156), h = i(134), g = h.shell, l = h.app, m = h.ipcMain, f = h.BrowserWindow,
                w = "win32" == process.platform, b = "darwin" == process.platform, y = "linux" == process.platform,
                v = i(587), k = i(359).default, s = i(468), C = !1;
            const F = function (e) {
                try {
                    return require(e)
                } catch (e) {
                    if (C) return;
                    C = !0;
                    var t = e.message;
                    setTimeout(() => {
                        C = !1, (dialog = i(134).dialog).showMessageBox(null, {
                            type: "error",
                            buttons: ["OK"],
                            defaultId: 0,
                            cancelId: 0,
                            title: "A required module cannot be loaded by Typora",
                            message: t.split("\n")[0] + "\n\nPlease check if that file exists or reinstall Typora to fix."
                        }).then(({}) => {
                            process.exit(1)
                        })
                    }, 1500)
                }
            };
            var S, r = null, x = "", c = "", a = "", D = "";
            const P = {SUCCESS: 0, OUT_OF_LIMIT: 1, INVALIDATE: -1, WRONG_USER: -2},
                //T = JSON.parse(Buffer.from("WyItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLSIsIk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBN25Wb0dDSHFJTUp5cWdBTEVVcmMiLCI1SkpoYXAwK0h0SnF6UEUwNHB6NHkrbnJPbVk3LzEyZjNIdlp5eW9Sc3hLZFhUWmJPMHdFSEZJaDBjUnFzdWFKIiwiUHlhT09QYkEwQnNhbG9mSUFZM21SaFFRM3ZTZitybjNnK3cwUyt1ZFdtS1Y5RG5tSmxwV3FpekZhalU0VC9FNCIsIjVaZ01OY1h0M0UxaXBzMzJyZGJUUjBObmVuOVBWSVR2cmJKM2w2Q0kyQkZCSW1aUVoyUDhOK0xzcWZKc3F5VlYiLCJ3RGt0M21IQVZ4VjdGWmJmWVdHKzhGRFN1S1FIYUNtdmdBdENoeDlod2wzSjZSZWtrcURWYTZHSVYxM0QyM0xTIiwicWRrMEpiNTIxd0ZKaS9WNlFBSzZTTEJpYnk1Z1lONnpRUTVSUXBqWHRSNTNNd3pUZGlBekdFdUtkT3RyWTJNZSIsIkR3SURBUUFCIiwiLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tIiwiIiwiIl0=", "base64").toString("utf8")).join("\n"),
                I = 864e5;
            var W = "https://store.typora.io";
            const E = e => {
                if (!e) return e;
                var t;
                try {
                    t = Buffer.from(e, "base64");
                    //const n = i(289).publicDecrypt(T, t);
                    return JSON.parse(t.toString("utf8"))
                } catch (e) {
                    return null
                }
            }, _ = function () {
                var e = Array.from(arguments);
                const t = i(289).createHash("sha256");
                return e.forEach(e => {
                    t.update(e)
                }), t.digest("base64")
            }, O = () => {
                const e = d().get("SLicense");
                if (!e) return null;
                var [t, n, o] = e.split("#"), t = E(t);
                return t && t.fingerprint == a ? (Object.assign(t, {failCounts: n, lastRetry: new Date(o)}), t) : null
            }, M = async e => {
                console.log("writeInstallDate fromBTime=" + e);
                var t = new Date;
                if (e) try {
                    var n = await i(728).stat(l.getPath("userData") + "/profile.data"), t = new Date(n.birthtime);
                    n.birthtime
                } catch (e) {
                }
                e = (u = t).toLocaleDateString("en-US");
                return d().put("IDate", e), u
            };
            var L = null;
            const d = function () {
                var n;
                return L = null == L ? w ? function () {
                    const o = F("native-reg"), i = "Software\\Typora";
                    return {
                        get: function (e) {
                            var t = o.openKey(o.HKCU, i, o.Access.READ);
                            if (null == t) return "";
                            e = o.getValue(t, null, e);
                            return o.closeKey(t), e
                        }, put: function (e, t) {
                            var n = o.createKey(o.HKCU, i, o.Access.WRITE);
                            o.setValueSZ(n, e, t), o.closeKey(n)
                        }
                    }
                }() : (n = l.setting.prepDatabase(a), {
                    put: function (e, t) {
                        console.log("ls put " + e), n.getState()[e] = t, n.write()
                    }, get: function (e) {
                        return n.getState()[e]
                    }
                }) : L
            };
            const U = async () => {
                if (!a) {
                    if (w) {
                        const t = F("native-reg");
                        var e = t.openKey(t.HKEY.LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Cryptography", t.Access.WOW64_64KEY | t.Access.READ);
                        a = t.getValue(e, null, "MachineGuid"), t.closeKey(e)
                    } else a = await i(560).machineId({original: !0});
                    a || s.captureMessage("[L] Failed to get fingerPrint"), a = _(a, "typora").substr(0, 10).replace(/[/=+-]/g, "a"), b && (a += "darwin")
                }
                return a
            };
            var R = !1;
            const A = () => {
                var e = s.getContext().tags;
                e.hasLicense = r, s.mergeContext(e)
            }, B = () => process.platform.replace(/\d+/, ""), N = async (t, n, o) => {
                ne(), console.log(`request ${W}/` + t);
                const e = new AbortController;
                var i, r = setTimeout(() => e.abort(), 3e4);
                try {
                    i = await k(W + "/" + t, {
                        method: "POST",
                        cache: "no-cache",
                        body: JSON.stringify(n),
                        headers: {"Content-Type": "application/json", "Cache-Control": "no-cache"}
                    }), clearTimeout(r)
                } catch (e) {
                    var a = e;
                    if (console.warn(e.stack), clearTimeout(r), o && "zh-Hans" == l.setting.getUserLocale() && !l.setting.get("useMirrorInCN")) {
                        r = (await h.dialog.showMessageBox(null, {
                            message: "链接服务器失败，使用尝试访问国内域名进行激活?",
                            buttons: ["确认", "取消"]
                        }))["response"];
                        if (console.log("click " + r), r) throw a;
                        return l.setting.put("useMirrorInCN", !0), N(t, n, !1)
                    }
                    if (l.setting.get("useMirrorInCN")) try {
                        console.log("request to typora.com.cn"), i = await post("https://typora.com.cn/store/" + t, n)
                    } catch (e) {
                        throw a
                    }
                }
                if (i) {
                    if (200 == i.status) return -1 < t.indexOf("deactivate") ? i.text() : i.json();
                    throw new Error(await i.text())
                }
            }, z = async (t, n) => {
                const o = (new Date).toLocaleDateString("en-US");
                var {deviceId: t, lastRetry: i} = t || {};
                if (n || !(new Date - i < I / 2)) {
                    n = {
                        v: B() + "|" + l.getVersion(),
                        license: c,
                        l: t,
                        u: l.setting.generateUUID(),
                        type: global.devVersion ? "dev" : ""
                    };
                    JSON.stringify(n);
                    try {
                        ne();
                        const r = new AbortController;
                        var e = setTimeout(() => r.abort(), 4e4);
                        const a = await (await k(W + "/api/client/renew", {
                            method: "POST",
                            cache: "no-cache",
                            body: JSON.stringify(n),
                            headers: {"Content-Type": "application/json", "Cache-Control": "no-cache"}
                        })).json();
                        clearTimeout(e), a.success || (console.warn("[renewL]: unfill due to renew fail"), $(a.msg)), d().put("SLicense", [a.msg, 0, o].join("#"))
                    } catch (e) {
                        e.stack, s.captureException(e, {level: "warning"}), console.warn("Failed to Renew L");
                        var [t, n] = (i = d().get("SLicense")).split("#"), i = [t, n = +n + 1, o].join("#");
                        d().put("SLicense", i)
                    }
                }
            }, J = e => {
                var t = new Date(d().get("IDate"));
                return isNaN(t.getTime()) ? e ? null : new Date : e ? t : (e = 1656256399766, isNaN(e) ? e = new Date("2021-10-01") : (e = new Date(e), isNaN(e.getTime()) && (e = new Date("2021-10-01"))), t < e ? e : t)
            }, V = (e, t) => {
                if (t = t || 15, 432e5 < u - new Date) return 0;
                var n = Math.floor((new Date - u) / 864e5), n = Math.max(0, t - n);
                return n = e && (t < n || isNaN(n)) ? t : n
            }, H = async () => {
                var e = (u = J(!global.devVersion)) ? V(!1) : 100;
                (15 < e || isNaN(e)) && (console.log("[L] Read from incorrupted InstallDate"), await M(!0), e = 15), console.log(`[L] installDate is ${u.toLocaleDateString("en-US")}, trail remains: ${e} days`)
            };

            function j(e, t, n) {
                c = t, D = n, (r = !(!(x = e) || !c)) && le()
            }

            function $(e) {
                r || (e = ""), c = x = "", r = !1, d().put("SLicense", ""), e && K(p.getPanelString("Typora is now deactivated"), p.getPanelString(e)), se()
            }

            const q = e => {
                R = !0;
                var t = O(), {license: n, email: o, type: i} = t || {};
                n && o ? j(o, n, i) : $()
            }, K = (e, t) => h.dialog.showMessageBox(null, {
                type: "error",
                buttons: ["OK"],
                defaultId: 0,
                cancelId: 0,
                title: e,
                message: t
            }), Q = function () {
                l.expired = !0, K(p.getPanelString("Error"), p.getPanelString("This dev version of Typora is expired, please download and install a newer version.")).then(() => {
                    g.openExternal("https://typora.io/#download"), setTimeout(() => {
                        process.exit(1)
                    }, 1e3)
                })
            }, Z = function () {
                var e;
                ie() && !l.setting.inFirstShow && (e = y || global.devVersion, y && Math.random() < .25 || (!S || new Date - S > 36e5 * (e ? 4 : 2) || !e && V(!0, 16) <= 0) && G())
            };
            var t = null;
            const G = async function (e) {
                r = true
                if (S = new Date, null == t) return (t = v.showPanelWindow({
                    width: 525,
                    height: 420,
                    path: `page-dist/license.html?dayRemains=${V(!0)}&index=${e ? 1 : 0}&hasActivated=${r || !1}&email=${x}&license=${c}&lang=${l.setting.getUserLocale()}&needLicense=${oe() && !global.devVersion}&type=${D}&os=` + (w ? "win" : b ? "mac" : "linux"),
                    frame: !1,
                    alwaysOnTop: !C
                })).on("closed", function () {
                    t = null
                }), void setTimeout(() => {
                    t && !t.isDestroyed() && t.setAlwaysOnTop(!1)
                }, 5e3);
                t.focus()
            };
            var n = null;

            async function Y() {
                var o = (o = process.env.USER) || i(842).userInfo().username;
                switch (process.platform) {
                    case"win32":
                        return process.env.COMPUTERNAME + " | " + o + " | Windows";
                    case"darwin":
                        return new Promise(n => {
                            i(620).exec("scutil --get ComputerName", {timeout: 5e3}, (e, t) => {
                                n(!e && t ? t.toString().trim() + " | " + o + " | darwin" : i(842).hostname() + " | " + o + " | darwin")
                            })
                        });
                    default:
                        return i(842).hostname() + " | " + o + " | Linux"
                }
            }

            async function X(e) {
                try {
                    var {fingerprint: t, email: n, license: o, type: i} = E(e) || {};
                    return n && o && t ? t != await U() ? (console.log("[L] validate server return fail"), $(), !1) : (j(n, o, i), d().put("SLicense", e + "#0#" + (new Date).toLocaleDateString("en-US")), r = !0) : (console.log("[L] validate server return empty"), $(), !1)
                } catch (e) {
                    throw console.error(e.stack), new Error("WriteActivationInfoFail")
                }
            }

            const ee = e => {
                const r = "L23456789ABCDEFGHJKMNPQRSTUVWXYZ";
                if (!/^([A-Z0-9]{6}-){3}[A-Z0-9]{6}$/.exec(e)) return !1;
                var e = e.replace(/-/g, ""), t = e.substr(22);
                return !e.replace(/[L23456789ABCDEFGHJKMNPQRSTUVWXYZ]/g, "") && t == (e => {
                    for (var t = "", n = 0; n < 2; n++) {
                        for (var o = 0, i = 0; i < 16; i += 2) o += r.indexOf(e[n + i]);
                        o %= r.length, t += r[o]
                    }
                    return t
                })(e)
            }, te = (m.handle("license.machineCode", async () => {
                console.log("handle license.machineCode");
                try {
                    return await Buffer.from(JSON.stringify({
                        v: B() + "|" + l.getVersion(),
                        i: await U(),
                        l: await Y()
                    }), "utf8").toString("base64")
                } catch (e) {
                    console.error(e.stack)
                }
            }), async t => {
                r && x && c || console.error("doDeactivation on unregistered device");
                var e = (O() || {})["deviceId"];
                try {
                    await N("api/client/deactivate", {license: c, l: e, sig: _(x, await U(), c)}, !1)
                } catch (e) {
                    if (s.captureException(e, {level: "warning"}), console.log(e.stack), !t && "off" == D) return !1
                }
                return $(), !0
            }), ne = (m.handle("addLicense", async (e, {email: t, license: n, force: o}) => {
                try {
                    return await async function (e, t, n) {
                        //if (e = (e || "").replace(/^[\s\u200b ]/g, "").replace(/[\s\u200b ]$/g, ""), t = (t || "").replace(/^[\s\u200b ]/g, "").replace(/[\s\u200b ]$/g, ""), !/^[^\s@'"/\\=?]+@[^\s@'"/\\]+\.[^\s@'"/\\]+$/.test(e)) return [!1, "Please input a valid email address"];
                        //if (!ee(t)) return [!1, "Please input a valid license code"];
                        t = {
                            v: B() + "|" + l.getVersion(),
                            license: t,
                            email: e,
                            l: await Y(),
                            f: await U(),
                            u: l.setting.generateUUID(),
                            type: global.devVersion ? "dev" : "",
                            force: n
                        };

                        return await X(await Buffer.from(JSON.stringify(t), "utf8").toString("base64")) ? [!0, ""] : [!1, "Please input a valid license code"];

                        // JSON.stringify(t);
                        // try {
                        //     var o = await N("api/client/activate", t, !0);
                        //     if (JSON.stringify(o), console.log("[License] response code is " + o.code), o.code == P.SUCCESS) return await X(o.msg) ? [!0, ""] : [!1, "Please input a valid license code"];
                        //     if (o.code == P.OUT_OF_LIMIT) return n ? await X(o.msg) ? [!0, "Your license has exceeded the max devices numbers.\nThe oldest device was unregistered automatically."] : [!1, "Please input a valid license code"] : ["confirm", 'Your license has exceeded the max devices numbers.\nIf you click "Continue Activation", this device will be activated and the oldest device will be unregistered automatically.'];
                        //     if (o.code == P.INVALIDATE) return [!1, "Please input a valid license code"];
                        //     if (o.code == P.WRONG_USER) return [!1, "This license code has been used with a different email address."]
                        // } catch (e) {
                        //     return "WriteActivationInfoFail" == e.message ? (te(!0).then(() => {
                        //     }, () => {
                        //     }), [!1, "Failed to write your license to local machine"]) : e.response && e.response.code ? (console.warn("[L] error from server " + e.response.code), [!1, "Unknown Error. Please contact hi@typora.io"]) : (s.captureException(e, {level: "warning"}), console.error(e.stack), [!1, "Failed to access the license server. Please check your network or try again later."])
                        // }
                    }(t, n, o)
                } catch (e) {
                    console.error(e.stack)
                }
            }), m.handle("offlineActivation", async (e, t) => {
                try {
                    return n = t, await (await X(n) ? [!0, "", x, c] : [!1, "Please input a valid license code"])
                } catch (e) {
                    console.error(e.stack)
                }
                var n
            }), m.handle("license.show", (e, t) => {
                G(t || !1)
            }), m.handle("license.show.debug", () => {
                t && t.webContents.openDevTools()
            }), m.handle("removeLicense", async e => {
                try {
                    return await te()
                } catch (e) {
                    console.error(e.stack)
                }
                return !1
            }), () => {
                W = l.setting.get("useMirrorInCN") ? shostc || "".substring(1) : global.shost || "".substring(1)
            });
            const oe = () => !r && !y, ie = e => R && !r;
            var re;
            re = (new Date).getTime();
            const ae = "txxxx-xxxx-xxxxy".replace(/[x]/g, function (e) {
                var t = (re + 16 * Math.random()) % 16 | 0;
                return re = Math.floor(re / 16), t.toString(16)
            }), le = () => {
                f.getAllWindows().forEach(e => {
                    e.webContents.executeJavaScript(`try{document.querySelector(".${ae}").remove();}catch(e){};File.option && (File.option.hasLicense = true);File.megaMenu && File.megaMenu.forceReload();0;`)
                })
            }, se = async e => {
                await p.initDict();
                const t = `.typora-sourceview-on .${ae}{left: 170px;}.${ae} {position: fixed;bottom: 2px;z-index: 9999;left: 70px;font-size: 12px;line-height: 24px;background: rgb(120 120 120 / 30%);padding: 0 12px;color: var(--text-color);border-radius: 4px;cursor: pointer;}.pin-outline .${ae}{left:calc(var(--sidebar-width) + 70px);}`,
                    n = `if(window.File.option){File.option.hasLicense = false;File.megaMenu && File.megaMenu.forceReload();if(!document.querySelector(".${ae}")) {const pos = Math.round(Math.random() * document.body.children.length);const dom = document.createElement("DIV");dom.innerText = "${p.getPanelString("UNREGISTERED")} ×";dom.classList.add("${ae}");dom.style = "position: fixed !important;bottom: 2px !important; display: block !important; opacity: 1 !important; height: auto !important; width: auto !important; z-index: 9999 !important;";dom.setAttribute("role", "button");dom.addEventListener("click", () => {dom.remove();reqnode("electron").ipcRenderer.invoke("license.show");});document.body.insertBefore(dom, document.body.children[pos]);}};1;`;

                function o(e) {
                    e.webContents.insertCSS(t.replace(/(\{|\}|;)\n/g, "$1")), e.webContents.executeJavaScript(n.replace(/(\{|\}|;)\n/g, "$1"))
                }

                e ? o(e) : f.getAllWindows().forEach(o)
            };
            e.startL = async (e, t) => {
                console.log("start LM in devVersion=" + (global.devVersion || !1));
                try {
                    ne(), await U(), !e && t || y || (global.devVersion || !t || -1 < t.indexOf("dev") || global.compareVersion(t, "1.0.0") < 0) && (console.log("re-write InstallDate"), await M()), r || y || global.devVersion && global.PRODUCTION_MODE && (n = J(), o = new Date, i = 1656256399766, console.log("buildTime is " + i), (isNaN(i) || o - i > 240 * I) && Q(), n = +n, console.log("verInitTime is " + n), !isNaN(n) && o - n > 200 * I && Q()), (async e => {
                        console.log("[watch L]"), q(e), await H(), console.log("[watch L] hasL: " + r), Z(), A()
                    })(e)
                } catch (e) {
                    s.captureException(e)
                }
                var n, o, i;
                v.on("dom-ready", e => {
                    e = e, R && ie() && se(e)
                }), v.on("make-window", e => {
                    Z()
                })
            }, e.showLicensePanel = G, e.showWelcomePanel = async function () {
            }, e.showLicensePanel = G, e.showWelcomePanel = async function () {
                if (S = new Date, null == n) return (n = v.showPanelWindow({
                    width: 760,
                    height: 460,
                    path: "page-dist/welcome.html?lang=" + l.setting.getUserLocale(),
                    frame: !1,
                    alwaysOnTop: !C
                })).on("closed", function () {
                    n = null
                }), void setTimeout(() => {
                    n && !n.isDestroyed() && n.setAlwaysOnTop(!1)
                }, 4e3);
                n.focus()
            }, e.shouldShowWelcomePanel = oe, e.getHasLicense = () => r, e.cannotContinueUse = function () {
                return !1 === r && !y && !global.devVersion && V(!0, 20) <= 0
            }
        }, 557: (o, i, F) => {
            var c, d, W = global.PRODUCTION_MODE, S = F(134), x = S.app, u = F(266), r = F(338), a = S.Menu,
                l = S.MenuItem, p = S.BrowserWindow, s = S.shell, D = "win32" == process.platform,
                h = "darwin" == process.platform, g = "linux" == process.platform, P = F(728),
                T = F(541).join(__dirname, "../"), m = F(344), f = F(824), w = F(156), E = F(445),
                b = require(W ? "package.json" : "../package.json"), I = F(468), y = 1e4;

            function v(t) {
                var o, i, r = 0, n = x.getPath("userData") + "/typora.log", a = "", l = console.error;

                function s(e, t) {
                    try {
                        if (y < r) return;
                        var n;
                        c || (n = t + " " + (new Date).toLocaleString() + "  " + u.format(e) + "\n", o ? (i.write(n), r++) : a += n)
                    } catch (e) {
                        console.error(e)
                    }
                }

                try {
                    F(728).ensureFile(n, function (e) {
                        try {
                            if (e) return l("failed to create log file"), void (c = !0);
                            (i = P.createWriteStream(n, {flags: "a"})).on("close", function () {
                                o = !1
                            }), a && i.write(a), o = !0, t(i)
                        } catch (e) {
                            console.error(e)
                        }
                    }), console.record = function (e, t) {
                        "DEBUG" == (t = t || "INFO") && global.PRODUCTION_MODE || s(e, t), I.captureBreadcrumb(e, t)
                    }, console.log = function (e) {
                        s(e, "INFO")
                    }, console.error = function (e) {
                        s(e, "ERROR")
                    }, console.debug = function (e) {
                        s(e, "DEBUG")
                    }, d = process.stdout.write, process.stdout.write = process.stderr.write = function (e) {
                        try {
                            if (y < r) return;
                            c || o && (i.write(e), r++)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            }

            function _(e) {
                var t = F(783), n = F(207), e = F(541).join(x.getPath("userData"), e);
                return t(new n(e, {
                    serialize: function (e) {
                        return str = JSON.stringify(e) || "{}", Buffer.from(str).toString("hex")
                    }, deserialize: function (e) {
                        try {
                            return e = Buffer.from(e || "", "hex").toString(), JSON.parse(e)
                        } catch (e) {
                            return {}
                        }
                    }
                }))
            }

            function e() {
                this.db, this.history, this.allThemes = [], this.config = {}, this.saveTimer = null, this.downloadingDicts = [], this.analyticsEvents = [], this.initUserConfig_(), this.prepDatabase = _, v(e => {
                    this.logStream = e
                })
            }

            function k() {
                var n = (new Date).getTime();
                return uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                    var t = (n + 16 * Math.random()) % 16 | 0;
                    return n = Math.floor(n / 16), ("x" == e ? t : 3 & t | 8).toString(16)
                })
            }

            function O(t) {
                var e = 1656256399766, n = !1, o = 0;
                isNaN(e) || (o = 30 < (e = (new Date - e) / 864e5 / 5) ? (n = !0, .001) : Math.max(0, (30 - e) / 30), isNaN(o) && (o = .01)), I.config("https://41af752e6d61480d85276af874a7f69b@sentry.typora.io/2", {
                    logger: "node",
                    release: b.releaseId,
                    autoBreadcrumbs: {http: !1, console: !1},
                    sampleRate: o,
                    shouldSendCallback: function (e) {
                        return (!e || "debug" != e.level) && (!n && !t.hasUpdates && t.db && t.get("send_usage_info") + "" != "false")
                    }
                }).install(N), C = k(), I.mergeContext({
                    tags: {
                        instance: C,
                        arch: process.platform,
                        appVersion: x.getVersion()
                    }
                }), I.disableConsoleAlerts(), setTimeout(function () {
                    console.log("[Raven] instanceKey = " + C)
                }, 0), I.setDataCallback(function (e) {
                    try {
                        return e ? (e.request && (e.request.url = "http://typora/"), e.mechanism && delete e.mechanism, e.exception && (t = e) && (t.message && (t.message = L(t.message)), (t.exception || []).forEach(function (e) {
                            e.value && (e.value = L(e.value)), e.stacktrace && e.stacktrace.frames && e.stacktrace.frames.forEach(function (e) {
                                e.filename && (e.filename = U(e.filename))
                            })
                        }), n = t.stacktrace || [], (t = (t.exception || {}).values || []).forEach && t.forEach(function (e, t) {
                            e && (e.value && (e.value = L(e.value)), e.stacktrace && e.stacktrace.frames && (n = n.concat(e.stacktrace.frames)))
                        }), n.length && n.forEach(function (e) {
                            var t;
                            -1 < (t = e.filename.lastIndexOf("atom.asar")) && (e.filename = "http://typora-app/atom/" + e.filename.substring(t + 9).replace(/\\/g, "/"))
                        })), e) : void 0
                    } catch (e) {
                        console.error(e.stack)
                    }
                    var t, n;
                    return {}
                })
            }

            e.prototype.closeLogging = function () {
                console.log("closeLogging");
                try {
                    c = !0, d && (process.stdout.write = process.stderr.write = d), this.logStream && this.logStream.end()
                } catch (e) {
                    console.error(e)
                }
            }, e.prototype.put = function (e, t) {
                this.db.getState()[e] = t, this.saveTimer && clearTimeout(this.saveTimer), this.saveTimer = setTimeout(this.save.bind(this), 500)
            }, e.prototype.get = function (e, t) {
                try {
                    return "recentDocument" == e ? this.getRecentDocuments() : "recentFolder" == e ? this.getRecentFolders() : ("framelessWindow" != e || !g) && (void 0 === (n = this.db.getState())[e] ? t : n[e]);
                    var n
                } catch (e) {
                    return console.error(e), t
                }
            }, e.prototype.save = function () {
                this.saveTimer && clearTimeout(this.saveTimer), this.saveTimer = null;
                try {
                    this.db.write()
                } catch (e) {
                    console.error(e.stack)
                }
            }, e.prototype.syncAll = function () {
                this.saveTimer && clearTimeout(this.saveTimer);
                try {
                    this.db.write(), this.history.write()
                } catch (e) {
                    console.error(e.stack)
                }
            }, e.prototype.getAllThemes = function () {
                return this.allThemes
            }, e.prototype.getRecentFolders = function () {
                var e = this.history.getState(), t = e.recentFolder;
                return t || (e.recentFolder = t = []), t || []
            }, e.prototype.addRecentFolder = function (e) {
                console.log("addRecentFolder"), e = F(541).normalize(e);
                var t = F(541).basename(e), n = this.getRecentFolders();
                if (t.length) {
                    this.removeRecentFolder(e, !0), n.unshift({
                        name: t,
                        path: e,
                        date: new Date
                    }), 8 < n.length && n.splice(8), x.addRecentDocument(e);
                    try {
                        this.history.write()
                    } catch (e) {
                    }
                    x.refreshMenu()
                }
            }, e.prototype.removeRecentFolder = function (t) {
                var e = this.history.getState().recentFolder, n = e.findIndex(function (e) {
                    return e.path == t
                });
                if (~n) {
                    e.splice(n, 1);
                    try {
                        this.history.write()
                    } catch (e) {
                    }
                    x.refreshMenu()
                }
            }, e.prototype.getRecentDocuments = function () {
                var e = this.history.getState(), t = e.recentDocument;
                return t || (e.recentDocument = t = []), t || []
            }, e.prototype.renameRecentDocuments = function (o, i) {
                if (o != i) {
                    var r = D ? "\\" : "/", e = this.get("recentDocument");
                    if (recentFolders = this.getRecentFolders(), found = !1, toDel = [], [e || [], recentFolders || []].forEach(function (e) {
                        e.forEach(function (e, t) {
                            e.path != o && 0 != e.path.indexOf(o + r) || (found = !0, i ? (e.path = i + e.path.substring(o.length), e.name = F(541).basename(e.path)) : toDel.push(t))
                        });
                        for (var t = toDel.length - 1; 0 <= t; t--) {
                            var n = toDel[t];
                            e.splice(n, 1)
                        }
                    }, this), found) try {
                        this.history.write()
                    } catch (e) {
                    }
                }
            }, e.prototype.addRecentDocument = function (e) {
                console.log("addRecentDocument");
                var t = F(541).basename(e), n = this.getRecentDocuments();
                this.removeRecentDocument(e, !0), n.unshift({
                    name: t,
                    path: e,
                    date: t.length ? +new Date : 0
                }), 40 < n.length && n.splice(40), x.addRecentDocument(F(541).normalize(e));
                try {
                    this.history.write()
                } catch (e) {
                }
                x.refreshMenu(), x.sendEvent("updateQuickOpenCache", {toAdd: e, group: "recentFiles"})
            }, e.prototype.removeRecentDocument = function (t, e) {
                var n = this.get("recentDocument"), o = n.findIndex(function (e) {
                    return e.path == t
                });
                if (~o && (n.splice(o, 1), !e)) {
                    try {
                        this.history.write()
                    } catch (e) {
                    }
                    x.refreshMenu()
                }
            }, e.prototype.clearRecentDocuments = function () {
                console.log("clearRecentDocuments");
                var e = this.history.getState();
                e.recentDocument = [], e.recentFolder = [];
                try {
                    this.history.write()
                } catch (e) {
                }
                x.clearRecentDocuments && x.clearRecentDocuments(), x.refreshMenu()
            };
            var C, t, M = global.compareVersion,
                L = (e.prototype.compareVersion = global.compareVersion, e.prototype.refreshThemeMenu = function () {
                    var n, o, e = a.getApplicationMenu().getItem("Themes");
                    null != e && (n = e.submenu, o = this.curTheme(), n.clear(), this.allThemes.map(function (e) {
                        var t = e.replace(/\.css$/, "").replace(/(^|-|_)(\w)/g, function (e, t, n, o) {
                            return (t ? " " : "") + n.toUpperCase()
                        });
                        n.append(new l({
                            label: t, type: "checkbox", checked: e == o, click: function () {
                                x.forceRefreshMenu(), x.execInAll("window.File && File.setTheme('" + e + "');"), x.setting.setCurTheme(e, t)
                            }
                        }))
                    }), h && a.setApplicationMenu(a.getApplicationMenu()))
                }, e.prototype.generateUUID = function () {
                    var e = this.get("uuid", void 0);
                    return e || (e = k(), this.put("uuid", e)), e
                }, function (e) {
                    return global.devVersion ? e : e && e.replace(/([^\\\/\s]+[\\\/]){3,}[^\s'"]+['"]*/g, "{filepath}").replace(/[^\s."'{]+\.(md|mmd|markdown|mdwn|txt|text)/g, "{filepath}")
                }), U = function (e) {
                    var t;
                    return e = -1 < (t = (e = e.replace(/\\/g, "/")).lastIndexOf("/atom")) ? "http://typora-app/atom/" + e.substring(t).replace(/^\/atom(\.asar)?\//, "") : e
                };
            e.prototype.initSetting = async function () {
                {
                    const r = F(208);
                    r.traceDeprecation = !W, r.traceProcessWarnings = !W, r.noDeprecation = !!W
                }
                O(this), this.db = _("profile.data"), this.history = _("history.data");

                function d() {
                }

                var a = x.getPath("userData") + (D ? "\\" : "/") + "themes",
                    t = this.get("version") || this.get("initialize_ver"),
                    u = (this.put("version", x.getVersion()), this.put("initialize_ver", "1.0.0"), this.setDefaultFonts_(), t || (this.put("line_ending_crlf", D), this.put("preLinebreakOnExport", !0)), this.generateUUID()),
                    n = (I.mergeContext({user: {id: u}}), setTimeout(function () {
                        console.log("[Raven] userId = " + u)
                    }, 100), this), p = n.allThemes, e = this.curTheme(), l = F(541), h = F(232);

                function g() {
                    h.list(a, function (e, t) {
                        (t || []).forEach(function (e) {
                            e = l.basename(e);
                            /^[^\/\sA-Z]+\.css$/.exec(e) && !/\.user\.css/.exec(e) && p.push(e)
                        });
                        try {
                            n.refreshThemeMenu()
                        } catch (e) {
                            I.captureException(e)
                        }
                    }), n.get("isDarkMode") && !n.get("useSeparateDarkTheme") && (S.nativeTheme.themeSource = "dark")
                }

                var o = 0,
                    m = (t ? (o = M(x.getVersion(), t), !(i = (t.split(/\./) || [])[1] != (x.getVersion() || []).split(/\./)[1]) && M(t, "0.11.3") < 0 && (i = !0)) : o = 1, 0 != o && (console.log("launchFromDiffVersion, pre version is " + t), this.addAnalyticsEvent("updateLocation")), n.inFirstShow = !n.get("didShowWelcomePanel2"), await E.startL(o, t), n.inFirstShow && E.shouldShowWelcomePanel() && E.showWelcomePanel(), n.put("didShowWelcomePanel2", !0), T + "/style/themes"),
                    f = a + "/old-themes";
                if (t && i) {
                    {
                        console.log("cleanupOlderCache");
                        const v = x.getPath("userData");
                        await Promise.all(["blob_storage", "Cache", "Code Cache", "databases", "GPUCache", "IndexedDB", "Local Storage", "Session Storage", "shared_proto_db", "VideoDecodeStats"].concat(["Cookies", "Cookies-journal", "Network Persistent State", "Preferences", "QuotaManager", "QuotaManager-journal", "TransportSecurity"]).map(t => new Promise(e => {
                            P.rm(l.join(v, t), {force: !0, recursive: !0, maxRetries: 1}, e)
                        })))
                    }
                    await 0
                }
                if (0 == o && P.existsSync(a)) g(); else {
                    console.log("overwriteThemeFolder"), P.ensureDirSync(f);
                    var w = [];
                    if (-1 < ["github.css", "newsprint.css", "night.css", "pixyll.css", "white.css"].indexOf(e)) {
                        try {
                            P.renameSync(l.join(a, e), l.join(f, e)), w.push(e)
                        } catch (e) {
                        }
                        P.copySync(l.join(m, e), l.join(a, e), {overwrite: !0})
                    }
                    h.list(m, function (e, t) {
                        Promise.all(t.map(function (e) {
                            var r = l.basename(e);
                            return new Promise(function (e, t) {
                                if (-1 < w.indexOf(r)) return e();
                                var n = l.join(m, r), o = l.join(a, r), i = l.join(f, r);
                                P.rename(o, i, function () {
                                    P.copy(n, o, function () {
                                        e()
                                    })
                                })
                            })
                        })).then(function () {
                            g()
                        })
                    })
                }
                if (0 != o) {
                    var b = {overwrite: !0},
                        y = (P.copy(T + "/conf.default.json", x.getPath("userData") + "/conf/conf.default.json", b, d), x.getPath("userData") + "/conf/conf.user.json");
                    if (P.exists(y, function (e) {
                        e && "0.9.5" != t || P.copy(T + "/conf.default.json", y, b, d)
                    }), t) {
                        if (M(t, "0.10.11") <= 0) this.put("noHintForOpenLink", !0); else if (M(t, "0.11.17") <= 0) {
                            var i = "el";
                            const k = x.getPath("userData"), s = F(541), c = s.join(k, "typora-dictionaries"),
                                C = F(833);
                            C.rm(s.join(c, i + ".dic"), {force: !0}, () => {
                            }), C.rm(s.join(c, i + ".aff"), {force: !0}, () => {
                            }), C.rm(s.join(c, i + "-LICENSE"), {force: !0}, () => {
                            }), console.log(`remove ${c}/${i}.dic`)
                        }
                    } else this.put("strict_mode", !0), this.put("copy_markdown_by_default", !0)
                }
                this.initDictionary_(), this.addAnalyticsEvent("launch"), t && 0 != o ? this.addAnalyticsEvent(0 < o ? "upgradeApp" : "downgradeApp", {
                    change: t + " → " + x.getVersion(),
                    to: x.getVersion()
                }) : this.addAnalyticsEvent("newInstall")
            }, e.prototype.addAnalyticsEvent = function (e, t) {
                this.analyticsEvents.push([e, t = t || {}])
            }, e.prototype.initUserConfig_ = function () {
                var e, t = x.getPath("userData") + "/conf/conf.user.json";
                try {
                    e = P.readFileSync(t, "utf8"), this.config = e ? r.parse(e.replace(/[\u200b]/g, "")) : {}
                } catch (e) {
                    "ENOENT" !== e.code && (console.warn("[warn] " + e.message, e.stack), console.warn("[warn] cannot parse user config, use the default one")), this.config = {}
                }
                if (this.config.flags && this.config.flags.length) try {
                    this.config.flags.forEach(function (e) {
                        e.length && (console.log("--" + e.join(" ")), x.commandLine.appendSwitch.apply(null, e), "disable-gpu" == e.join("") && (console.log("Disable GPU Acceleration"), x.disableHardwareAcceleration()))
                    })
                } catch (e) {
                    console.error(e.stack)
                }
            }, e.prototype.setDefaultFonts_ = function () {
                "zh-Hans" == this.getUserLocale() && (this.config.defaultFontFamily = this.config.defaultFontFamily || {}, D ? (this.config.defaultFontFamily.standard = this.config.defaultFontFamily.standard || "微软雅黑", this.config.defaultFontFamily.standard = this.config.defaultFontFamily.sansSerif || "微软雅黑") : g && (this.config.defaultFontFamily.standard = this.config.defaultFontFamily.standard || "Noto Serif CJK SC", this.config.defaultFontFamily.standard = this.config.defaultFontFamily.sansSerif || "Noto Sans CJK SC", this.config.defaultFontFamily.standard = this.config.defaultFontFamily.serif || "Noto Serif CJK SC"))
            }, e.prototype.getUserLocale = function () {
                if ((t = t || this.get("userLanguage", "auto")) && "auto" != t || (t = x.getLocale()), !/^ar/.exec(t)) {
                    switch (t) {
                        case"zh-CN":
                        case"zh-Hans":
                            t = "zh-Hans";
                            break;
                        case"zh-TW":
                        case"zh-Hant":
                            t = "zh-Hant";
                            break;
                        case"it":
                        case"it-IT":
                        case"it-CH":
                            t = "it-IT";
                            break;
                        case"nl":
                        case"nl-NL":
                            t = "nl-NL";
                            break;
                        case"hu":
                        case"hu-HU":
                            t = "hu-HU";
                            break;
                        case"pl":
                        case"pl-PL":
                            t = "pl-PL";
                            break;
                        case"pt":
                        case"pt-PT":
                            t = "pt-PT";
                            break;
                        case"pt-BR":
                            t = "pt-BR";
                            break;
                        case"ko":
                        case"ko-KR":
                            t = "ko-KR";
                            break;
                        case"es-ES":
                        case"es":
                        case"es-419":
                            t = "es-ES";
                            break;
                        case"el":
                        case"el-CY":
                        case"el-GR":
                            t = "el-GR";
                            break;
                        case"fr":
                        case"fr-FR":
                        case"fr-CH":
                        case"fr-CA":
                            t = "fr-FR";
                            break;
                        case"hr":
                        case"hr-HR":
                            t = "hr-HR";
                            break;
                        case"sk":
                        case"sk-SK":
                            t = "sk-SK";
                            break;
                        case"sl":
                        case"sl-SI":
                            t = "sl-SI";
                            break;
                        case"sv":
                        case"sv-SE":
                            t = "sv-SE";
                            break;
                        case"de":
                        case"de-AT":
                        case"de-DE":
                            t = "de-DE";
                            break;
                        case"de-CH":
                            t = "de-CH";
                            break;
                        case"ru":
                        case"ru-RU":
                            t = "ru-RU";
                            break;
                        case"ja":
                        case"ja-JP":
                            t = "ja-JP";
                            break;
                        case"cs":
                        case"cs-CZ":
                            t = "cs-CZ";
                            break;
                        case"gl":
                        case"gl-ES":
                            t = "gl-ES";
                            break;
                        case"id":
                        case"id-ID":
                            t = "id-ID";
                            break;
                        case"vi":
                        case"vi-VN":
                            t = "vi-VN";
                            break;
                        case"ca":
                        case"ca-ES":
                            t = "ca-ES";
                            break;
                        case"hi":
                        case"hi-IN":
                            t = "hi-IN";
                            break;
                        case"da":
                        case"da-DK":
                        case"da-GL":
                            t = "da-DK";
                            break;
                        case"uk":
                        case"uk-UA":
                            t = "uk-UA";
                            break;
                        case"fa":
                        case"fa-AF":
                        case"fa-IR":
                            t = "fa-IR";
                            break;
                        case"tr":
                        case"tr-CY":
                        case"tr-TR":
                            t = "tr-TR";
                            break;
                        case"he":
                        case"he-IL":
                            t = "he-IL";
                            break;
                        case"ro":
                        case"ro-RO":
                            t = "ro-RO";
                            break;
                        case"ms":
                        case"ms-MY":
                        case"ms-Latn":
                        case"ms-Latn-MY":
                            t = "ms-MY";
                            break;
                        default:
                            t = "Base"
                    }
                    return t
                }
                t = "ar-SA"
            }, e.prototype.getLocaleFolder = function (e) {
                return e = e || "Front", "locales/" + this.getUserLocale() + ".lproj/" + e + ".json"
            };
            const R = [{name: "Word (.docx)", type: "docx", key: "docx"}, {
                name: "OpenOffice",
                type: "odt",
                key: "odt"
            }, {name: "RTF", type: "rtf", key: "rtf"}, {name: "Epub", type: "epub", key: "epub"}, {
                name: "LaTeX",
                type: "latex",
                key: "latex"
            }, {name: "Media Wiki", type: "wiki", key: "wiki"}, {
                name: "reStructuredText",
                type: "rst",
                key: "rst"
            }, {name: "Textile", type: "textile", key: "textile"}, {name: "OPML", type: "opml", key: "opml"}];
            e.prototype.loadCustomExports = function () {
                return x.setting.get("customExport") || R
            }, e.prototype.exportSettingFor = function (e) {
                var t = x.setting.get("export.general") || {}, n = {type: e};
                return Object.assign(n, t, x.setting.get("export." + e) || {}), n
            }, x.setting = new e;
            var A, n = F(134).ipcMain, B = (n.on("sendLog", function (e, t) {
                    console.log("[RenderProcess " + e.sender.id + "][Log] " + t)
                }), n.handle("setting.loadExports", () => {
                    var t = x.setting.get("export.general") || {}, n = {},
                        o = (["pdf", "html", "html-plain", "image"].forEach(e => {
                            n[e] = Object.assign({type: e}, t, x.setting.get("export." + e) || {})
                        }), {});
                    return x.setting.loadCustomExports().forEach(e => {
                        o[e.key] = Object.assign({}, t, e, x.setting.get("export." + e.key) || {})
                    }), JSON.stringify([n, o])
                }), n.handle("export.recordLastExport", (e, t) => {
                    A || (x.updateMenu({"File→Export→Export with Previous": {enabled: !0}}), x.updateMenu({"File→Export→Export and Overwrite with Previous": {enabled: !0}})), A = t, x.setting.lastExport = t, x.execInAll("File.option._lastExport = " + JSON.stringify(t))
                }), n.handle("setting.getDownloadingDicts", e => JSON.stringify(x.setting.downloadingDicts || [])), n.handle("setting.getUserDictionaryPath", e => x.setting.getUserDictionaryPath()), n.handle("setting.getUserDict", e => JSON.stringify(x.setting.userDict)), n.handle("setting.downloadDict", (e, t) => {
                    e = p.fromWebContents(e.sender);
                    x.setting.downloadDict(t, e.id)
                }), n.handle("setting.getThemes", e => ({
                    all: x.setting.getAllThemes() || [],
                    current: x.setting.curTheme()
                })), n.handle("setting.setCurTheme", (e, t, n) => {
                    x.setting.setCurTheme(t, n)
                }), n.handle("setting.loadExportSettings", e => JSON.stringify(x.setting.loadExportSettings())), n.handle("setting.resetAdvancedSettings", (e, t) => {
                    function n() {
                    }

                    var o = F(728), i = x.getPath("userData") + "/conf/conf.user.json";
                    o.copy(T + "/conf.default.json", x.getPath("userData") + "/conf/conf.default.json", {overwrite: !0}, t ? function () {
                        S.shell.showItemInFolder(i)
                    } : n), o.copy(T + "/conf.default.json", i, {overwrite: !0}, n)
                }), n.handle("logger.error", function (e, t) {
                    console.log("[RenderProcess " + e.sender.id + "][Error] " + t)
                }), n.handle("logger.warn", function (e, t) {
                    console.log("[RenderProcess " + e.sender.id + "][Warn] " + t)
                }), n.handle("setting.clearRecentDocuments", e => {
                    x.setting.clearRecentDocuments()
                }), n.handle("setting.removeRecentFolder", (e, t) => {
                    x.setting.removeRecentFolder(t)
                }), n.handle("setting.removeRecentDocument", (e, t) => {
                    x.setting.removeRecentDocument(t)
                }), n.handle("setting.addRecentFolder", (e, t) => {
                    x.setting.addRecentFolder(t)
                }), n.handle("setting.getRecentFiles", e => JSON.stringify({
                    files: x.setting.getRecentDocuments() || [],
                    folders: x.setting.getRecentFolders() || []
                })), n.handle("setting.put", (e, t, n) => {
                    x.setting.put(t, n)
                }), n.handle("setting.get", (e, t) => x.setting.get(t)), n.handle("setting.fetchAnalytics", e => {
                    var t = JSON.stringify(x.setting.analyticsEvents);
                    return x.setting.analyticsEvents = [], t
                }), null),
                N = (n.handle("setting.getUnsavedDraftsPath", e => x.setting.getUnsavedDraftPath()), e.prototype.getUnsavedDraftPath = function () {
                    return B ? Promise.resolve(B) : (B = F(541).resolve(x.getPath("userData"), "draftsRecover"), F(728).ensureDir(B).then(() => B))
                }, function (e, t, n) {
                    t && console.info(t.stack || t.message), e = e || {}, console.error(e.stack || e.message), !x.isReady() || "ENOTFOUND" != (t = e.errno || e.code) && "ETIMEDOUT" != t && "ECONNRESET" != t && 0 != (e.message || "").indexOf("net::ERR") && (dialog = F(134).dialog, stack = null != (ref = e.stack) ? ref : e.name + ": " + e.message, message = "Uncaught Exception:\n" + stack, dialog.showMessageBox(null, {
                        type: "error",
                        buttons: ["OK", "Learn Data Recovery"],
                        defaultId: 0,
                        cancelId: 0,
                        title: "A JavaScript error occurred in the main process",
                        message: message
                    }).then(({response: e}) => {
                        1 == e ? (e = x.setting.get("useMirrorInCN") ? "typoraio.cn" : "typora.io", s.openExternal(`https://support.${e}/Version-Control/`)) : process.exit(1)
                    }))
                });

            function z(t, n) {
                p.getAllWindows().forEach(function (e) {
                    e.isDestroyed() || e.webContents.isDestroyed() || e.webContents.isLoading() || e.webContents.send(t, n)
                })
            }

            function J(e, t) {
                t = e.indexOf(t);
                -1 < t && e.splice(t, 1)
            }

            process.on("unhandledRejection", function (e) {
                e && ("ENOTFOUND" == e.errno || "ETIMEDOUT" == e.errno || "ECONNRESET" == e.errno) || (I.captureException(e, {
                    level: "debug",
                    tags: {category: "unhandledRejection"}
                }), console.error("unhandledRejection " + e.stack))
            }), e.prototype.getUserDictionaryPath = function () {
                return this.userDictionaryPath
            }, e.prototype.downloadDict = function (n, e) {
                var o, i = F(554).download, r = p.fromId(e), a = "https://dict.typora.io/",
                    l = (z("dict-download-start", n), this.userDictionaryPath), s = this.downloadingDicts;
                -1 < s.indexOf(n) || (o = function (e, t) {
                    z("dict-download-err", {
                        locale: e,
                        message: t.message
                    }), P.unlink(l + "/_" + e + ".dic", function () {
                    }), P.unlink(l + "/_" + e + ".aff", function () {
                    }), J(s, e)
                }, s.push(n), Promise.all(["dic", "aff"].map(function (t) {
                    return console.record("[downloadDict] downloading " + (a + n + "/index." + t)), i(r, a + n + "/index." + t, {
                        directory: l,
                        filename: "_" + n + "." + t,
                        saveAs: !1,
                        showBadge: !1,
                        onCancel: function () {
                            o(n, {message: "Dowbload Cancelled"})
                        },
                        onProgress: function (e) {
                            try {
                                z("dict-download-process", {locale: n, type: t, process: e.percent})
                            } catch (e) {
                                console.error(e)
                            }
                        }
                    })
                }, this)).then(function () {
                    Promise.all([n + ".dic", n + ".aff"].map(function (e) {
                        return P.move(l + "/_" + e, l + "/" + e.replace(/-/, "_"), {overwrite: !0})
                    })).then(function () {
                        J(s, n), z("dict-download-end", n)
                    }).catch(function (e) {
                        o(n, e)
                    })
                }).catch(function (e) {
                    o(n, e)
                }), i(r, a + n + "/LICENSE", {
                    directory: this.userDictionaryPath,
                    filename: n + "-LICENSE",
                    saveAs: !1,
                    showBadge: !1
                }))
            };
            e.prototype.initDictionary_ = async function () {
                var e, o = this;
                this.userDictionaryPath = null, this.userDict = {};
                try {
                    var t = function () {
                        var e = F(541),
                            t = e.join(T, "node_modules", "spellchecker", "vendor", "hunspell_dictionaries");
                        try {
                            var n = t.replace(".asar" + e.sep, ".asar.unpacked" + e.sep);
                            F(833).statSyncNoException(n) && (t = n)
                        } catch (e) {
                        }
                        return t
                    }(), n = x.getPath("userData"), i = F(541).join(n, "typora-dictionaries");
                    if (o.userDictionaryPath = i, await P.pathExists(i)) z("dict-loaded", i); else try {
                        await P.copy(t, i), I.captureBreadcrumb("copy userDictionaryPath"), z("dict-loaded", i)
                    } catch (e) {
                        F(728).ensureDir(i).then(() => {
                        }, () => {
                        }), console.error(e), I.captureException(e)
                    }
                } catch (e) {
                    console.error(e), I.captureException(e)
                }
                try {
                    o.userDictionaryPath ? (e = await P.readFile(this.userDictionaryPath + "/user-dict.json", "utf8"), o.userDict = JSON.parse(e)) : console.error("no userDictionaryPath found")
                } catch (e) {
                    console.warn(e)
                }

                function r() {
                    o.userDictionaryPath && F(833).writeFile(o.userDictionaryPath + "/user-dict.json", JSON.stringify(o.userDict), function () {
                    }), x.sendEvent("user-dict-update", o.userDict)
                }

                n = S.ipcMain;
                n.on("user-dict-add", function (e, t) {
                    var {lang: t, word: n} = t;
                    o.userDict[t] = o.userDict[t] || [], -1 == o.userDict[t].indexOf(n) && o.userDict[t].push(n), r()
                }), n.on("user-dict-remove", function (e, t) {
                    o.userDict[t.lang] = (o.userDict[t.lang] || []).filter(function (e) {
                        return e != t.word
                    }), r()
                })
            }, e.prototype.buildOption = function () {
                var t = {},
                    e = (t.enableInlineMath = this.get("enable_inline_math") || !1, t.enableHighlight = this.get("enable_highlight") || !1, t.enableSubscript = this.get("enable_subscript") || !1, t.enableSuperscript = this.get("enable_superscript") || !1, t.enableDiagram = 0 != this.get("enable_diagram"), t.copyMarkdownByDefault = this.get("copy_markdown_by_default") || !1, t.showLineNumbersForFence = this.get("show_line_numbers_for_fence") || !1, t.noPairingMatch = this.get("no_pairing_match") || !1, t.autoPairExtendSymbol = this.get("match_pari_markdown") || !1, t.expandSimpleBlock = this.get("auto_expand_block") || !1, t.headingStyle = this.get("heading_style") || 0, t.ulStyle = this.get("ul_style") || 0, t.olStyle = this.get("ol_style") || 0, t.scrollWithCursor = !this.get("no_mid_caret"), t.autoNumberingForMath = this.get("auto_numbering_for_math"), t.allowPhysicsConflict = this.get("allowPhysicsConflict"), t.noDisplayLinesInMath = this.get("noDisplayLinesInMath"), t.useRelativePathForImg = this.get("use_relative_path_for_img") || !1, t.allowImageUpload = this.get("allow_image_upload") || !1, t.defaultImageStorage = this.get("image_save_location") || null, "custom" == t.defaultImageStorage && (t.defaultImageStorage = this.get("custom_image_save_location")), t.applyImageMoveForWeb = this.get("apply_image_move_for_web") || !1, t.applyImageMoveForLocal = !this.get("no_image_move_for_local"), t.preferCRLF = this.get("line_ending_crlf") || !1, t.sidebarTab = this.get("sidebar_tab") || "", t.useTreeStyle = this.get("useTreeStyle") || !1, t.sortType = this.get("file_sort_type") || 0, t.strictMarkdown = this.get("strict_mode") || !1, t.noLineWrapping = this.get("no_line_wrapping") || !1, t.prettyIndent = this.get("prettyIndent") || !1, t.convertSmartOnRender = this.get("SmartyPantsOnRendering"), t.smartDash = this.get("smartDash"), t.smartQuote = this.get("smartQuote"), t.twoHyphensToEm = this.get("twoHyphensToEm") || !1, t.remapUnicodePunctuation = this.get("remapPunctuation"), t.indentSize = this.get("indentSize") || 2, t.codeIndentSize = this.get("codeIndentSize") || 4, t.enableAutoSave = this.get("enableAutoSave") || !1, t.saveFileOnSwitch = this.get("save_file_on_switch") || !1, t.presetSpellCheck = this.get("preset_spell_check") || "auto", t.autoCorrectMisspell = !1, this.config || {});
                t.monocolorEmoji = e.monocolorEmoji, t.userQuotesArray = this.get("userQuotesArray"), t.passiveEvents = !0, t.canCollapseOutlinePanel = this.get("can_collapse_outline_panel"), t.preLinebreakOnExport = this.get("preLinebreakOnExport"), t.preLinebreakOnExport = 1 == t.preLinebreakOnExport || "true" == t.preLinebreakOnExport, t.indentFirstLine = this.get("indentFirstLine"), t.hideBrAndLineBreak = this.get("hideBrAndLineBreak"), t.isFocusMode = this.get("isFocusMode"), t.isTypeWriterMode = this.get("isTypeWriterMode"), t.ignoreLineBreak = this.get("ignoreLineBreak") || !1, t.sendAnonymousUsage = this.get("send_usage_info"), t.useMirrorInCN = this.get("useMirrorInCN"), void 0 !== t.sendAnonymousUsage && null !== t.sendAnonymousUsage || (t.sendAnonymousUsage = !0), t.uuid = this.get("uuid"), t.appVersion = x.getVersion(), t.instance = C, t.devVersion = global.devVersion, t.hasLicense = E.getHasLicense(), t.userLocale = this.getUserLocale(), t.appLocale = x.getLocale(), t.sidebarWidth = this.get("sidebar-width"), t.caseSensitive = this.get("caseSensitive"), t.wholeWord = this.get("wholeWord"), t.useRegexp = this.get("useRegexp"), t.fileSearchCaseSensitive = this.get("fileSearchCaseSensitive"), t.fileSearchWholeWord = this.get("fileSearchWholeWord"), t.fileSearchUseRegexp = this.get("fileSearchUseRegexp"), t.wordCountDelimiter = this.get("wordCountDelimiter") || 0;
                try {
                    t.userPath = x.getPath("home") || ""
                } catch (e) {
                    t.userPath = (D ? process.env.USERPROFILE : "") || ""
                }
                t.mainPath = global.addonPath || "", t.userDataPath = x.getPath("userData") || "", t.tempPath = x.getPath("temp"), 0 < t.tempPath.indexOf("~") && D && (t.tempPath = t.userPath + "\\AppData\\Local\\Temp"), this.tempPath = t.tempPath, t.dirname = T;
                try {
                    t.documentsPath = x.getPath("documents")
                } catch (e) {
                    t.documentsPath = ""
                }
                return t.curTheme = this.curTheme(), t.useCustomFontSize = this.get("useCustomFontSize"), t.customFontSize = this.get("customFontSize"), t.expandFolders = this.get("not_group_by_folders"), t.framelessWindow = this.get("framelessWindow"), t.showStatusBar = !1 !== this.get("showStatusBar"), t.customWordsPerMinute = this.get("customWordsPerMinute"), t.customWordsPerMinute ? t.wordsPerMinute = this.get("wordsPerMinute") || 382 : t.wordsPerMinute = 382, t.maxFetchCountOnFileList = e.maxFetchCountOnFileList || 200, t.autoSaveTimer = e.autoSaveTimer || 3, t.autoHideMenuBar = e.autoHideMenuBar, t.searchService = e.searchService, t.zoomFactor = this.get("zoomFactor") || 1, t.noMagnification = this.get("noMagnification"), t.autoEscapeImageURL = this.get("autoEscapeImageURL") || !1, t.moveColLeftKey = (m.getKeyAccelerator("Move Column Left", "Alt+Left") || "").toLowerCase(), t.moveColRightKey = (m.getKeyAccelerator("Move Column Right", "Alt+Right") || "").toLowerCase(), t.moveRowUpKey = (m.getKeyAccelerator("Move Row Up", "Alt+Up") || "").toLowerCase(), t.moveRowDownKey = (m.getKeyAccelerator("Move Row Down", "Alt+Down") || "").toLowerCase(), t.mathFormatOnCopy = this.get("mathFormatOnCopy") || "svg", t.imageUploader = this.get("image_uploader"), t.customImageUploader = this.get("custom_image_uploader"), t.picgoAppPath = this.get("picgo_app_path"), t.noWarnigUploadDisabled = this.get("noWarnigUploadDisabled") || !1, t.noWarnigForMoveFile = this.get("noWarnigForMoveFile") || !1, t.noWarnigForMoveFileToList = this.get("noWarnigForMoveFileToList") || !1, t.noWarnigForDeleteFile = this.get("noWarnigForDeleteFile") || !1, t.noWarnigForTypeWriterMode = this.get("noWarnigForTypeWriterMode") || !1, t.noHintForOpenLink = this.get("noHintForOpenLink") || !1, t.noHintForUnibody = this.get("noHintForUnibody") || !1, t.noWarnigForFocusMode = this.get("noWarnigForFocusMode") || !1, t.noWarningForExportOverwrite = this.get("noWarningForExportOverwrite") || !1, t.noWarningForUpdateImageReference = this.get("noWarningForUpdateImageReference") || !1, t.hasUpdates = this.hasUpdates || !1, t.pandocPath = this.get("pandocPath") || "", t.buildTime = 1656256399766, t.debug = this.get("debug"), t._lastExport = A, t.lineWiseCopyCut = this.get("lineWiseCopyCut") || !1, t
            }, e.prototype.extraOption = function () {
                var t = this.buildOption();
                return t.restoreWhenLaunch = this.get("restoreWhenLaunch") || 0, t.pinFolder = this.get("pinFolder"), t.enable_inline_math = t.enableInlineMath, t.enable_highlight = t.enableHighlight, t.enable_subscript = t.enableSubscript, t.enable_superscript = t.enableSuperscript, t.enableDiagram = 0 != this.get("enable_diagram"), t.enable_diagram = t.enableDiagram, t.copy_markdown_by_default = !!this.get("copy_markdown_by_default"), t.show_line_numbers_for_fence = !!this.get("show_line_numbers_for_fence"), t.no_pairing_match = !!this.get("no_pairing_match"), t.match_pari_markdown = !!this.get("match_pari_markdown"), t.auto_expand_block = !!this.get("auto_expand_block"), t.heading_style = this.get("heading_style") || 0, t.ul_style = this.get("ul_style") || 0, t.ol_style = this.get("ol_style") || 0, t.no_mid_caret = this.get("no_mid_caret"), t.auto_numbering_for_math = this.get("auto_numbering_for_math"), t.use_relative_path_for_img = this.get("use_relative_path_for_img"), t.allow_image_upload = this.get("allow_image_upload"), t.image_save_location = this.get("image_save_location"), t.custom_image_save_location = this.get("custom_image_save_location"), t.apply_image_move_for_web = this.get("apply_image_move_for_web"), t.no_image_move_for_local = this.get("no_image_move_for_local"), t.line_ending_crlf = this.get("line_ending_crlf"), t.strict_mode = this.get("strict_mode"), t.no_line_wrapping = this.get("no_line_wrapping"), t.prettyIndent = this.get("prettyIndent"), t.SmartyPantsOnRendering = this.get("SmartyPantsOnRendering"), t.remapPunctuation = this.get("remapPunctuation"), t.save_file_on_switch = this.get("save_file_on_switch") || !1, t.preset_spell_check = this.get("preset_spell_check") || "auto", t.can_collapse_outline_panel = this.get("can_collapse_outline_panel"), t.send_usage_info = !1 !== this.get("send_usage_info"), t.currentThemeFolder = x.getPath("userData") + (D ? "\\" : "/") + "themes", t.enableAutoUpdate = !1 !== this.get("enableAutoUpdate"), t.autoUpdateToDev = this.get("autoUpdateToDev"), t.userLanguage = this.get("userLanguage"), t.image_uploader = this.get("image_uploader"), t.custom_image_uploader = this.get("custom_image_uploader"), t.picgo_app_path = this.get("picgo_app_path"), t.allThemes = this.allThemes, t.useSeparateDarkTheme = this.get("useSeparateDarkTheme") || !1, t.theme = this.get("theme") || "github.css", t.darkTheme = this.get("darkTheme") || "night.css", t.customExport = this.get("customExport"), ["general", "pdf", "html", "html-plain", "image"].forEach(e => {
                    t["export." + e] = this.get("export." + e)
                }), (t.customExport || R).forEach(e => {
                    t["export." + e.key] = this.get("export." + e.key)
                }), t
            }, n.handle("setting.getExtraOption", e => JSON.stringify(x.setting.extraOption())), n.handle("setting.doDownloadPicgo", e => {
                x.setting.doDownloadPicgo()
            }), n.handle("setting.getKeyBinding", e => x.setting.config.keyBinding || {}), e.prototype.doDownloadPicgo = function () {
                w.initDict().then(function () {
                    var e = "https://github.com/typora/PicGo-cli/releases/download/latest/%@.zip".replace("%@", D ? "x64" == process.arch ? "win64" : "win32" : "linux");
                    console.log(e);
                    let n = F(541).normalize(x.getPath("userData") + "/picgo"), o = F(541).normalize(n + "/_picgo.zip");
                    var i = new f(e, o, {
                        title: w.getPanelString("Download"),
                        text: w.getPanelString("Downloading…"),
                        processOnComplete: .9
                    });
                    i.onSuccess = (e, t) => {
                        F(834)(o, {dir: n}, function (e) {
                            t.value = 1, t.text = w.getPanelString("Finished"), t.detail = "", setTimeout(() => {
                                i.setCompleted()
                            }, 2e3), P.unlink(o, () => {
                            })
                        }), t.detail = w.getPanelString("Unzipping…")
                    }, i.onError = e => {
                        S.dialog.showErrorBox(w.getPanelString("Download"), e.message)
                    }, i.download()
                })
            };
            var V = null;
            e.prototype.useDarkTheme = function () {
                return V = S.nativeTheme.shouldUseDarkColors && this.get("useSeparateDarkTheme")
            }, e.prototype.useDarkThemeBefore = function () {
                return V
            }, e.prototype.curTheme = function () {
                return this.useDarkTheme() ? this.get("darkTheme") || "night.css" : this.get("theme") || "github.css"
            }, e.prototype.setCurTheme = function (e, t) {
                return a.getApplicationMenu().getItem("Themes").submenu.items.map(function (e) {
                    e.checked = e.label == t
                }), this.useDarkTheme() ? this.put("darkTheme", e) : this.put("theme", e)
            }, o.exports = e
        }, 587: (o, e, t) => {
            var u, p = t(134), h = p.app, n = p.ipcMain, g = p.BrowserWindow, m = (t(445), t(468)),
                f = (process.platform, "linux" == process.platform), w = t(541).join(__dirname, "../");
            n.handle("window.setTitle", (e, t, n) => {
                e = g.fromWebContents(e.sender);
                t = t || ("Typora" === (t = e.getTitle()) ? "Untitled" + (n ? "• - Typora" : " - Typora") : t.replace(/•? - Typora$/, n ? "• - Typora" : " - Typora")), e.setTitle(t)
            }), n.handle("window.focus", e => {
                e = g.fromWebContents(e.sender);
                return e.focus(), e.webContents.focus(), !0
            }), n.handle("window.setInSourceMode", (e, t) => {
                g.fromWebContents(e.sender).inSourceMode = !!t
            }), n.handle("window.minimize", e => {
                g.fromWebContents(e.sender).minimize()
            }), n.handle("window.close", e => {
                g.fromWebContents(e.sender).close()
            }), n.handle("window.restore", e => {
                e = g.fromWebContents(e.sender);
                e.unmaximize(), e.setFullScreen(!1)
            }), n.handle("window.maximize", e => {
                g.fromWebContents(e.sender).maximize()
            }), n.handle("window.fullscreen", e => {
                e = g.fromWebContents(e.sender);
                return e.setFullScreen(!0), e.isFullScreen()
            }), n.handle("window.setMenuBarVisibility", (e, t) => {
                g.fromWebContents(e.sender).setMenuBarVisibility(t)
            }), n.handle("window.pin", e => {
                g.fromWebContents(e.sender).setAlwaysOnTop(!0)
            }), n.handle("window.unpin", e => {
                g.fromWebContents(e.sender).setAlwaysOnTop(!1)
            }), n.handle("window.updateMenuForIsAlwaysOnTop", e => {
                e = {"View→Always on Top": {state: g.fromWebContents(e.sender).isAlwaysOnTop()}};
                h.updateMenu(e)
            }), n.handle("window.toggleDevTools", e => {
                e = g.fromWebContents(e.sender);
                e.webContents.isDevToolsOpened() ? e.webContents.closeDevTools() : e.webContents.openDevTools()
            }), n.handle("window.inspectElement", (e, t, n) => {
                g.fromWebContents(e.sender).inspectElement(t, n)
            }), n.handle("window.checkAsFocus", e => {
                e = g.fromWebContents(e.sender);
                e && e.isFocused && (h.currentFocusWindowId = e.id)
            }), n.handle("controller.switchFolder", (e, t) => {
                e = g.fromWebContents(e.sender);
                h.switchFolder(t, e)
            }), n.handle("webContents.copy", e => {
                g.fromWebContents(e.sender).webContents.copy()
            }), n.handle("webContents.cut", e => {
                g.fromWebContents(e.sender).webContents.cut()
            }), n.handle("webContents.paste", e => {
                g.fromWebContents(e.sender).webContents.paste()
            }), n.handle("webContents.selectAll", e => {
                g.fromWebContents(e.sender).webContents.selectAll()
            }), n.handle("webContents.undo", (e, t) => {
                g.fromWebContents(e.sender).webContents.undo()
            }), n.handle("webContents.redo", (e, t) => {
                g.fromWebContents(e.sender).webContents.redo()
            }), n.handle("webContents.clearCache", (e, t) => {
                var n = g.fromWebContents(e.sender);
                return new Promise(e => {
                    n.webContents.session.clearCache(e)
                })
            }), n.handle("webContents.action", (e, t) => {
                g.fromWebContents(e.sender).webContents[t]()
            }), e.makeWindow = (d, e) => {
                var t = h.getDocumentController();
                e = e || {};
                var n, o, i = g.getFocusedWindow(), r = h.setting.config || {}, a = t.lastClosedBounds,
                    l = (i = i && !t.getDocumentFromWindowId(i.id) ? null : i) && i.getBounds(), s = 0,
                    l = (a || (l ? (s = i.isMaximized() || i.isFullScreen() ? 0 : 30, a = {
                        fullscreen: i.isFullScreen(),
                        maximized: i.isMaximized()
                    }, s && (a.x = l.x + s, a.y = l.y + s, a.width = l.width, a.height = l.height)) : a = u ? (s = u.fullscreen || u.maximize ? 0 : 30, {
                        x: u.x + s,
                        y: u.y - s,
                        width: u.width,
                        height: u.height,
                        fullscreen: u.fullscreen,
                        maximized: u.maximized
                    }) : {}), !a.fullscreen && a.maximized), e = {
                        x: a.x,
                        y: a.y,
                        width: a.width || 800,
                        height: a.height || 700,
                        minWidth: 400,
                        minHeight: 400,
                        frame: !h.setting.get("framelessWindow"),
                        disableAutoHideCursor: !1,
                        backgroundColor: h.setting.get("backgroundColor"),
                        webPreferences: {
                            webSecurity: !1,
                            allowRunningInsecureContent: !1,
                            plugins: !1,
                            nodeIntegration: !0,
                            enableRemoteModule: !1,
                            webviewTag: !0,
                            nodeIntegrationInWorker: !0,
                            devTools: !0,
                            images: !0,
                            directWrite: r.directWrite,
                            defaultFontFamily: r.defaultFontFamily,
                            allowDisplayingInsecureContent: !1,
                            backgroundThrottling: !1,
                            spellcheck: !1,
                            contextIsolation: !1,
                            additionalArguments: ["--tyopt=" + JSON.stringify({
                                isMaximized: l,
                                isFullScreen: a.fullscreen, ...h.setting.buildOption(), ...e
                            })]
                        },
                        autoHideMenuBar: a.fullscreen || r.autoHideMenuBar,
                        show: d,
                        fullscreen: a.fullscreen,
                        alwaysOnTop: i && i.isAlwaysOnTop(),
                        fullscreenable: !0
                    },
                    c = (f && (e.icon = w + "/assets/icon/icon_256x256.png"), r = e, i = 0 < s, s = p.screen, null != r.x && (s = (c = null == (c = s.getDisplayNearestPoint({
                        x: r.x || 0,
                        y: r.y || 0
                    })) ? s.getPrimaryDisplay() : c).workArea, r.y < s.y ? r.y = i ? s.y + s.height - r.height : s.y : r.y + r.height > s.y + s.height && (r.y = s.y + s.height - r.height), r.x < s.x ? r.x = s.x : r.x + r.width > s.x + s.width && (r.x = i ? s.x : s.x + s.width - r.width)), u = e, l && (e.show = !1), new g(e));
                return t.lastClosedBounds = null, l && (c.maximize(), d && c.show()), a.fullscreen && (c.autoHideMenuBar = !0, c.setMenuBarVisibility(!1)), c.loadURL(entry || "".substring(1)), n = c, o = p.shell, n.webContents.on("will-navigate", function (e, t) {
                    e.preventDefault(), o.openExternal(t)
                }), n.webContents.setWindowOpenHandler(e => (/^https?:/.exec(e.url) && o.openExternal(e.url), {action: "deny"})), n.webContents.on("crashed", function (e, t) {
                    console.error("render process is killed? " + t), m.captureMessage("render process crashed, killed=" + t), h.setting.addAnalyticsEvent("crashed")
                }), n.webContents.on("unresponsive", function () {
                    m.captureMessage("unresponsive", {extra: {winId: n.id}}), h.setting.addAnalyticsEvent("unresponsive")
                }), n.webContents.setMaxListeners(15), n.webContents.on("dom-ready", function () {
                    n.isMaximized() && n.webContents.executeJavaScript('document.body.classList.add("typora-maxmized");'), b("dom-ready", n)
                }), n.on("maximize", () => {
                    n.webContents.executeJavaScript('document.body.classList.add("typora-maxmized");')
                }), n.on("enter-full-screen", function () {
                    n.webContents.executeJavaScript('document.body.classList.add("typora-maxmized");document.body.classList.add("typora-fullscreen");if(document.body.classList.contains("native-window")) {$("#ty-top-placeholder").show();};1;')
                }), n.on("unmaximize", function () {
                    n.webContents.executeJavaScript('document.body.classList.remove("typora-maxmized");')
                }), n.on("session-end", function () {
                    console.log("[win] session-end"), n.webContents.executeJavaScript("if(File.backupWindow){File.backupWindow(true);File.saveAndBackup()};1;")
                }), n.on("leave-full-screen", function () {
                    n.autoHideMenuBar = !!h.setting.config.autoHideMenuBar, n.setMenuBarVisibility(!h.setting.config.autoHideMenuBar), n.webContents.executeJavaScript('document.body.classList.remove("typora-maxmized");document.body.classList.remove("typora-fullscreen");$("#ty-top-placeholder").hide();1;'), u && (u.fullscreen = !1)
                }), n.on("focus", function () {
                    n.webContents.incrementCapturerCount();
                    var e = t.getDocumentFromWindowId(n.id);
                    e && (e.setActiveWindow(n), h.focusedWindow = n)
                }), n.on("blur", () => {
                    console.log("[win] blur"), n.webContents.executeJavaScript("if(File.backupWindow){File.backupWindow(true);File.saveAndBackup()};1;")
                }), b("make-window"), c
            };
            const i = t(93);
            var r = new i;
            const b = function (e, t) {
                r.emit(e, t)
            };
            e.on = function (e, t) {
                r.on(e, t)
            }, e.showPanelWindow = function ({path: e, ...t}) {
                var n = new g({
                    modal: !0,
                    show: !1,
                    center: !0,
                    resizable: !1,
                    webPreferences: {
                        devTools: !global.releaseMode,
                        defaultFontSize: 14,
                        nodeIntegration: !0,
                        contextIsolation: !1,
                        enableRemoteModule: !1
                    }, ...t
                });
                return n.loadURL("file://" + w + "/" + e), n.once("ready-to-show", function () {
                    n.show()
                }), n.removeMenu(), f && (n.icon = w + "/assets/icon/icon_256x256.png"), n.webContents.setWindowOpenHandler(e => (p.shell.openExternal(e.url), {action: "deny"})), n
            }
        }, 90: (e, n, s) => {
            e = s.nmd(e);
            var t, i = s(541), r = s(640), a = (t = i.join(__dirname, "../"), i.join(t, "node_modules.asar")),
                l = (r.globalPaths.push(a), r.prototype.require);
            r.prototype.require = function (e) {
                return -1 == this.paths.indexOf(__dirname) && (this.paths.push(__dirname), this.paths.push(a)), /(\.node$)|(\/build\/Release)/.exec(e) && "." == e[0] && (e = i.resolve(i.dirname(this.id), e).replace(/\bnode_modules\.asar\b/, "node_modules")), l.call(this, e)
            };
            for (let e = 0; e < process.argv.length; e++) if (process.argv[e].startsWith("--inspect") || process.argv[e].startsWith("--remote-debugging-port")) throw new Error("Arguments not allowed debug in production main thread");
            global.t_workingDir = t, s.c[s.s] == e || /[\\\/]main\.node$/.exec(s.c[s.s].filename) || setTimeout(() => {
                c.exit()
            }, 1e3), s(405);
            var o = s(134), c = o.app, m = o.protocol, f = o.powerMonitor, d = o.BrowserWindow, u = s(728),
                w = "win32" == process.platform, b = (process.platform, process.platform, s(557), s(344)), y = s(883),
                r = s(932), v = s(445), p = s(351), e = o.ipcMain;
            s(468);
            if (!c.requestSingleInstanceLock()) return console.record("secondary instance would exit"), void c.quit();
            console.record("launch with argv [" + process.argv.join(", ") + "]"), c.on("second-instance", function (e, t, n) {
                console.record("got argv [" + t.join(", ") + "] from secondary instance"), t = Array.from(t), d.getAllWindows().length && ((n = S(t, n)) ? c.openFileOrFolder(n, {forceCreateWindow: !n}) : I(t || []))
            });
            var k = 1, C = 2, F = 3;

            function S(e, t) {
                null == t && (t = process.cwd());
                for (var n, o = e.length - 1; 0 <= o; o--) if ("-" != e[o][0]) {
                    n = e[o];
                    break
                }
                if ((n = 0 != o && n != t ? n : void 0) && /^file:\/\//i.exec(n)) {
                    n = n.replace(/^file:\/\//i, "");
                    try {
                        n = decodeURI(n)
                    } catch (e) {
                    }
                }
                return n ? s(541).resolve(t, n) : void 0
            }

            function x(e) {
                if (!e) return e;
                var t = e.length;
                return 50 < t ? '"' + e.substr(0, 15) + "..." + e.substr(t - 15) + '"' : e
            }

            c.backups = {}, c.removeBackup = function (e) {
                T ? c.backups[e] && (c.backups[e].hasUnsaved = !1) : delete c.backups[e]
            };
            var D, h, P, T = !(c.addBackup = function (t, e, n) {
                t.path && Object.keys(c.backups).forEach(function (e) {
                    t.path && c.backups[e].path == t.path && (n && (t = Object.assign(c.backups[e], t)), delete c.backups[e])
                }), c.backups[t.id] = t, c.syncBackups(t.id, e), t.id, t.path, x(t.content || ""), (t.content || "").length
            }), g = (c.syncBackups = function (o, i) {
                var r = c.getPath("userData") + "/backups", a = T;

                function e(e) {
                    if (e) console.record("Error on creating backup folder " + e.stack); else {
                        var t = Object.values(c.backups), n = {
                            innormalQuit: !a, windows: t.map(function (e) {
                                return {
                                    id: e.id,
                                    path: e.path,
                                    encode: e.encode,
                                    useCRLF: e.useCRLF,
                                    hasUnsaved: e.hasUnsaved,
                                    scrollPos: e.scrollPos,
                                    syncDate: e.syncDate,
                                    mountFolder: e.mountFolder
                                }
                            })
                        };
                        if (a || i) {
                            n.windows.forEach(function (e) {
                                e.hasUnsaved && (n.innormalQuit = !0)
                            }), n.windows.length || (n.windows = g.map(function (e, t) {
                                return e.id = t, e
                            }));
                            try {
                                u.writeFileSync(r + "/sum", JSON.stringify(n))
                            } catch (e) {
                                console.record("Error on saving backups " + e.stack)
                            }
                            console.record("synced recovery")
                        } else u.writeFile(r + "/sum", JSON.stringify(n), function (e) {
                            e ? console.record("Error on saving backups " + e.stack) : console.record("synced recovery")
                        });
                        void 0 === o && null === o || (t = c.backups[o]) && t.hasUnsaved && u.writeFile(r + "/" + t.id, t.content, function (e) {
                            e && console.record("Error on saving backups " + e.stack)
                        })
                    }
                }

                if (a || i) try {
                    u.ensureDirSync(r), e()
                } catch (e) {
                    console.record("Error on creating backup folder " + e.stack)
                } else u.ensureDir(r, e)
            }, []), I = (c.onCloseWin = function (e, t) {
                var n, o, i = d.fromId(e), r = c.getDocumentController(), a = r.getDocumentFromWindowId(e).path;
                n = r, o = (l = i).getBounds(), n.lastClosedBounds = n.lastClosedBounds || {}, n.lastClosedBounds.fullscreen = l.isFullScreen(), n.lastClosedBounds.maximized = l.isMaximized(), n.lastClosedBounds.fullscreen || n.lastClosedBounds.maximized || (n.lastClosedBounds.x = o.x, n.lastClosedBounds.y = o.y, n.lastClosedBounds.width = o.width, n.lastClosedBounds.height = o.height), c.setting.put("lastClosedBounds", n.lastClosedBounds), D || (D = !0, g = []), h && clearTimeout(h), h = setTimeout(function () {
                    D = !1, h = null, c.setting.save()
                }, 100);
                var l = (l = c.backups[e]) || {path: a, mountFolder: t};
                g.push(l), r.removeWindow(e).then(function () {
                    c.removeBackup(e), i.destroy()
                })
            }, e.on("addBackup", function (e, t, n, o) {
                (t = JSON.parse(t || "{}")).id = (d.fromWebContents(e.sender) || {}).id, void 0 !== t.id && c.addBackup(t, n, o)
            }), c.currentFocusWindowId = null, c.getCurrentFocusWindowId = function () {
                return c.currentFocusWindowId
            }, e.handle("app.openFile", (e, t, n) => ((n = n || {}).curWindow && (n.curWindow = d.fromWebContents(e.sender)), c.openFile(t || null, n).then(n => {
                if (n) return new Promise(e => {
                    let t = n.activeWindow.webContents;
                    t.isLoading() ? t.once("did-finish-load", function () {
                        e({winId: n.activeWindow.id})
                    }) : e({winId: n.activeWindow.id})
                })
            }))), e.handle("app.openFileOrFolder", (e, t, n) => ((n = n || {}).curWindow && (n.curWindow = d.fromWebContents(e.sender)), c.openFileOrFolder(t || null, n))), e.handle("app.openOrSwitch", (e, n, t) => {
                var o = d.fromWebContents(e.sender), i = c.documentController.getDocument(n),
                    r = c.documentController.getDocumentFromWindowId(o.id);
                return i ? ((e = i.activeWindow || i.windows.keys().next().value) && e.focus(), !1) : t ? (c.openFileOrFolder(n, {curWindow: !0}), !1) : new Promise(t => {
                    s(232).isDirectory(n, e => {
                        if (e) c.switchFolder(n, o); else if (!i) return r.rename(n), void t(!0);
                        t(!1)
                    })
                })
            }), e.handle("app.openFolder", (e, t, n) => {
                c.openFolder(t || null, n ? d.fromWebContents(e.sender) : void 0)
            }), e.handle("app.onCloseWin", (e, t) => {
                e = d.fromWebContents(e.sender);
                c.onCloseWin(e.id, t)
            }), e.handle("app.sendEvent", (e, t, n) => {
                c.sendEvent(t, n)
            }), e.handle("executeJavaScript", (e, t, n) => {
                d.fromId(t).webContents.executeJavaScript(n)
            }), c.reopenFolder = function () {
                var t = new Set, n = !1;
                return g.forEach(function (e) {
                    e.mountFolder && !t.has(e.mountFolder) && (t.add(e.mountFolder), c.openFile(null, {
                        forceCreateWindow: !0,
                        mountFolder: e.mountFolder
                    }), n = !0)
                }), n
            }, c.reopenClosed = function (o) {
                var i = !1;
                return g.length && g.forEach(function (e, t) {
                    var n = c.getDocumentController().getDocument(e.path);
                    n ? n.activeWindow && n.activeWindow.show() : (c.openFile(e.path, {
                        forceCreateWindow: !!t,
                        mountFolder: e.mountFolder,
                        silent: o,
                        backupState: e,
                        fromReopen: !0
                    }), i = !0)
                }), i
            }, function (e) {
                var t, n = c.setting.get("restoreWhenLaunch") || 0, o = !0, i = e || process.argv || [];
                -1 < i.indexOf("--new") && (n = 0), -1 < i.indexOf("--reopen-file") && (n = C);
                try {
                    n == k ? o = !c.reopenFolder() : n != C || e ? n != F || (t = c.setting.get("pinFolder")) && (c.openFile(null, {
                        forceCreateWindow: !0,
                        mountFolder: t,
                        pinFolder: t
                    }), o = !1) : o = !c.reopenClosed(!0)
                } catch (e) {
                    console.warn(e.stack)
                }
                o && c.openFileOrFolder()
            }), W = (c.recoverFromBackup = function (o) {
                async function i(e) {
                    console.record("recoverWindow " + JSON.stringify(e));
                    var t = e;
                    if (e.hasUnsaved) {
                        if (e.hasUnsaved) try {
                            var n = await u.readFile(r + "/" + e.id, "utf8");
                            console.record(`[${e.id}] recover from content ${n.length} ` + x(n)), t = n.length < 2e6 ? (e.content = n, e) : (console.record("abort recovery: file too large"), null)
                        } catch (e) {
                            console.error(e), t = null
                        }
                    } else t = null;
                    if (0 != a && t && !t.path && !t.content) return console.record("skip due to empty untitled file"), void a--;
                    c.openFile(e.path || null, {
                        forceCreateWindow: !0,
                        mountFolder: e.mountFolder,
                        backupState: t,
                        fromReopen: !0
                    })
                }

                var r = c.getPath("userData") + "/backups", a = 0;
                u.readFile(r + "/sum", "utf8", function (e, t) {
                    if (e || !t) return I();
                    try {
                        var n = JSON.parse(t);
                        g = n.windows.filter(function (e) {
                            return e.path || e.mountFolder
                        }).map(function (e) {
                            return {path: e.path, mountFolder: e.mountFolder}
                        }), n.windows = n.windows.filter(function (e) {
                            return null != e.id
                        }), a = n.windows.length - 1, o || n.windows.length && n.innormalQuit ? (console.record("launch from abnormal quit"), n.windows.forEach(i)) : I()
                    } catch (e) {
                        c.openFileOrFolder(), console.record("failed to read backup " + e.stack)
                    }
                })
            }, process.argv.forEach(e => {
                /^--/.exec(e) && ("--on-dev" == e ? process.traceDeprecation = !0 : -1 === ["--new", "--reopen-file"].indexOf(e) && c.commandLine.appendSwitch.apply(null, [e]))
            }), scheme || "".substring(3)), E = (c.on("ready", async function () {
                var e, t;
                await c.setting.initSetting(), c.expired || (p.lastClosedBounds = c.setting.get("lastClosedBounds"), console.record("------------------start------------------"), console.log("typora version: " + c.getVersion()), console.log("" + s.c[s.s].filename), L(W), c.setAppUserModelId("abnerworks.Typora"), (e = S(process.argv)) && "--on-dev" !== process.argv[process.argv.length - 1] ? c.openFileOrFolder(e) : c.recoverFromBackup(), b.loadDict().then(() => {
                    b.bindMainMenu()
                }), M(), w && (t = s(558), c.updater = t, setTimeout(function () {
                    t.initUpdater().then(function () {
                        !1 !== c.setting.get("enableAutoUpdate") && c.updater.checkForUpdates(!1)
                    })
                }, 3e3)), y.bindJumplist(), setTimeout(function () {
                    try {
                        _()
                    } catch (e) {
                        console.warn(e.stack)
                    }
                }, 3e4), f.on("suspend", () => {
                    console.record("[Power] suspend"), c.execInAll('window.onPowerChange && window.onPowerChange("suspend")')
                }), f.on("resume", () => {
                    console.record("[Power] resume"), c.execInAll('window.onPowerChange && window.onPowerChange("resume")')
                }), f.on("lock-screen", () => {
                    console.record("[Power] lock-screen"), c.execInAll('window.onPowerChange && window.onPowerChange("lock-screen")')
                }), f.on("unlock-screen", () => {
                    console.record("[Power] lock-screen"), c.execInAll('window.onPowerChange && window.onPowerChange("unlock-screen")')
                }))
            }), {}), _ = async function () {
                var r, a, l, s, n = await c.setting.getUnsavedDraftPath(), e = await u.readdir(n);
                e.length < 250 || (console.record("cleanUpExpiredDrafts"), 400 < e.length && (r = n, a = e, l = 0, s = new Date, e = await new Promise(n => {
                    var o = [], i = async function () {
                        Math.min(l + 50, a.length);
                        if (l + 1 >= a.length) n(o); else {
                            for (; l++;) {
                                if (!a[l]) return void n(o);
                                try {
                                    var e = r + "/" + a[l], t = await u.stat(e);
                                    864e6 < s - t.mtime ? u.unlink(e, function () {
                                    }) : (o.push(a[l]), E[a[l]] = t.mtime.getTime())
                                } catch (e) {
                                }
                            }
                            P = setTimeout(i, 3e4)
                        }
                    };
                    P = setTimeout(i, 1e4)
                })), e = await Promise.all(e.map(async e => {
                    try {
                        return {name: e, time: E[e] || (await u.stat(n + "/" + e)).mtime.getTime()}
                    } catch (e) {
                    }
                    return {name: e, time: 0}
                })), E = null, e.sort(function (e, t) {
                    return t.time - e.time
                }).forEach(function (e, t) {
                    150 < t && u.unlink(n + "/" + e.name, function () {
                    })
                }))
            }, O = (c.on("window-all-closed", function () {
                c.quit()
            }), c.on("before-quit", function () {
                T = !0, c.syncBackups(null, !0), console.log("----------------before-quit-----------------")
            }), e.handle("app.cancelQuit", () => {
                T = !1
            }), c.on("quit", function () {
                console.log("-----------------quit------------------"), c.setting.closeLogging()
            }), c.on("will-quit", function () {
                console.log("------------------will-quit------------------"), h && clearTimeout(h), P && clearTimeout(P), w && c.updater && c.updater.installIfNeeded(), c.setting.syncAll();
                try {
                    u.rmSync(c.getPath("userData") + "/runtime-storage", {recursive: !0, force: !0})
                } catch (e) {
                    console.error(e)
                }
                try {
                    var e = c.getPath("userData") + "/typora.log", t = c.getPath("userData") + "/typora-old.log",
                        n = u.statSync(e);
                    n && 5e5 < n.size && (u.existsSync(t) && u.unlinkSync(t), u.renameSync(e, t))
                } catch (e) {
                    console.error(e)
                }
            }), c.on("browser-window-blur", function (e, t) {
                console.log("[blur] " + t.id)
            }), c.on("browser-window-focus", function (e, t) {
                console.log("[focus] " + t.id)
            }), c.getWorkingDir = function () {
                return __dirname + "../"
            }, c.getDocumentController = function () {
                return p
            }, c.documentController = p, c.openFolder = function (e, t) {
                if (t) {
                    var n = p.getDocumentFromWindowId(t.id);
                    if (n && !n.path) return c.switchFolder(e, t), Promise.resolve()
                }
                return c.setting.addAnalyticsEvent("openFolder"), c.openFile(null, {mountFolder: e, showSidebar: !0})
            }, c.switchFolder = function (e, t, n, o) {
                var i;
                if ("string" == typeof (n = n || !1) && (n = JSON.stringify(n)), t = t || d.getFocusedWindow()) return i = "File.option && (File.option.pinFolder = " + JSON.stringify(e) + ");\n File.editor && File.editor.library && File.editor.library.setMountFolder(" + JSON.stringify(e) + ", true, " + n + ")", setTimeout(function () {
                    t.webContents.executeJavaScript(i)
                }, o || 0), t
            }, c.openFileOrFolder = function (e, t) {
                var n;
                (n = e) && s(232).isDirectorySync(n) && !/\.textbundle$/i.exec(n) ? t && t.forceCreateWindow ? p.openFile(void 0, {
                    prepWindow: !0,
                    displayNow: !0,
                    forceCreateWindow: !0,
                    mountFolder: e,
                    showSidebar: !0
                }) : c.openFolder(e) : !e && t && t.forceCreateWindow ? p.openFile(void 0, {
                    prepWindow: !0,
                    displayNow: !0,
                    forceCreateWindow: !0
                }) : c.openFile(e, t)
            }, c.openFile = function (t, e) {
                var n = (e = e || {}).curWindow || d.getFocusedWindow(), {
                    syncAndPrepOnly: o,
                    forceCreateWindow: i,
                    fromReopen: r
                } = e;

                function a() {
                    return !r && p.documents.size && v.cannotContinueUse() ? (v.showLicensePanel(), null) : p.openFile(t, {
                        prepWindow: !0,
                        displayNow: i || !o,
                        forceCreateWindow: i, ...e
                    })
                }

                if (t = t && s(541).normalize(t), !o && t && !i && n && n.webContents && !n.webContents.isLoadingMainFrame()) {
                    var l = p.getDocumentFromWindowId(n.id);
                    if (l && !l.path) return n.webContents.executeJavaScript("File.changeCounter.isDiscardableUntitled()").then(function (e) {
                        return e ? n.webContents.executeJavaScript("File.editor.library.openFile(" + JSON.stringify(t) + ")").then(() => p.getDocumentFromWindowId(n.id)) : a()
                    }).then(function (e) {
                        return e
                    })
                }
                return a()
            }, c.sendEvent = function (t, n) {
                d.getAllWindows().forEach(function (e) {
                    e.webContents.send(t, n)
                }), c.onMessage(t, n)
            }, c.execInAll = function (t) {
                d.getAllWindows().forEach(function (e) {
                    e.webContents.executeJavaScript(t)
                })
            }, c.onMessage = function (e, t) {
                "didRename" == e ? c.setting.renameRecentDocuments(t.oldPath, t.newPath) : "updateQuickOpenCache" == e && t.toDel && c.setting.renameRecentDocuments(t.toDel, null)
            }, c.refreshMenu = function () {
                b.refreshMenu()
            }, {});
            e.handle("app.download", (e, t, n, o) => {
                var i, r, a = s(541), l = d.fromWebContents(e.sender), e = s(554), o = o || (e => {
                    var t = s(426), n = s(541), t = t.parse(e), e = n.basename(t.pathname);
                    try {
                        var o = decodeURIComponent(e);
                        if (o != e) return n.basename(o)
                    } catch (e) {
                    }
                    return e
                })(t), a = a.join(n, o);
                return u.existsSync(a) && (i = a, r = s(541), a = i.replace(/(\.[^.\/\\]+?$)/, "") + "-" + +new Date + r.extname(i)), O[l.id + t] || (O[l.id + t] = e.download(l, t, {
                    showBadge: !1,
                    directory: n,
                    filename: o
                })), setTimeout(() => {
                    delete O[l.id + t]
                }, 10), Promise.race([O[l.id + t].then(e => ({
                    path: e.getSavePath(),
                    state: e.getState(),
                    type: e.getMimeType()
                }), () => ({path: t, state: "error"})), new Promise(e => {
                    setTimeout(() => {
                        e({path: t, state: "timeout"})
                    }, 3e4)
                })])
            });
            var M = function () {
                var e = o.session.defaultSession, n = /^file:\/\/([a-z0-9\-_]+\.)+([a-z]+)\//i;
                e.webRequest.onBeforeRequest({urls: ["file://**.*/*"]}, function (e, t) {
                    e = e.url;
                    n.exec(e) ? (e = "https" + e.substr(4), console.log("redirect to " + e), t({
                        cancel: !1,
                        redirectURL: e
                    })) : t({cancel: !1})
                })
            }, L = function (e) {
                m.registerFileProtocol(e, function (e, t) {
                    e.url ? t({path: c.getRealPath(e.url)}) : t({error: -324})
                }), m.registerBufferProtocol("typora-bg", function (e, t) {
                    var n = c.setting.get("backgroundColor");
                    t(n ? {mimeType: "text/css", data: Buffer.from(`body {background:${n};`)} : {
                        mimeType: "text/css",
                        data: Buffer.from("")
                    })
                })
            };
            c.getRealPath = function (e) {
                try {
                    e = decodeURI(e)
                } catch (e) {
                }
                e = e.substr(13);
                return /^userData/.exec(e) && (e = e.replace(/^userData/, c.getPath("userData").replace(/\\/g, "\\\\"))), /current-theme\.css$/.exec(e) && (e = e.replace(/current-theme\.css$/, c.setting.curTheme())), /^typemark/i.exec(e) && (e = e.replace(/^typemark/, t)), e = (e = /preview\.html/.exec(e) ? e.replace(/\.html[?#].*$/, ".html") : e).replace(/[?#][^\\\/]*$/, "")
            }, c.filesOp = r, W && m.registerSchemesAsPrivileged([{
                scheme: W,
                privileges: {standard: !0, secure: !0, supportFetchAPI: !0, bypassCSP: !0, corsEnabled: !0, stream: !0}
            }])
        }, 344: (t, n, h) => {
            function r(e, t) {
                return function () {
                    k(e, t)
                }
            }

            var i, a = h(134), l = a.app, g = a.dialog, s = a.Menu, c = a.MenuItem, m = a.BrowserWindow, e = a.ipcMain,
                f = h(728), d = "win32" == process.platform, w = "darwin" == process.platform,
                b = "linux" == process.platform, y = h(445), u = h(541).join(__dirname, "../"),
                v = (e.on("execForAll", function (e, t) {
                    v(t)
                }), e.on("forceRefreshMenu", function (e, t) {
                    l.forceRefreshMenu()
                }), e.on("syncToPreference", function (e, t) {
                    a.webContents.getAllWebContents().forEach(function (e) {
                        e.send("syncToPreference", t)
                    })
                }), n.loadDict = () => {
                    var o, e;
                    return i ? Promise.resolve(i) : (o = l.setting.getUserLocale(), e = h(541).join(u, l.setting.getLocaleFolder("Menu")), new Promise(n => {
                        f.readFile(e, "utf8", (e, t) => {
                            i = t ? JSON.parse(t) : {}, n(i), e && console.warn("cannot load dict as [" + o + "] " + e.stack)
                        })
                    }))
                }, function (e) {
                    var t = e = e.toString();
                    /^\s*function\s*\(/.exec(e) && (t = "window.File && (" + e + ")();"), l.execInAll(t), console.log(t)
                }), k = function (e, t) {
                    var n = m.getFocusedWindow();
                    n && (t ? n.webContents.executeJavaScript("window.File && !File.blockUI && (" + e.toString() + ")();0;") : n.webContents.executeJavaScript("!File.blockUI && window.ClientCommand['" + e + "']();0;"), n.webContents.executeJavaScript("window.Reporter && window.Reporter.fullValidate();File.editor && File.editor.contextMenu && File.editor.contextMenu.hide();0;"))
                };

            function C(e) {
                var t = /&[a-z]/i.exec(e), n = /(\.\.\.)|(…)/.exec(e),
                    o = (e = e.replace(/(\.\.\.)|(…)|&/g, ""), (i || {})[e] || e);
                return t ? function (e, t) {
                    e = S[e];
                    if (!e) return t;
                    {
                        var n, o;
                        (d || b) && (-1 == (n = t.indexOf(e)) ? n = t.indexOf(e.toLowerCase()) : -1 < (o = t.indexOf(e.toLowerCase())) && (n = Math.min(n, o)), -1 < n ? t = t.substr(0, n) + "&" + t.substr(n) : t += d ? "(​&" + e + ")" : "(&" + e + ")")
                    }
                    return t
                }(e, o) + (n ? "…" : "") : o + (n ? "…" : "")
            }

            function F(e, t) {
                if (t) {
                    if (!e._useLowerCase) {
                        for (var n in e) e[n.toLowerCase().replace(/[.…]/g, "")] = e[n];
                        e._useLowerCase = !0
                    }
                    return e[t.toLowerCase()]
                }
            }

            var S = {File: "F", Edit: "E", Paragraph: "P", Format: "O", View: "V", Themes: "T", Help: "H"};

            function p(e) {
                if (!e || !e.label) return e;
                var t, n, o, i = e.label;
                return e.label = C(e.label), e.submenu ? e.submenu.forEach(p) : (void 0 !== (n = void 0 === (n = F(t = l.setting.config.keyBinding || {}, (e.label || "").replace(/[.…]/g, ""))) ? F(t, (i || "").replace(/[.…]/g, "")) : n) && (e.accelerator = n + ""), (e.accelerator || "").startsWith("global:") && (e.accelerator = e.accelerator.substr("global:".length), (o = e.click) && a.globalShortcut.register(e.accelerator, () => {
                    setTimeout(o, 0)
                }))), e
            }

            function x(e, t) {
                return p(e = {label: e, accelerator: t}), e.accelerator
            }

            function D(e) {
                function n(e, t) {
                    e = e.label;
                    f.existsSync(e) ? l.openFileOrFolder(e, {curWindow: t}) : (g.showMessageBox({
                        title: C("Open Failed"),
                        message: C("File or folder does not exist."),
                        buttons: ["Close"],
                        cancelId: 0,
                        defaultId: 0
                    }), l.setting.removeRecentDocument(e))
                }

                try {
                    var o = e.getItem("File").submenu.getItem("Open Recent").submenu,
                        t = l.setting.getRecentDocuments(), i = l.setting.getRecentFolders();
                    t.sort(function (e, t) {
                        return t.date - e.date
                    }), i.sort(function (e, t) {
                        return t.date - e.date
                    }), o.clear(), o.append(new c({
                        label: C("Reopen Closed File"),
                        accelerator: "CmdOrCtrl+Shift+T",
                        click: function () {
                            l.reopenClosed()
                        }
                    })), o.append(new c({type: "separator"})), t.length && (t.forEach(function (e, t) {
                        10 < t || o.append(new c({label: e.path, click: n}))
                    }), o.append(new c({type: "separator"}))), i.length && (i.forEach(function (e, t) {
                        8 < t || o.append(new c({label: e.path, click: n}))
                    }), o.append(new c({type: "separator"}))), t.length + i.length ? o.append(new c(p({
                        label: "Clear Items",
                        click: function () {
                            l.setting.clearRecentDocuments()
                        },
                        type: "normal"
                    }))) : o.append(new c(p({label: "No Recent Files", enabled: !1}))), s.setApplicationMenu(e)
                } catch (e) {
                }
            }

            n.getKeyAccelerator = x, s.prototype.getItem = function (e) {
                if (!e) return null;
                for (var t = this.getItemCount(), n = 0; n < t; n++) {
                    var o = this.items[n].label.replace(/\(\u200b*&[A-Z]\)/, "").replace(/[&\.…]/g, "");
                    if (o == (e = e.replace(/[&\.…]/g, "")) || o == C(e)) return this.items[n]
                }
                return null
            }, c.prototype.setEnabled = function (e) {
                this.enabled = e
            }, c.prototype.setHidden = function (e) {
                this.visible = !e
            }, c.prototype.setState = function (e) {
                this.checked = e
            };

            function P(e) {
                function t(e) {
                    var o = "string" == typeof e ? {key: e, type: e} : e;
                    return function (e, t) {
                        var n;
                        n = o, (t = t) && (n = Object.assign({}, l.setting.exportSettingFor(n.key), n), t.webContents.send("export", n))
                    }
                }

                var n, o = [], i = (o.push({label: "PDF", click: t("pdf")}), o.push({
                    label: "HTML",
                    click: t("html")
                }), o.push({label: "HTML (without styles)", click: t("html-plain")}), o.push({
                    label: "Image",
                    click: t("image")
                }), l.setting.loadCustomExports());
                return i.length && o.push({type: "separator"}), i.forEach(e => {
                    e.type && (hasCustom = !0, o.push({label: e.name, click: t(e)}))
                }), o.push({type: "separator"}), o.push({
                    label: "Export with Previous",
                    accelerator: "Shift+Ctrl+E",
                    click: function (e, t) {
                        t && t.webContents.executeJavaScript("ClientCommand && ClientCommand.exportLast();")
                    },
                    enabled: !!l.setting.lastExport
                }), o.push({
                    label: "Export and Overwrite with Previous", click: function (e, t) {
                        t && t.webContents.executeJavaScript("ClientCommand && ClientCommand.exportLast(true)")
                    }, enabled: !!l.setting.lastExport
                }), o.push({type: "separator"}), o.push({
                    label: "Export Setting…", click: function (e, t) {
                        t && t.webContents.executeJavaScript("File.megaMenu.highlight('export-setting-group');")
                    }, enabled: !0
                }), e && (o.forEach(p), n = T("File→Export").submenu, o[o.length - 1].enabled = (I("Export and Overwrite with Previous", n) || {}).enabled, n.clear(), o.forEach(e => {
                    n.append(new c(e))
                }), w && s.setApplicationMenu(s.getApplicationMenu())), o
            }

            function T(e) {
                if (!e) return null;
                var t, n = (W = W || {})[e];
                return n || (e.split("→").forEach(function (e) {
                    if (n = I(e, n), !(W[t = t ? t + "→" + e : e] = n)) return null
                }), W = null, n)
            }

            function I(e, t) {
                var n, o = t ? t.submenu : s.getApplicationMenu();
                return o ? (n = o.getItem(e), t || n || "File" != e ? n : o.getItem("Typora") || o.getItem("Electron")) : null
            }

            var W, o = null;
            l.forceRefreshMenu = function () {
                b && (o && clearTimeout(o), o = setTimeout(function () {
                    s.setApplicationMenu(s.getApplicationMenu()), o = null
                }, 100))
            };
            l.updateMenu = function (e) {
                W = {};
                for (var t in e) {
                    var n, o, i = T(t), r = e[t];
                    i && (n = null, void 0 !== r.accelerator && (r.accelerator, o = x(i.label, r.accelerator), i = n = o != i.accelerator ? new c(p({
                        label: i.label,
                        type: i.type,
                        enabled: i.enabled,
                        checked: i.enabled,
                        click: i.click,
                        accelerator: o
                    })) : n), "Paragraph→Table" != t ? (void 0 !== r.state && (i.checked = r.state), void 0 !== r.enabled && (i.enabled = r.enabled, "Paragraph" != t && "Format" != t && "Format→Image→Zoom Image" != t || i.submenu.items.forEach(function (e) {
                        e.enabled = r.enabled
                    })), void 0 !== r.hidden && (i.visible = !r.hidden), !n || -1 < (t = (o = T(t.replace(/→[^→]+$/, "")).submenu.items).findIndex(e => e.label == n.label)) && (o.splice(t, 1, n), console.log("newItem.accelerator " + n.accelerator))) : (function (e, n) {
                        n.enabled || n.state ? (e.enabled = !0, e.submenu.items.forEach(function (e, t) {
                            e.enabled = 0 == t ? !n.state : n.state
                        })) : e.enabled = !1
                    }(i, r), 0))
                }
                W = null, l.forceRefreshMenu()
            }, e.on("menu.updateMenu", function (e, t) {
                l.updateMenu(JSON.parse(t))
            }), e.handle("menu.updateCustomZoom", e => {
                l.updateMenu({"View→Actual Size": {state: !l.setting.get("customZoom")}})
            }), e.handle("menu.refreshThemeMenu", function (e) {
                l.setting.refreshThemeMenu()
            }), e.handle("menu.reloadExportMenu", function (e) {
                P(!0)
            }), e.handle("menu.popup", function (e, t) {
                s.getApplicationMenu().popup(t)
            }), n.bindMainMenu = function () {
                function e(e, t) {
                    e = (/\((.+)\)/.exec(e.label) || [])[1] || e.label;
                    e == C("Auto") && (e = ""), k("function(){File.reloadWithEncoding('" + e + "')}", !0)
                }

                var t = l.setting.get("SmartyPantsOnRendering") || !1, n = l.setting.get("smartQuote") || !1,
                    o = l.setting.get("smartDash") || !1, t = [p({
                        label: "&File",
                        submenu: [{label: "New", accelerator: "CmdOrCtrl+N", click: r("newFile")}, {
                            label: "New Window",
                            accelerator: "CmdOrCtrl+Shift+N",
                            click: r("newWindow")
                        }, {type: "separator"}, {
                            label: "Open…",
                            accelerator: "CmdOrCtrl+O",
                            click: r("open")
                        }, {label: "Open Folder…", click: r("openFolder")}, {type: "separator"}, {
                            label: "Open Quickly…",
                            accelerator: "CmdOrCtrl+P",
                            click: r("quickOpen")
                        }, {label: "Open Recent", submenu: []}, {
                            label: "Reopen with Encoding",
                            submenu: [{label: "Auto", click: e}, {type: "separator"}, {
                                label: "UTF-8",
                                click: e
                            }, {label: "UTF-16 LE", click: e}, {
                                label: "UTF-16 BE",
                                click: e
                            }, {type: "separator"}, {
                                label: "Western (windows-1252)",
                                click: e
                            }, {label: "Cyrillic (windows-1251)", click: e}, {
                                label: "Cyrillic (ISO-8859-2)",
                                click: e
                            }, {label: "Cyrillic (IBM866)", click: e}, {
                                label: "Cyrillic (IBM855)",
                                click: e
                            }, {label: "Cyrillic (KOI8-R)", click: e}, {
                                label: "Cyrillic (MacCyrillic)",
                                click: e
                            }, {
                                label: "Central European (windows-1250)",
                                click: e
                            }, {label: "Central European (ISO-8859-2)", click: e}, {
                                label: "Geek (windows-1253)",
                                click: e
                            }, {label: "Geek (ISO-8859-7)", click: e}, {
                                label: "Hebrew (windows-1255)",
                                click: e
                            }, {label: "Hebrew (ISO-8859-8)", click: e}, {
                                label: "Chinese Simplified (GB2312)",
                                click: e
                            }, {label: "Chinese Simplified (GB18030)", click: e}, {
                                label: "Chinese Traditional (Big5)",
                                click: e
                            }, {label: "Japanese (SHIFT_JIS)", click: e}, {
                                label: "Japanese (EUC-JP)",
                                click: e
                            }, {label: "Korean (EUC-KR)", click: e}, {label: "Thai (TIS-620)", click: e}]
                        }, {type: "separator"}, {
                            label: "Save",
                            accelerator: "CmdOrCtrl+S",
                            click: r("save")
                        }, {label: "Save As…", accelerator: "CmdOrCtrl+Shift+S", click: r("saveAs")}, {
                            label: "Save All…",
                            click: r("saveAll")
                        }, {type: "separator"}, d ? {
                            label: "Properties…", click: function (e, t) {
                                t && t.webContents.executeJavaScript('reqnode("win-shell").openProperties(File.bundle.filePath);')
                            }
                        } : null, {label: "Open File Location…", click: r("openFileLocation")}, {
                            label: "Reveal in Sidebar",
                            click: r(function () {
                                window.File.editor.library.revealInSidebar()
                            }, !0)
                        }, {
                            label: "Delete…", click: function (e, t) {
                                t && t.webContents.executeJavaScript("File.trashSelf();")
                            }
                        }, {type: "separator"}, {label: "Import…", click: r("import")}, {
                            label: "Export",
                            submenu: P()
                        }, {
                            label: "Print…",
                            accelerator: "Shift+Alt+P",
                            click: r("print")
                        }, {type: "separator"}, {
                            label: "Preferences…",
                            accelerator: "CmdOrCtrl+,",
                            click: r("togglePreferencePanel")
                        }, {type: "separator"}, {label: "Close", accelerator: "CmdOrCtrl+W", click: r("close")}]
                    }), p({
                        label: "&Edit",
                        id: "edit",
                        submenu: [{label: "Undo", id: "undo", accelerator: "CmdOrCtrl+Z", click: r("undo")}, {
                            label: "Redo",
                            id: "redo",
                            accelerator: "CmdOrCtrl+Y",
                            click: r("redo")
                        }, {type: "separator"}, {label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut"}, {
                            label: "Copy",
                            accelerator: "CmdOrCtrl+C",
                            role: "copy"
                        }, {
                            label: "Copy Image Content", click: function (e, t) {
                                t && t.webContents.executeJavaScript("File.editor.imgEdit.copyImage()")
                            }
                        }, {
                            label: "Paste",
                            accelerator: "CmdOrCtrl+V",
                            role: "paste"
                        }, {type: "separator"}, {
                            label: "Copy as Plain Text",
                            click: r("copyAsPlainText")
                        }, {
                            label: "Copy as Markdown",
                            accelerator: "CmdOrCtrl+Shift+C",
                            click: r("copyAsMarkdown")
                        }, {label: "Copy as HTML Code", click: r("copyAsHTMLSource")}, {
                            label: "Copy without Theme Styling",
                            click: r("copyAsSemanticHTML")
                        }, {type: "separator"}, {
                            label: "Paste as Plain Text",
                            accelerator: "CmdOrCtrl+Shift+v",
                            click: r("pasteAsPlain")
                        }, {type: "separator"}, {
                            label: "Selection",
                            submenu: [{
                                label: "Select All",
                                accelerator: "CmdOrCtrl+A",
                                click: r("selectAll")
                            }, {
                                label: "Select Paragraph / Block", accelerator: "CmdOrCtrl+Alt+P", click: r(function () {
                                    File.editor.selection.selectBlock()
                                }, !0)
                            }, {
                                label: "Select Line / Sentence", accelerator: "CmdOrCtrl+L", click: r(function () {
                                    File.editor.selection.selectLine()
                                }, !0)
                            }, {
                                label: "Select Styled Scope", accelerator: "CmdOrCtrl+E", click: r(function () {
                                    File.editor.selection.selectPhrase()
                                }, !0)
                            }, {
                                label: "Select Word", accelerator: "CmdOrCtrl+D", click: r(function () {
                                    File.editor.selection.selectWord()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Jump to Top", accelerator: "Ctrl+Home", click: r(function () {
                                    File.editor.selection.jumpTop()
                                }, !0)
                            }, {
                                label: "Jump to Selection", accelerator: "CmdOrCtrl+j", click: r(function () {
                                    File.editor.selection.jumpSelection()
                                }, !0)
                            }, {
                                label: "Jump to Bottom", accelerator: "Ctrl+End", click: r(function () {
                                    File.editor.selection.jumpBottom()
                                }, !0)
                            }, {
                                label: "Extend Selection to Top",
                                accelerator: "Ctrl+Shift+Home",
                                visible: !1,
                                click: r(function () {
                                    File.editor.selection.jumpTop(!0)
                                }, !0)
                            }, {
                                label: "Extend Selection to Bottom",
                                accelerator: "Ctrl+Shift+End",
                                visible: !1,
                                click: r(function () {
                                    File.editor.selection.jumpBottom(!0)
                                }, !0)
                            }, {
                                label: "Extend Selection to Line Start",
                                accelerator: "Shift+Home",
                                visible: !1,
                                click: r(function () {
                                    File.editor.selection.extendToLineEdge(!1)
                                }, !0)
                            }, {
                                label: "Extend Selection to Line End",
                                accelerator: "Shift+End",
                                visible: !1,
                                click: r(function () {
                                    File.editor.selection.extendToLineEdge(!0)
                                }, !0)
                            }]
                        }, {type: "separator"}, {
                            label: "Delete", click: r(function () {
                                File.delete()
                            }, !0)
                        }, {
                            label: "Delete Range",
                            submenu: [{
                                label: "Delete Paragraph / Block",
                                accelerator: "Shift+CmdOrCtrl+Alt+P",
                                click: r("deleteBlock")
                            }, {
                                label: "Delete Line / Sentence",
                                accelerator: "Shift+CmdOrCtrl+Alt+L",
                                click: r("deleteLine")
                            }, {
                                label: "Delete Styled Scope",
                                accelerator: "Shift+CmdOrCtrl+Alt+E",
                                click: r("deleteScope")
                            }, {label: "Delete Word", accelerator: "Shift+Ctrl+D", click: r("deleteWord")}]
                        }, {type: "separator"}, {
                            label: "Math Tools",
                            submenu: [{
                                label: "Refresh All Math Expressions", click: r(function () {
                                    File.editor.mathBlock.forceRefresh()
                                }, !0)
                            }]
                        }, {type: "separator"}, {
                            label: "Smart Punctuation",
                            submenu: [{
                                label: "Convert on Input", type: "checkbox", click: function (e, t) {
                                    t && (e = e.checked, t.webContents.executeJavaScript("File.megaMenu.setSmartyPantsTiming(" + !e + ")"))
                                }, checked: !t
                            }, {
                                label: "Convert on Rendering", type: "checkbox", click: function (e, t) {
                                    t && (e = e.checked, t.webContents.executeJavaScript("File.megaMenu.setSmartyPantsTiming(" + e + ")"))
                                }, checked: t
                            }, {type: "separator"}, {
                                label: "Smart Quotes", type: "checkbox", click: function (e, t) {
                                    t && (e = e.checked, t.webContents.executeJavaScript("File.megaMenu.setSmartQuote(" + e + ")"))
                                }, checked: n
                            }, {
                                label: "Smart Dashes", type: "checkbox", click: function (e, t) {
                                    t && (e = e.checked, t.webContents.executeJavaScript("File.megaMenu.setSmartDash(" + e + ")"))
                                }, checked: o
                            }, {type: "separator"}, {
                                label: "Remap Unicode Punctuation on Parse",
                                type: "checkbox",
                                click: function (e, t) {
                                    t && (e = e.checked, t.webContents.executeJavaScript("File.megaMenu.setRemapPunctuation(" + e + ")"))
                                },
                                checked: l.setting.get("remapPunctuation") || !t && (n || o),
                                enabled: !(!t && (n || o))
                            }, {type: "separator"}, {
                                label: "More Options…", click: function (e, t) {
                                    t && t.webContents.executeJavaScript("File.megaMenu.highlight('smart-punctuation-group');")
                                }
                            }]
                        }, {
                            label: "Line Endings",
                            submenu: [{
                                label: "Windows Line Endings (CRLF)", type: "checkbox", click: r(function () {
                                    File.setLineEnding(!0, !0)
                                }, !0)
                            }, {
                                label: "Unix Line Endings (LF)", type: "checkbox", click: r(function () {
                                    File.setLineEnding(!1, !0)
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Insert Final New Line On Save",
                                type: "checkbox",
                                click: function (e, t) {
                                    t && t.webContents.executeJavaScript("File.setFinalNewline(" + e.checked + ")")
                                }
                            }]
                        }, {
                            label: "Whitespace and Line Breaks",
                            submenu: [{
                                label: "Indent first line of paragraphs", type: "checkbox", click: r(function () {
                                    File.setIndentFirstLine(!File.option.indentFirstLine, !0, !0)
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Visible <br/>",
                                type: "checkbox",
                                checked: !0,
                                click: r(function () {
                                    File.setHideBrAndLineBreak(!File.option.hideBrAndLineBreak, !0, !0)
                                }, !0)
                            }, {
                                label: "Preserve single line break", type: "checkbox", checked: !0, click: r(function () {
                                    File.setIgnoreLineBreak(!File.option.ignoreLineBreak, !0, !0)
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Learn More…", click: function () {
                                    var e = l.setting.get("useMirrorInCN") ? "typoraio.cn" : "typora.io";
                                    a.shell.openExternal(`https://support.${e}/Line-Break/`)
                                }
                            }]
                        }, {
                            label: "Spell Check…", click: function (e, t) {
                                t && t.webContents.executeJavaScript("File.editor.spellChecker && File.editor.spellChecker.show();")
                            }
                        }, {type: "separator"}, {
                            label: "Find and Replace",
                            submenu: [{
                                label: "Find…", accelerator: "CmdOrCtrl+f", click: r(function () {
                                    File.megaMenu.isPreferencePanelShown() ? File.megaMenu.searchOnPreferencePanel() : File.editor.searchPanel.showPanel()
                                }, !0)
                            }, {
                                label: "Find Next", accelerator: "F3", click: r(function () {
                                    File.editor.searchPanel.highlightNext()
                                }, !0)
                            }, {
                                label: "Find Previous", accelerator: "Shift+F3", click: r(function () {
                                    File.editor.searchPanel.highlightNext(!0)
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Replace", accelerator: "Ctrl+h", click: r(function () {
                                    File.editor.searchPanel.showPanel(!0)
                                }, !0)
                            }]
                        }]
                    }), p({
                        label: "&Paragraph",
                        submenu: [{
                            label: "Heading 1", type: "checkbox", accelerator: "Ctrl+1", click: r(function () {
                                File.editor.stylize.changeBlock("header1", void 0, !0)
                            }, !0)
                        }, {
                            label: "Heading 2", type: "checkbox", accelerator: "Ctrl+2", click: r(function () {
                                File.editor.stylize.changeBlock("header2", void 0, !0)
                            }, !0)
                        }, {
                            label: "Heading 3", type: "checkbox", accelerator: "Ctrl+3", click: r(function () {
                                File.editor.stylize.changeBlock("header3", void 0, !0)
                            }, !0)
                        }, {
                            label: "Heading 4", type: "checkbox", accelerator: "Ctrl+4", click: r(function () {
                                File.editor.stylize.changeBlock("header4", void 0, !0)
                            }, !0)
                        }, {
                            label: "Heading 5", type: "checkbox", accelerator: "Ctrl+5", click: r(function () {
                                File.editor.stylize.changeBlock("header5", void 0, !0)
                            }, !0)
                        }, {
                            label: "Heading 6", type: "checkbox", accelerator: "Ctrl+6", click: r(function () {
                                File.editor.stylize.changeBlock("header6", void 0, !0)
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Paragraph",
                            type: "checkbox",
                            accelerator: "Ctrl+0",
                            click: r(function () {
                                File.editor.stylize.changeBlock("paragraph")
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Increase Heading Level",
                            accelerator: "Ctrl+=",
                            click: r(function () {
                                File.editor.stylize.increaseHeaderLevel()
                            }, !0)
                        }, {
                            label: "Decrease Heading Level", accelerator: "Ctrl+-", click: r(function () {
                                File.editor.stylize.decreaseHeaderLevel()
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Table", submenu: [{
                                label: "Insert Table", accelerator: "Ctrl+T", click: r(function () {
                                    File.editor.tableEdit.insertTable()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Add Row Above", enabled: !1, click: r(function () {
                                    File.editor.tableEdit.addRow(!0)
                                }, !0)
                            }, {
                                label: "Add Row Below", accelerator: "Ctrl+Return", enabled: !1, click: r(function () {
                                    File.editor.tableEdit.addRow(!1)
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Add Column Before", enabled: !1, click: r(function () {
                                    File.editor.tableEdit.addCol(!1)
                                }, !0)
                            }, {
                                label: "Add Column After", enabled: !1, click: r(function () {
                                    File.editor.tableEdit.addCol(!1)
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Move Row Up",
                                enabled: !1,
                                accelerator: "Alt+Up",
                                click: r(function () {
                                    File.editor.tableEdit.moveRowUpOrDown(!0)
                                }, !0)
                            }, {
                                label: "Move Row Down", enabled: !1, accelerator: "Alt+Down", click: r(function () {
                                    File.editor.tableEdit.moveRowUpOrDown(!1)
                                }, !0)
                            }, {
                                label: "Move Column Left", enabled: !1, accelerator: "Alt+Left", click: r(function () {
                                    File.editor.tableEdit.moveColLeftOrRight(!0)
                                }, !0)
                            }, {
                                label: "Move Column Right", enabled: !1, accelerator: "Alt+Right", click: r(function () {
                                    File.editor.tableEdit.moveColLeftOrRight(!1)
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Delete Row",
                                enabled: !1,
                                accelerator: "Shift+Ctrl+Backspace",
                                click: r(function () {
                                    File.editor.tableEdit.deleteRow()
                                }, !0)
                            }, {
                                label: "Delete Column", enabled: !1, click: r(function () {
                                    File.editor.tableEdit.deleteCol()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Copy Table", enabled: !1, click: r(function () {
                                    File.editor.tableEdit.copyTable()
                                }, !0)
                            }, {
                                label: "Prettify Source Code", enabled: !1, click: r(function () {
                                    File.editor.tableEdit.reformatTable()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Delete Table", enabled: !1, click: r(function () {
                                    File.editor.tableEdit.deleteTable()
                                }, !0)
                            }]
                        }, {
                            label: "Code Fences", type: "checkbox", accelerator: "Ctrl+Shift+K", click: r(function () {
                                File.editor.stylize.toggleFences()
                            }, !0)
                        }, {
                            label: "Math Block", type: "checkbox", accelerator: "Ctrl+Shift+M", click: r(function () {
                                File.editor.stylize.toggleMathBlock()
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Quote",
                            type: "checkbox",
                            accelerator: "Ctrl+Shift+Q",
                            click: r(function () {
                                File.editor.stylize.toggleIndent("blockquote")
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Ordered List",
                            type: "checkbox",
                            accelerator: "Ctrl+Shift+[",
                            click: r(function () {
                                File.editor.stylize.toggleIndent("ol")
                            }, !0)
                        }, {
                            label: "Unordered List", type: "checkbox", accelerator: "Ctrl+Shift+]", click: r(function () {
                                File.editor.stylize.toggleIndent("ul")
                            }, !0)
                        }, {
                            label: "Task List", type: "checkbox", accelerator: "Ctrl+Shift+X", click: r(function () {
                                File.editor.stylize.toggleIndent("tasklist")
                            }, !0)
                        }, {
                            label: "Task Status", submenu: [{
                                label: "Toggle Task Status", click: r(function () {
                                    File.editor.stylize.toggleTaskStatus()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Mark as Complete", type: "checkbox", click: r(function () {
                                    File.editor.stylize.toggleTaskStatus(!0)
                                }, !0)
                            }, {
                                label: "Mark as Incomplete", type: "checkbox", click: r(function () {
                                    File.editor.stylize.toggleTaskStatus(!1)
                                }, !0)
                            }]
                        }, {
                            label: "List Indentation",
                            submenu: [{
                                label: "Indent", accelerator: "CmdOrCtrl+]", click: r(function () {
                                    File.editor.UserOp.moreIndent(File.editor)
                                }, !0)
                            }, {
                                label: "Outdent", accelerator: "CmdOrCtrl+[", click: r(function () {
                                    File.editor.UserOp.lessIndent(File.editor)
                                }, !0)
                            }]
                        }, {type: "separator"}, {
                            label: "Insert Paragraph Before", click: r(function () {
                                File.editor.UserOp.insertParagraph(!0)
                            }, !0)
                        }, {
                            label: "Insert Paragraph After", click: r(function () {
                                File.editor.UserOp.insertParagraph(!1)
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Link Reference", type: "checkbox", click: r(function () {
                                File.editor.stylize.insertBlock("def_link")
                            }, !0)
                        }, {
                            label: "Footnotes", type: "checkbox", click: r(function () {
                                File.editor.stylize.insertBlock("def_footnote")
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Horizontal Line", type: "checkbox", click: r(function () {
                                File.editor.stylize.insertBlock("hr")
                            }, !0)
                        }, {
                            label: "Table of Contents", type: "checkbox", click: r(function () {
                                File.editor.stylize.insertBlock("toc")
                            }, !0)
                        }, {
                            label: "YAML Front Matter", type: "checkbox", click: r(function () {
                                File.editor.stylize.insertMetaBlock()
                            }, !0)
                        }]
                    }), p({
                        label: "F&ormat",
                        submenu: [{
                            label: "Strong", type: "checkbox", accelerator: "CmdOrCtrl+B", click: r(function () {
                                File.editor.stylize.toggleStyle("strong")
                            }, !0)
                        }, {
                            label: "Emphasis", type: "checkbox", accelerator: "CmdOrCtrl+I", click: r(function () {
                                File.editor.stylize.toggleStyle("em")
                            }, !0)
                        }, {
                            label: "Underline", type: "checkbox", accelerator: "CmdOrCtrl+U", click: r(function () {
                                File.editor.stylize.toggleStyle("underline")
                            }, !0)
                        }, {
                            label: "Code", type: "checkbox", accelerator: "CmdOrCtrl+Shift+`", click: r(function () {
                                File.editor.stylize.toggleStyle("code")
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Inline Math", type: "checkbox", click: r(function () {
                                File.editor.stylize.toggleStyle("inline_math")
                            }, !0)
                        }, {
                            label: "Strike", type: "checkbox", accelerator: "Alt+Shift+5", click: r(function () {
                                File.editor.stylize.toggleStyle("del")
                            }, !0)
                        }, {
                            label: "Highlight", type: "checkbox", click: r(function () {
                                File.editor.stylize.toggleStyle("highlight")
                            }, !0)
                        }, {
                            label: "Superscript", type: "checkbox", click: r(function () {
                                File.editor.stylize.toggleStyle("superscript")
                            }, !0)
                        }, {
                            label: "Subscript", type: "checkbox", click: r(function () {
                                File.editor.stylize.toggleStyle("subscript")
                            }, !0)
                        }, {
                            label: "Comment", type: "checkbox", click: r(function () {
                                File.editor.stylize.toggleStyle("comment")
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Hyperlink",
                            type: "checkbox",
                            accelerator: "Ctrl+K",
                            click: r(function () {
                                File.editor.stylize.toggleStyle("link")
                            }, !0)
                        }, {
                            label: "Hyperlink Actions", submenu: [{
                                label: "Open Link", click: r(function () {
                                    File.editor.openCurrentLink()
                                }, !0)
                            }, {
                                label: "Copy Link Address", click: r(function () {
                                    File.editor.copyCurrentLink()
                                }, !0)
                            }]
                        }, {
                            label: "Image",
                            submenu: [{
                                label: "Insert Image", accelerator: "CmdOrCtrl+Shift+I", click: r(function () {
                                    File.editor.stylize.toggleStyle("image")
                                }, !0)
                            }, {
                                label: "Insert Local Images…", click: r(function () {
                                    File.editor.imgEdit.insertLocalImage()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Open Image Location…", click: r(function () {
                                    File.editor.imgEdit.revealInFinder()
                                }, !0)
                            }, {
                                label: "Copy Image Content", click: function (e, t) {
                                    t && t.webContents.executeJavaScript("File.editor.imgEdit.copyImage()")
                                }
                            }, {
                                label: "Zoom Image", submenu: [{
                                    label: "25%", click: r(function () {
                                        File.editor.imgEdit.zoomAction(null, "25%")
                                    }, !0)
                                }, {
                                    label: "33%", click: r(function () {
                                        File.editor.imgEdit.zoomAction(null, "33%")
                                    }, !0)
                                }, {
                                    label: "50%", click: r(function () {
                                        File.editor.imgEdit.zoomAction(null, "50%")
                                    }, !0)
                                }, {
                                    label: "67%", click: r(function () {
                                        File.editor.imgEdit.zoomAction(null, "67%")
                                    }, !0)
                                }, {
                                    label: "80%", click: r(function () {
                                        File.editor.imgEdit.zoomAction(null, "80%")
                                    }, !0)
                                }, {type: "separator"}, {
                                    label: "100%", click: r(function () {
                                        File.editor.imgEdit.zoomAction(null, "100%")
                                    }, !0)
                                }, {type: "separator"}, {
                                    label: "150%", click: r(function () {
                                        File.editor.imgEdit.zoomAction(null, "150%")
                                    }, !0)
                                }, {
                                    label: "200%", click: r(function () {
                                        File.editor.imgEdit.zoomAction(null, "200%")
                                    }, !0)
                                }]
                            }, {
                                label: "Delete Image File", click: function (e, t) {
                                    t && t.webContents.executeJavaScript("File.editor.imgEdit.deleteImageAction(true)")
                                }
                            }, {type: "separator"}, {
                                label: "Copy Image to…", click: r(function () {
                                    File.editor.imgEdit.copyToSelectedFolderAction()
                                }, !0)
                            }, {
                                label: "Move Image to…", click: r(function () {
                                    File.editor.imgEdit.copyToSelectedFolderAction(!0)
                                }, !0)
                            }, {
                                label: "Upload Image", click: r(function () {
                                    File.editor.imgEdit.uploadAction()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Copy All Images to…", click: r(function () {
                                    File.editor.imgEdit.copyAllImages()
                                }, !0)
                            }, {
                                label: "Move All Images to…", click: r(function () {
                                    File.editor.imgEdit.moveAllImages()
                                }, !0)
                            }, {
                                label: "Upload All Local Images", click: r(function () {
                                    File.editor.imgEdit.uploadAllImages()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Reload All Images", click: r(function () {
                                    File.editor.imgEdit.reloadAllByNode()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "When Insert Local Image",
                                submenu: [{
                                    label: "Copy Image File to Folder…", type: "checkbox", click: r(function () {
                                        File.editor.imgEdit.toggleCopyToFolder()
                                    }, !0)
                                }, {
                                    label: "Upload Image", type: "checkbox", click: r(function () {
                                        File.editor.imgEdit.toggleUploadForFile()
                                    }, !0)
                                }]
                            }, {
                                label: "Use Image Root Path…", type: "checkbox", click: r(function () {
                                    File.editor.imgEdit.toggleUseImageRootPath()
                                }, !0)
                            }, {type: "separator"}, {
                                label: "Global Image Settings…", click: function (e, t) {
                                    t && t.webContents.executeJavaScript("File.megaMenu.highlight('image-setting-group');")
                                }
                            }]
                        }, {type: "separator"}, {
                            label: "Clear Format",
                            type: "checkbox",
                            accelerator: "CmdOrCtrl+\\",
                            click: r(function () {
                                File.editor.stylize.clearStyle()
                            }, !0)
                        }]
                    }), p({
                        label: "&View",
                        submenu: [{
                            label: "Toggle Sidebar", accelerator: "CmdOrCtrl+Shift+L", click: r(function () {
                                File.editor.library.toggleSidebar()
                            }, !0)
                        }, {
                            label: "Outline",
                            type: "checkbox",
                            accelerator: "CmdOrCtrl+Shift+1",
                            click: r("toggleOutline")
                        }, {
                            label: "Articles",
                            type: "checkbox",
                            accelerator: "CmdOrCtrl+Shift+2",
                            click: r("toggleFileList")
                        }, {
                            label: "File Tree",
                            type: "checkbox",
                            accelerator: "CmdOrCtrl+Shift+3",
                            click: r("toggleFileTree")
                        }, {
                            label: "Search",
                            type: "checkbox",
                            accelerator: "CmdOrCtrl+Shift+F",
                            click: r("globalSearch")
                        }, {type: "separator"}, {
                            label: "Source Code Mode",
                            type: "checkbox",
                            accelerator: "CmdOrCtrl+/",
                            click: r(function () {
                                File.toggleSourceMode()
                            }, !0)
                        }, {type: "separator"}, {
                            label: "Focus Mode",
                            type: "checkbox",
                            accelerator: "F8",
                            click: r(function () {
                                File.editor.toggleFocusMode()
                            }, !0),
                            enabled: !1
                        }, {
                            label: "Typewriter Mode", type: "checkbox", accelerator: "F9", click: r(function () {
                                File.editor.toggleTypeWriterMode()
                            }, !0), enabled: !1
                        }, {type: "separator"}, {
                            label: "Show Status Bar",
                            type: "checkbox",
                            click: r("toggleStatusBar")
                        }, {type: "separator"}, {
                            label: "Toggle Fullscreen", accelerator: "F11", click: function (e, t) {
                                t && (t.isFullScreen() ? t.setFullScreen(!1) : t.setFullScreen(!0))
                            }
                        }, {
                            label: "Always on Top", type: "checkbox", click: function (e, t) {
                                t && (k(function () {
                                    document.body.classList.toggle("always-on-top")
                                }, !0), t.setAlwaysOnTop(!t.isAlwaysOnTop()), e.checked = t.isAlwaysOnTop())
                            }
                        }, {type: "separator"}, {
                            label: "Actual Size",
                            type: "checkbox",
                            accelerator: d ? "Ctrl+Shift+9" : "Ctrl+Shift+0",
                            click: function (e, t) {
                                v(function () {
                                    ClientCommand.resetZoom()
                                }), k(function () {
                                    ClientCommand.refreshViewMenu()
                                }, !0)
                            }
                        }, {
                            label: "Zoom In", accelerator: "Ctrl+Shift+=", click: function (e, t) {
                                v(function () {
                                    ClientCommand.zoomIn()
                                }), k(function () {
                                    ClientCommand.refreshViewMenu()
                                }, !0)
                            }
                        }, {
                            label: "Zoom Out", accelerator: "Ctrl+Shift+-", click: function (e, t) {
                                v(function () {
                                    ClientCommand.zoomOut()
                                }), k(function () {
                                    ClientCommand.refreshViewMenu()
                                }, !0)
                            }
                        }, {type: "separator"}, {
                            label: "Switch Between Opened Documents",
                            accelerator: "Ctrl+Tab",
                            click: function (e, t) {
                                var n;
                                !t || -1 != (t = (n = m.getAllWindows()).indexOf(t)) && n[t = ++t >= n.length ? 0 : t].focus()
                            }
                        }, {type: "separator"}, {
                            label: "Toggle DevTools",
                            accelerator: "Shift+F12",
                            click: function (e, t) {
                                var n;
                                t && (n = setTimeout(t.webContents.openDevTools, 2e3), t.webContents.executeJavaScript("ClientCommand.toggleDevTools()").then(function () {
                                    clearTimeout(n)
                                }, function () {
                                    clearTimeout(n), t.webContents.openDevTools()
                                }))
                            }
                        }]
                    }), p({label: "&Themes", submenu: []}), p({
                        label: "&Help", submenu: [{
                            label: "What's New…", click: function () {
                                var e = l.setting.get("useMirrorInCN") ? "typoraio.cn" : "typora.io";
                                a.shell.openExternal(`https://support.${e}/What's-New/`)
                            }
                        }, {type: "separator"}, {
                            label: "Quick Start", click: function (e, t) {
                                l.openFile(u + "/Docs/Quick Start.md")
                            }
                        }, {
                            label: "Markdown Reference", click: function (e, t) {
                                l.openFile(u + "/Docs/Markdown Reference.md")
                            }
                        }, {
                            label: "Install and Use Pandoc", click: function (e, t) {
                                l.openFile(u + "/Docs/Install and Use Pandoc.md")
                            }
                        }, {
                            label: "Custom Themes", click: function (e, t) {
                                l.openFile(u + "/Docs/Custom Themes.md")
                            }
                        }, {
                            label: "Use Images in Typora", click: function (e, t) {
                                l.openFile(u + "/Docs/Use Images in Typora.md")
                            }
                        }, {
                            label: "Data Recovery and Version Control", click: function (e, t) {
                                l.openFile(u + "/Docs/Auto Save, Version Control and Recovery.md")
                            }
                        }, {
                            label: "More Topics…", click: function (e, t) {
                                var n = l.setting.get("useMirrorInCN") ? "typoraio.cn" : "typora.io";
                                a.shell.openExternal("https://support." + n)
                            }
                        }, {type: "separator"}, {
                            label: "Credits", click: function (e, t) {
                                l.openFile(u + "/Docs/Credits.md")
                            }
                        }, {
                            label: "Change Log", click: function (e, t) {
                                l.openFile(u + "/Docs/Change Log.md")
                            }
                        }, {
                            label: "Privacy Policy", click: function (e, t) {
                                l.openFile(u + "/Docs/Privacy Policy.md")
                            }
                        }, {
                            label: "Website", click: function () {
                                var e = l.setting.get("useMirrorInCN") ? "https://typoraio.cn" : "https://typora.io";
                                a.shell.openExternal(e)
                            }
                        }, {
                            label: "Feedback", click: function (e, t) {
                                a.shell.openExternal("mailto:hi@typora.io")
                            }
                        }, {type: "separator"}, {
                            label: "Check Updates…", click: function () {
                                d && l.updater.checkForUpdates(!0)
                            }, visible: d
                        }, {
                            label: "My License…", click: function () {
                                y.showLicensePanel()
                            }
                        }, global.PRODUCTION_MODE ? null : {
                            label: "Welcome…", click: function () {
                                y.showWelcomePanel()
                            }
                        }, {
                            label: "About", click: r(function () {
                                File.megaMenu.closePreferencePanel(), document.body.classList.contains("native-window") ? ($(".modal:not(.block-modal)").modal("hide"), $("#about-dialog").modal("show"), $("*:focus").blur()) : (File.megaMenu.show(), $("#m-about").trigger("click"))
                            }, !0)
                        }]
                    })];
                d || t[0].submenu.splice(t[0].submenu.indexOf(null), 1), l.isEmojiPanelSupported() && (t[1].submenu.push({type: "separator"}), t[1].submenu.push(p({
                    label: "Emoji and Symbols",
                    accelerator: d ? "Super+." : "",
                    click: function () {
                        l.showEmojiPanel()
                    }
                })));
                const i = t[t.length - 1].submenu;
                for (; -1 < i.indexOf(null);) i.splice(i.indexOf(null), 1);
                D(n = s.buildFromTemplate(t)), s.setApplicationMenu(n), 0 < (l.setting.getAllThemes() || []).length && l.setting.refreshThemeMenu()
            }, n.refreshMenu = function () {
                D(s.getApplicationMenu())
            }, n.getMenuDict = function () {
                return i || {}
            }
        }, 558: (e, a, t) => {
            "use strict";
            var u = t(93).EventEmitter, n = t(134), o = n.ipcMain, l = n.app, r = t(728),
                p = "linux" == process.platform, h = t(541).join(__dirname, "../"), g = t(445), s = t(156),
                m = t(359).default, f = t(477), w = t(824), b = t(587), c = new u,
                i = ["Check updates automatically", "Skip This Version", "Remind Me Later", "Download Update", "New version available.", "Latest version is $1, your version is $2"],
                d = "64";
            "ia32" == process.arch && (d = "32"), "arm64" == process.arch && (d = "arm"), c.initUpdater = function () {
                return s.initDict().then(function () {
                    return i.forEach(function (e, t) {
                        i[t] = s.getPanelString(e)
                    }), Promise.resolve()
                })
            }, c.showDetailWindow = function (e, t, n) {
                c.progressBar && (c.progressBar.close(), c.progressBar = null), c.win && (c.win.destroy(), c.win = null);
                e = b.showPanelWindow({
                    title: s.getPanelString("Updater"),
                    width: 640,
                    height: 600,
                    path: "updater/updater.html?curVersion=$1&newVersion=$2&labels=$3&enableAutoUpdate=$4&releaseNoteLink=$5&hideAutoUpdates=$6".replace("$1", e).replace("$2", t).replace("$3", encodeURIComponent(JSON.stringify(i))).replace("$4", JSON.stringify(!1 !== l.setting.get("enableAutoUpdate"))).replace("$5", encodeURIComponent(n)).replace("$6", global.devVersion && !g.getHasLicense())
                });
                (c.win = e).on("closed", function () {
                    c.win = null
                })
            }, c.showUI = function () {
                c.win || c.progressBar || (c.progressBar = new f({
                    title: s.getPanelString("Updater"),
                    text: s.getPanelString("Checking Updates…"),
                    indeterminate: !0,
                    style: {text: {padding: "3px 0"}},
                    browserWindow: {closable: !0, webPreferences: {nodeIntegration: !0, contextIsolation: !1}}
                }))
            };
            c.checkForUpdates = async function (t) {
                var e, n = l.setting.get("useMirrorInCN") ? "typoraio.cn" : "typora.io",
                    n = global.devVersion || l.setting.get("autoUpdateToDev") ? `https://${n}/releases/dev_windows_${d}.json` : `https://${n}/releases/windows_${d}.json`;
                if (n) {
                    if (c.emit("checking-for-update"), t) c.showUI(); else if ((e = l.setting.get("cancelUpdate")) && new Date - new Date(e) < 432e5) return;
                    try {
                        var o = await m(n);
                        if (204 == o.status) return void c.emit("update-not-available");
                        if (200 != o.status) return c.emit("update-not-available"), console.error("invalid status code: " + o.statusCode + " from " + n), "Failed to check updates, invalid status code: " + o.status;
                        var i = await o.json(), r = (c.data = i, l.getVersion());
                        if (!i.version || !r) return;
                        if (!(0 < l.setting.compareVersion(i.version, r))) return void (t && (c.showMessage(s.getPanelString("You're up to date!"), s.getPanelString("Latest version is $1, your version is $2").replace("$1", i.version).replace("$2", r)), c.cleanUp()));
                        if (l.setting.hasUpdates = !0, l.execInAll("window.File && File.option && (File.option.hasUpdates=true)"), !t && l.setting.get("skipUpdate") == i.version) return;
                        var a = i.releaseNoteLink;
                        l.setting.get("useMirrorInCN") && (a = i.releaseNoteLinkCN || i.releaseNoteLink || "about:blank"), c.showDetailWindow(r, i.version, a)
                    } catch (e) {
                        t && ("zh-Hans" != l.setting.getUserLocale() || l.setting.get("useMirrorInCN") ? c.showError(s.getPanelString("Check Update Failed"), err) : c.showError(s.getPanelString("更新失败.请检查网络，或在偏好设置中启用 “Typora 服务使用国内服务器”"), e)), c.emit("error", e)
                    }
                }
            }, c.cleanUp = function () {
                c.win && (c.win.destroy(), c.win = null), c.progressBar && (c.progressBar.close(), c.progressBar = null), c.data = null
            }, c.showMessage = function (e, t) {
                c.progressBar && (c.progressBar.close(), c.progressBar = null), n.dialog.showMessageBox({
                    title: e,
                    message: t,
                    icon: h + "/assets/icon/icon_32x32.png",
                    buttons: ["OK"]
                })
            }, c.showError = function (e, t) {
                c.cleanUp(), n.dialog.showErrorBox(e || "Error", t.message || "")
            }, c.skipUpdate = function () {
                c.data.version && l.setting.put("skipUpdate", c.data.version)
            }, c.cancelUpdate = function () {
                l.setting.put("cancelUpdate", new Date)
            }, c.downloadUpdate = function () {
                c.win && (c.win.close(), c.win = null);
                var e, t, n, o, i = c.data.download;
                (i = l.setting.get("useMirrorInCN") ? c.data.downloadCN || c.data.download : i) && (e = "typora-update-" + process.arch + "-" + c.data.version + ".exe", t = l.setting.tempPath || l.getPath("temp"), r.existsSync(n = t + (p ? "/" : "\\") + e) ? c.askForInstall(n) : ((o = new w(i, t + "/_" + e, {
                    title: s.getPanelString("Updater"),
                    text: s.getPanelString("Downloading Updates…")
                })).onAbort = function () {
                    c.cleanUp()
                }, o.onError = function () {
                    c.showError(s.getPanelString("Download failed"), error)
                }, o.onSuccess = function (e) {
                    r.move(e.getSavePath(), n, {overwrite: !0}).then(function () {
                        c.askForInstall(n), c.progressBar.close()
                    }).catch(function () {
                    }), o.setCompleted()
                }, o.download()))
            }, c.askForInstall = function (t) {
                n.dialog.showMessageBox({
                    type: "question",
                    message: s.getPanelString("Install Updates ?"),
                    buttons: [s.getPanelString("Quit and Install"), s.getPanelString("Cancel")],
                    cancelId: 1
                }).then(({response: e}) => {
                    e || (console.log(t), c.installPathOnQuit = t, l.quit())
                })
            }, c.installIfNeeded = function () {
                c.installPathOnQuit && c.install(c.installPathOnQuit)
            }, c.install = function (e) {
                t(620).spawn(e, ["/SILENT"], {detached: !0, stdio: ["ignore", "ignore", "ignore"]}).unref()
            }, o.handle("updater.checkForUpdates", (e, t) => {
                c.checkForUpdates(t)
            }), o.handle("updater.cancelUpdate", e => {
                c.cancelUpdate()
            }), o.handle("updater.skipUpdate", e => {
                c.skipUpdate()
            }), o.handle("updater.downloadUpdate", e => {
                c.downloadUpdate()
            }), e.exports = c
        }, 620: e => {
            "use strict";
            e.exports = require("child_process")
        }, 289: e => {
            "use strict";
            e.exports = require("crypto")
        }, 134: e => {
            "use strict";
            e.exports = require("electron")
        }, 554: e => {
            "use strict";
            e.exports = require("electron-dl")
        }, 359: e => {
            "use strict";
            e.exports = require("electron-fetch")
        }, 477: e => {
            "use strict";
            e.exports = require("electron-progressbar")
        }, 93: e => {
            "use strict";
            e.exports = require("events")
        }, 834: e => {
            "use strict";
            e.exports = require("extract-zip")
        }, 833: e => {
            "use strict";
            e.exports = require("fs")
        }, 728: e => {
            "use strict";
            e.exports = require("fs-extra")
        }, 232: e => {
            "use strict";
            e.exports = require("fs-plus")
        }, 338: e => {
            "use strict";
            e.exports = require("hjson")
        }, 783: e => {
            "use strict";
            e.exports = require("lowdb")
        }, 207: e => {
            "use strict";
            e.exports = require("lowdb/adapters/FileSync")
        }, 640: e => {
            "use strict";
            e.exports = require("module")
        }, 560: e => {
            "use strict";
            e.exports = require("node-machine-id")
        }, 842: e => {
            "use strict";
            e.exports = require("os")
        }, 541: e => {
            "use strict";
            e.exports = require("path")
        }, 208: e => {
            "use strict";
            e.exports = require("process")
        }, 468: e => {
            "use strict";
            e.exports = require("raven")
        }, 426: e => {
            "use strict";
            e.exports = require("url")
        }, 266: e => {
            "use strict";
            e.exports = require("util")
        }
    }, o = {};

    function i(e) {
        var t = o[e];
        if (void 0 !== t) return t.exports;
        t = o[e] = {id: e, loaded: !1, exports: {}};
        return n[e](t, t.exports, i), t.loaded = !0, t.exports
    }

    i.c = o, i.nmd = e => (e.paths = [], e.children || (e.children = []), e);
    i(i.s = 90)
})();