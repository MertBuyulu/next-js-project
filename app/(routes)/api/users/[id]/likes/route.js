import { connectToDB } from "@app/_utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const likedBy = req.nextUrl.searchParams.get("likedBy");

    // Base condition
    const conditions = { likes: { $in: [params.id] } };

    if (likedBy) {
      conditions.creator = params.id;

      if (likedBy !== "self") conditions.likes = { $in: [likedBy] };
    }

    const user_liked_prompts = await Prompt.find(conditions).populate(
      "creator"
    );

    if (!user_liked_prompts)
      return new Response("No user liked prompts found", { status: 404 });

    return new Response(JSON.stringify(user_liked_prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts user liked", { status: 500 });
  }
};
