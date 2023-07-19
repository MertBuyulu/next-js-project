import { connectToDB } from "@app/_utils/database";
import Prompt from "@models/prompt";

export const POST = async (req) => {
  const { userId, prompt, tag, privacy } = await req.json();
  try {
    await connectToDB();
    const newPrompt = new Prompt({
      creator: userId,
      prompt,
      privacy: privacy,
      tag: tag.startsWith("#") ? tag : `#${tag}`,
      likes: [],
    });

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    // 500 -> server error
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
