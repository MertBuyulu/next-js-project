import { connectToDB } from "@app/_utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    //If you want to get the _id values as strings instead of ObjectId type, you can add .lean() after the select("_id") method
    const user_liked_prompts = await Prompt.find({
      likes: { $in: [params.id] },
    })
      .select("_id")
      .lean();

    if (!user_liked_prompts)
      return new Response("No user liked prompts found", { status: 404 });

    return new Response(JSON.stringify(user_liked_prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts user liked", { status: 500 });
  }
};
