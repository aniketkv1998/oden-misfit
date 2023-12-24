const path = require("path");
const pino = require("pino");

async function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function getTimestamp(date) {
  const dateVal = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return `${year}-${month}-${dateVal}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function getLogger(moduleName) {
  return pino({
    level: "debug",
    formatters: {
      level(label, number) {
        return { level: label };
      },
      bindings(bindings) {
        return { name: moduleName + "::" + getLogger.caller.name };
      },
    },
    timestamp: () => `, "time":"${getTimestamp(new Date(Date.now()))}"`,
  });
}

function getModuleName(fileName) {
  return path.parse(fileName).name;
}

module.exports = {
  sleep,
  getModuleName,
  getLogger,
};
