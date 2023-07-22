"use client";

import Profile from "@app/_components/Profile";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFetchPosts } from "@app/_utils/hooks/useFetchPosts";

const UserProfile = ({ params }) => {
  // Constants
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const username = searchParams.get("name");

  // Local States
  const [userPosts, setUserPosts] = useState([]);
  const [userPostsLikedBySessionUserMap, setUserPostsLikedBySessionUserrMap] =
    useState({});

  const {
    posts: fetchedUserPosts,
    likedPostsMap: fetchedUserPostsLikedByUserMap,
  } = useFetchPosts({
    sessionUserId: session?.user.id,
    userId: params.id,
    fetchType: "profile",
  });

  useEffect(() => {
    setUserPosts(fetchedUserPosts);
    setUserPostsLikedBySessionUserrMap(fetchedUserPostsLikedByUserMap);
  }, [fetchedUserPosts, fetchedUserPostsLikedByUserMap]);

  return (
    <Profile
      name={username}
      likedPostsMap={userPostsLikedBySessionUserMap}
      desc={`Welcome to ${username}'s personalized profile. Explore ${username}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
