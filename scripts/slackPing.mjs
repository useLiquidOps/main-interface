import axios from "axios";

export async function slackPing(message) {
  if (!process.env.SLACK_CHANNEL_ID || !process.env.SLACK_TOKEN) {
    throw new Error("Please specify a slack variables in the .env");
  }

  return await axios
    .post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: process.env.SLACK_CHANNEL_ID,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    )
    .catch((error) => console.error(error));
}
