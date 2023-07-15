import { connectToDB } from "@app/_utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return new Response("Prompt Not Found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    // 500 -> server error
    return new Response("Failed to fetch user's prompt", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const { prompt, tag, privacy } = await req.json();
  try {
    await connectToDB();

    // fetdh the existing document
    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt)
      return new Response("Prompt not found", { status: 404 });

    // update the prompt
    existingPrompt.prompt = prompt;
    existingPrompt.tag = existingPrompt.tag.startsWith("#") ? tag : `#${tag}`;
    existingPrompt.privacy = privacy;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 201 });
  } catch (error) {
    // 500 -> server error
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    // reference: https://www.educative.io/answers/what-is-findbyidanddelete-in-mongoose
    const deleted_prompt = await Prompt.findByIdAndRemove(params.id);

    return new Response(
      `"Prompt deleted successfully. Deleted Entry: ${JSON.stringify(
        deleted_prompt
      )}`,
      {
        status: 200,
      }
    );
  } catch (error) {
    // 500 -> server error
    return new Response("Error deleting prompt", { status: 500 });
  }
};
