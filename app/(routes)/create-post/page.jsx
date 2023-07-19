"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@app/_components/Form";

const CreatePost = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [post, setPost] = useState({
    prompt: "",
    tag: "",
    privacy: "",
    likes: [],
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // needed state for a loader
    setSubmitting(true);

    try {
      const res = await fetch("api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
          privacy: post.privacy,
          likes: [],
        }),
      });

      if (res.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={handleSubmit}
    />
  );
};

export default CreatePost;
