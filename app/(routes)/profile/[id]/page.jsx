"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@app/_components/Profile";

const UserProfile = ({ params }) => {
  const [userPosts, setUserPosts] = useState([]);

  const searchParams = useSearchParams();
  const username = searchParams.get("name");

  useEffect(() => {
    // fetch all posts associated with a single user
    const fetchPosts = async () => {
      // TODO: understand why you need "/" before api/... ,which is not needed for fetching current user's posts.
      const res = await fetch(`/api/users/${params?.id}/posts`);
      // returns in form of {[post1, post2, post3, etc]}
      const data = await res.json();

      setUserPosts(data);
    };

    if (params?.id) fetchPosts();
  }, [params?.id]);

  return (
    <Profile
      name={username}
      desc={`Welcome to ${username}'s personalized profile. Explore ${username}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
