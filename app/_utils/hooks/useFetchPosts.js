import { useState, useEffect } from "react";

export const useFetchPosts = (options) => {
  const { sessionUserId, userId = null, fetchType } = options;

  const [data, setData] = useState({
    posts: [],
    likedPostsMap: {},
  });

  useEffect(() => {
    const fetchPosts = async () => {
      // Conditions
      const actualUserId = userId || sessionUserId;

      const postsEndPoint =
        fetchType === "feed"
          ? "api/prompt"
          : `/api/users/${actualUserId}/posts`;

      const likedPostsEndpoint = actualUserId
        ? fetchType === "feed"
          ? `/api/users/${actualUserId}/likes`
          : actualUserId === sessionUserId
          ? `/api/users/${actualUserId}/likes?likedBy=self`
          : `/api/users/${actualUserId}/likes?likedBy=${sessionUserId}`
        : undefined;

      const endpoints = [postsEndPoint];

      if (likedPostsEndpoint) endpoints.push(likedPostsEndpoint);

      const [postsRes, likedPostsRes] = await Promise.all(
        endpoints.map((endpoint) => fetch(endpoint, { method: "GET" }))
      );

      if (!postsRes.ok) {
        throw new Error(
          "Failed to fetch all posts created by all users or a specific one"
        );
      }

      if (!likedPostsRes.ok) {
        throw new Error("Failed to fetch posts liked by self/others");
      }

      const posts = await postsRes.json();
      const likedPosts = await likedPostsRes.json();

      const likedPostsMap = Object.fromEntries(
        likedPosts.map((likedPost) => [likedPost._id, likedPost])
      );

      setData({ posts, likedPostsMap });
    };

    fetchPosts();
  }, [sessionUserId, userId]);

  return data;
};
