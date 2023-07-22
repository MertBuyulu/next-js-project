import { connectToDB } from "@app/_utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  const findLiked = req.nextUrl.searchParams.get("findLiked");

  try {
    await connectToDB();

    if (!findLiked) {
      const user_prompts = await Prompt.find({ creator: params.id }).populate(
        "creator"
      );
      return new Response(JSON.stringify(user_prompts), { status: 200 });
    }

    const liked_user_prompts_by_user = await Prompt.find({
      creator: params.id,
      likes: { $in: [params.id] },
    })
      .select("_id")
      .lean();

    return new Response(JSON.stringify(liked_user_prompts_by_user), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch user's prompts", { status: 500 });
  }
};
