/**
 * 驼峰格式化文本
 * @param content 待驼峰格式化文本
 * @returns {string} 已驼峰格式化文本
 */
export function camelize(content) {
  if (content.length === 0) return content;

  let n;
  let result;
  let words = content.split(/[_-]/);

  // single word with first character already lowercase, return untouched
  if (words.length === 1 && words[0][0].toLowerCase() === words[0][0]) {
    return content;
  }

  result = words[0].toLowerCase();
  for (n = 1; n < words.length; n++) {
    result =
      result +
      words[n].charAt(0).toUpperCase() +
      words[n].substring(1).toLowerCase();
  }

  return result;
}

/**
 * 驼峰格式化前置拼接
 * @param prepend 前置拼接字符
 * @param content 待驼峰格式化文本
 * @returns {string} 已驼峰格式化文本
 */
export function prependWithCamelize(prepend, content) {
  content = camelize(content);
  return prepend + content[0].toUpperCase() + content.substring(1);
}

/**
 * 数值格式化，保留两位小数
 * @param content 待格式化数值
 * @returns {string} 已数值格式化文本
 */
export function formatNum(content) {
  return (
    content.toString().match(/\d+/) +
    "." +
    (content.toString().match(/\.\d{0,2}/) * 1)
      .toString()
      .padEnd(4, "0")
      .substr(2, 2)
  );
}

/**
 * 生成项目名称
 * @returns {string}
 */
export function generateProjectName() {
  var projectDate = new Date(
    +new Date() - (new Date().getTimezoneOffset() / 60) * 3600 * 1000
  );
  var projectName =
    projectDate
      .toJSON()
      .substr(0, 19)
      .replace(/[-|:|T]/g, "") +
    "_" +
    Math.random()
      .toString(36)
      .slice(-4);
  return projectName;
}
