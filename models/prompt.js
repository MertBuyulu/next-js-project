import { Schema, model, models } from "mongoose";

const PromptSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    prompt: {
      type: String,
      required: [true, "Prompt is required."],
    },
    tag: {
      type: String,
      required: [true, "Tag is required."],
    },
    privacy: {
      type: String,
      required: [true, "Privacy option is required."],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Reference for why the below config is needed: https://mongoosejs.com/docs/guide.html#definition
    toJSON: { virtuals: true },
  }
);

// Define a virtual property to calculate the number of likes
PromptSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;

/* When do we user virtual methods in MongoDB
In Mongoose, the virtual method is used to define virtual properties on a schema.
Virtual properties are additional properties that you can define on a schema but are not persisted to the database.
They are computed properties that are derived from other fields or perform some calculations or transformations on existing data.
*/
