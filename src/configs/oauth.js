const fs = require("fs").promises;
const path = require("path");
const process = require("process");

const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");

const gmailScopes = require("..\\..\\configs\\GmailScopes.json");
const paths = require("..\\..\\configs\\Paths.json").paths;

const SCOPES = gmailScopes.scopes;

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), paths.token);
const CREDENTIALS_PATH = path.join(process.cwd(), paths.credentials);

/**
 * Reads previously authorized credentials from the saved file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();

  if (!client) {
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    if (client.credentials) {
      await saveCredentials(client);
    }

    console.log("User has been successfully authenticated.");
  }

  return client;
}

module.exports = {
  authorize,
};
