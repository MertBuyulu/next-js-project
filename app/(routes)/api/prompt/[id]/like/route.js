import { connectToDB } from "@app/_utils/database";
import Prompt from "@models/prompt";

export const PATCH = async (req, { params }) => {
  // constains the id of the user who liked the post
  const { likedBy } = await req.json();
  try {
    await connectToDB();

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      params.id,
      { $push: { likes: likedBy } },
      { new: true }
    );

    if (!updatedPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedPrompt), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify("Failed to add a like to the selected post"),
      { status: 500 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  // constains the id of the user who liked the post
  const { likedBy } = await req.json();
  try {
    await connectToDB();

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      params.id,
      { $pull: { likes: likedBy } },
      { new: true }
    );

    if (!updatedPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedPrompt), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify("Failed to remove a like from the selected post"),
      { status: 500 }
    );
  }
};
