const oauth = require("..\\configs\\oauth.js");
const gmailService = require(".\\GmailService.js");
const utilityService = require(".\\UtilityService.js");

const MODULE_NAME = utilityService.getModuleName(__filename);
const ORACLE_IDENTITY_SEARCH_STRING = "Your Oracle identity verification";
// const ORACLE_IDENTITY_SEARCH_STRING = "abrakadabra";

async function deleteOtps() {
  const logger = utilityService.getLogger(MODULE_NAME);

  logger.info("SERVICE::START");

  const auth = await oauth.authorize();

  const messages = await gmailService.listMessages(
    auth,
    ORACLE_IDENTITY_SEARCH_STRING
  );

  if (messages.length > 0) {
    await gmailService.deleteMessages(
      auth,
      messages.map((message) => message.id)
    );
  }

  logger.info("SERVICE::END");

  return;
}

async function getOtp() {
  const logger = utilityService.getLogger(MODULE_NAME);

  logger.info("SERVICE::START");

  let intervalCount = 0;
  let intervalDelay = 500;

  const auth = await oauth.authorize();

  await utilityService.sleep(intervalDelay);
  intervalDelay *= 2;

  do {
    intervalCount++;

    const messages = await gmailService.listMessages(
      auth,
      ORACLE_IDENTITY_SEARCH_STRING
    );

    if (messages.length > 1) {
      throw new Error("Too many OTP(s) to select from.");
    } else if (messages.length === 0) {
      if (intervalCount < 5) {
        await utilityService.sleep(intervalDelay);

        intervalDelay *= 2;
      }
    } else {
      const message = await gmailService.getMessage(auth, messages[0].id);

      const otp = parseInt(message.snippet.match(/code: (\d+)/)[1]);

      logger.info("SERVICE::END");

      return otp;
    }
  } while (intervalCount < 5);

  throw new Error(
    "Oracle mail with the OTP couldn't be located even after multiple retries."
  );
}

module.exports = {
  deleteOtps,
  getOtp,
};
