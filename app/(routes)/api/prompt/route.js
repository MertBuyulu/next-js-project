import { connectToDB } from "@app/_utils/database";
import Prompt from "@models/prompt";

export const GET = async (req) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({}).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    // 500 -> server error
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
