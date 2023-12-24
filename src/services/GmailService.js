const pino = require("pino");
const { google } = require("googleapis");

const utilityService = require(".\\UtilityService.js");

const MODULE_NAME = utilityService.getModuleName(__filename);

/**
 * Returns a list of message and thread ids.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns
 */
async function listMessages(auth, searchString) {
  const logger = utilityService.getLogger(MODULE_NAME);

  logger.info("SERVICE::START");

  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    q: searchString,
  });

  let messages = res.data.messages;

  if (!messages || messages.length === 0) {
    logger.debug(`No message found with search string: '${searchString}'`);

    messages = [];
  }

  logger.info("SERVICE::END");

  return messages;
}

async function deleteMessages(auth, ids) {
  const logger = utilityService.getLogger(MODULE_NAME);

  logger.info("SERVICE::START");

  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.batchDelete({
    userId: "me",
    requestBody: {
      ids,
    },
  });

  logger.info("SERVICE::END");

  return;
}

async function getMessage(auth, id) {
  const logger = utilityService.getLogger(MODULE_NAME);

  logger.info("SERVICE::START");

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const res = await gmail.users.messages.get({
      userId: "me",
      id,
    });

    const message = res.data;

    logger.info("SERVICE::END");

    return message;
  } catch (err) {
    throw new Error(`No message found with id: ${id}`);
  }
}

module.exports = {
  listMessages,
  deleteMessages,
  getMessage,
};
