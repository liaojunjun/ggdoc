const path = require("path");
const processPath = process.cwd();
const dirPath = (v) => path.resolve(__dirname, v);
const encode = "utf-8";
const fs = require("fs");
const marked = require("marked");

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, language) {
    const hljs = require("highlight.js");
    const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
    return hljs.highlight(validLanguage, code).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

module.exports = {
  readline: require("readline"),
  marked,
  once: require("events").once,
  fs,
  encode,
  outDir: processPath + "/root/",
  outDocFile: processPath + "/doc.html",
  header: fs.readFileSync(dirPath("./header.html"), encode),
  footer: fs.readFileSync(dirPath("./footer.html"), encode),
};
