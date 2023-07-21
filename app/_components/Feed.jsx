"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";

import PromptCard from "@app/_components/PromptCard";

// Sub Component
const PromptCardList = ({
  data,
  promptIdsLikedByUserDict,
  handleTagClick,
  session,
}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          promptIdsLikedByUserDict={promptIdsLikedByUserDict}
          handleTagClick={handleTagClick}
          session={session}
        />
      ))}
    </div>
  );
};

// Main Component
const Feed = () => {
  const { data: session } = useSession();

  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  // this will be an dict object where key and value will map to the same thing
  const [likedPostsByCurrentUser, setLikedPostsByCurrentUser] = useState([]);

  const promptIdsLikedByUserDict = useMemo(() => {
    return Object.fromEntries(
      likedPostsByCurrentUser.map((likedPrompt) => [
        likedPrompt._id,
        likedPrompt._id,
      ])
    );
  }, [likedPostsByCurrentUser]);

  // fetch all posts
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const postsRes = await fetch("api/prompt");

        if (!postsRes.ok) throw new Error("Failed to fetch all posts");

        const posts = await postsRes.json();
        setAllPosts(posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllPosts();
  }, []);

  // fetch the posts liked by the session user
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchLikedPosts = async () => {
      try {
        const url = `api/users/${session.user.id}/likes`;
        const likedPostsRes = await fetch(url);
        if (!likedPostsRes.ok)
          throw new Error("Failed to fetch posts liked by current user");
        const likedPosts = await likedPostsRes.json();
        setLikedPostsByCurrentUser(likedPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLikedPosts();
  }, [session]);

  const filterPosts = (searchText) => {
    // 'i' flag for case-insensitive search
    const regex = new RegExp(searchText, "i");
    const filteredPosts = allPosts.filter(
      (post) =>
        regex.test(post.creator.username) ||
        regex.test(post.tag) ||
        regex.test(post.prompt)
    );
    return filteredPosts;
  };

  // update the text within the search bar
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPosts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  // clicking a tag within a prompt prefills the search bar by its value
  const handleTagClick = (tagName) => {
    // set the tag name to be the search text
    setSearchText(tagName);
    // filter the search results based on the tag name
    const searchResult = filterPosts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form action="" className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          required
          onChange={handleSearchChange}
          value={searchText}
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={searchText ? searchedResults : allPosts}
        promptIdsLikedByUserDict={promptIdsLikedByUserDict}
        //handleLikeBtnToggle={handleLikeBtnToggle}
        handleTagClick={handleTagClick}
        session={session}
      />
    </section>
  );
};

export default Feed;
