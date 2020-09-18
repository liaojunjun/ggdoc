const { once, fs, readline, outDir, encode } = require("./index");

// 创建文件夹
function mkDir(url) {
  fs.mkdirSync(outDir + url, { recursive: true });
}
// 创建文件
function mkFile(files, url) {
  files.forEach((file) => {
    const p = outDir + url + "/" + file;
    try {
      fs.open(p, "wx", (err, fd) => {
        if (err) {
          if (err.code === "EEXIST") {
            return;
          }
          throw err;
        }
        fs.writeFileSync(p, "", encode);
      });
    } catch (error) {}
  });
}

// 获取行偏移
const lineOffset = (line) => line.length - line.replace(/^( +)/, "").length;

// 获取父级
const getFather = (cur) => (cur.father ? { ...cur.father } : null);

// 创建路径
const createPath = (cur) => {
  let url = [cur.name];
  const father = cur.father;
  if (father) {
    url = url.concat(createPath(father));
  }
  return url;
};

const fileList = [];

async function create(inputTxt, callback) {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputTxt),
    crlfDelay: Infinity,
  });

  let prev;

  rl.on("line", (line) => {
    let [dir, ...files] = line.split(" ").filter(Boolean);

    if (dir.includes(".")) {
      files.unshift(dir);
      dir = "";
    }
    files = files.filter((f) => f.includes("."));

    const info = {
      name: dir,
      files,
      offset: lineOffset(line),
    };

    if (info.offset !== 0) {
      if (prev) {
        if (prev.offset < info.offset) {
          info.father = { ...prev };
        } else if (prev.offset === info.offset) {
          info.father = { ...prev.father };
        } else {
          let frame = getFather(prev);
          while (frame && info.offset !== frame.offset) {
            frame = getFather(frame);
          }
          info.father = { ...frame.father };
        }
      }
    }
    info.url = createPath(info).reverse().join("/");
    mkDir(info.url);
    mkFile(info.files, info.url);
    prev = info;
    fileList.push(info);
  });
  await once(rl, "close");
  callback(fileList);
}

module.exports = create;
