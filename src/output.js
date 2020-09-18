const {
  marked,
  fs,
  encode,
  header,
  footer,
  outDocFile,
  outDir,
} = require("./index");

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * 创建随机字符
 */
function randomChar() {
  const i = Math.floor(Math.random() * chars.length);
  return chars[i];
}

/**
 * 创建随机字符串
 * @param length 字符串长度
 */
function randomString(length = 6) {
  return Array.from({ length }, () => randomChar()).join("");
}

// 收集目录文件
const navArr = [];

const createLink = (item) =>
  `<div style="margin-left:${item.offset}em">${
    item.id
      ? `<a href="#${item.id}">${item.name}</a><br/>`
      : `<strong>${item.name}</strong><br/>`
  }</div>`;

function writeNav() {
  fs.appendFileSync(
    outDocFile,
    `<div id="nav">${navArr.reduce(
      (acc, cur) => (acc += createLink(cur)),
      ""
    )}</div>`,
    encode
  );
}

function writeToOut(content) {
  fs.appendFileSync(outDocFile, content, encode);
}

// 获取文件名称
const shortAndSuffix = (file) => {
  const endPointIndex = file.lastIndexOf(".");
  if (endPointIndex != -1) {
    return [file.slice(0, endPointIndex), file.slice(endPointIndex)];
  }
  return [file];
};

function fieldset(legend, name, content) {
  return `
      <fieldset id='${legend}'>
      <legend>${name}</legend>
      ${content}
      </fieldset>
      `;
}

// 读写
function mdToHtml(newPath, path) {
  const html = marked(fs.readFileSync(path, encode));
  fs.writeFileSync(newPath, html, encode);
  return html;
}

// 读取现有文件数组
function readList(list, dir) {
  console.log(list);
  list.forEach(({ name, files, url, offset }) => {
    const path = dir + "/" + url + "/";
    name &&
      navArr.push({
        name,
        offset,
      });
    files.forEach((file) => {
      const [short, suffix] = shortAndSuffix(file);
      if (suffix === ".md") {
        const id = "_" + randomString();
        navArr.push({
          id,
          name: short,
          offset: offset + (name ? 2 : 0),
        });
        const html = mdToHtml(path + short + ".html", path + file, id);
        writeToOut(fieldset(id, short, html));
      }
    });
  });
}

function output(list) {
  fs.writeFileSync(outDocFile, "", encode);
  writeToOut(header);
  writeToOut('<div id="page">');
  readList(list, outDir);
  writeToOut("</div>");
  writeNav();
  writeToOut(footer);
}

module.exports = output;
