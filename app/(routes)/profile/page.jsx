"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@app/_components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // fetch all posts associated with current user
    const fetchPosts = async () => {
      const res = await fetch(`api/users/${session?.user.id}/posts`);
      // returns in form of {[post1, post2, post3, etc]}
      const data = await res.json();

      setUserPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-post/?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = window.confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (!hasConfirmed)
      // user decides not to the delete, just return
      return;

    // delete the post
    try {
      const res = await fetch(`api/prompt/${post._id}`, {
        method: "DELETE",
        body: JSON.stringify(post),
      });

      const filteredPosts = userPosts.filter((item) => item._id !== post._id);

      setUserPosts(filteredPosts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile. Explore your exceptional prompts and be inspired by the power of their imagination."
      data={userPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
