"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFetchPosts } from "@app/_utils/hooks/useFetchPosts";

import Profile from "@app/_components/Profile";

const MyProfile = () => {
  // Constants
  const router = useRouter();
  const { data: session } = useSession();

  // Local States
  const [userPosts, setUserPosts] = useState([]);
  const [userPostsLikedByUserMap, setUserPostsLikedByUserMap] = useState({});

  const {
    posts: fetchedUserPosts,
    likedPostsMap: fetchedUserPostsLikedByUserMap,
  } = useFetchPosts({ sessionUserId: session?.user.id, fetchType: "profile" });

  useEffect(() => {
    setUserPosts(fetchedUserPosts);
    setUserPostsLikedByUserMap(fetchedUserPostsLikedByUserMap);
  }, [fetchedUserPosts, fetchedUserPostsLikedByUserMap]);

  const handleEdit = (post) => {
    router.push(`/update-post/?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = window.confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (!hasConfirmed) return;

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
      likedPostsMap={userPostsLikedByUserMap}
      session={session}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
