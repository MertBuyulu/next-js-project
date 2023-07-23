import { useState, useEffect } from "react";

/**
 * Converts an object into a query string to be used in a URL.
 *
 * Each key-value pair in the object will be converted into a string
 * of the format "key=value". All these strings are then joined
 * together with an "&" character.
 *
 * @param {Object} params - The object to be converted into a query string.
 * @returns {string} - The generated query string, or `undefined` if `params` is falsy.
 */

const objectToQueryString = (params) => {
  return (
    params &&
    Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&")
  );
};

const createEndpoint = (
  baseUrl,
  destinationId = "",
  destinationPath = "",
  queryParams = null
) => {
  const query = objectToQueryString(queryParams);
  const queryString = query ? `?${query}` : "";

  const endpoint = `${baseUrl}/${destinationId}/${destinationPath}${queryString}`;
  return endpoint;
};

export const useFetchPosts = (options) => {
  const { sessionUserId, userId = null, fetchType } = options;

  const [data, setData] = useState({
    posts: [],
    likedPostsMap: {},
  });

  const fetchFromEndpoint = async (endpoint) => {
    if (!endpoint) return [];

    try {
      const res = await fetch(endpoint, { method: "GET" });
      if (res && !res.ok) throw new Error(`Failed to fetch from ${endpoint}`);
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      // Conditions
      const actualUserId = userId || sessionUserId;

      const postsEndPoint =
        fetchType === "feed"
          ? createEndpoint("api/prompt")
          : createEndpoint("/api/users", actualUserId, "posts");

      const likedPostsEndpoint =
        sessionUserId && actualUserId
          ? fetchType === "feed"
            ? createEndpoint("/api/users", actualUserId, "likes")
            : actualUserId === sessionUserId
            ? createEndpoint("/api/users", actualUserId, "likes", {
                likedBy: "self",
              })
            : createEndpoint("/api/users", actualUserId, "likes", {
                likedBy: sessionUserId,
              })
          : undefined;

      const posts = await fetchFromEndpoint(postsEndPoint);
      const likedPosts = await fetchFromEndpoint(likedPostsEndpoint);

      const likedPostsMap = Object.fromEntries(
        likedPosts.map((likedPost) => [likedPost._id, likedPost])
      );

      setData({ posts, likedPostsMap });
    };

    fetchPosts();
  }, [sessionUserId, userId]);

  return data;
};
