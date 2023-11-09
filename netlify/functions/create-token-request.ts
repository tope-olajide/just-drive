import { Handler } from "@netlify/functions";
import Ably from "ably/promises";
import dotenv from "dotenv";

dotenv.config();

const handler: Handler = async (event, context) => {
  const client = new Ably.Realtime(process.env.ABLY_CONNECTION_KEY!);

  try {
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: "host",
    });
    console.log({ tokenRequestData });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:8888"
      },
      body: JSON.stringify(tokenRequestData),
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};

export { handler };
