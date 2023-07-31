"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useFetchPosts } from "@app/_utils/hooks/useFetchPosts";
import PromptCard from "@app/_components/PromptCard";

// Sub Component
const PromptCardList = ({ data, likedPostsMap, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          likedPostsMap={likedPostsMap}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

// Main Component
const Feed = () => {
  // Constants
  const { data: session } = useSession();

  // Local States
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [postsLikedBySessionUserMap, setPostsLikedBySessionUserMap] = useState(
    {}
  );

  const {
    posts: fetchedPosts,
    likedPostsMap: fetchedPostsLikedBySessionUserMap,
  } = useFetchPosts({ sessionUserId: session?.user.id, fetchType: "feed" });

  useEffect(() => {
    setAllPosts(fetchedPosts);
    setPostsLikedBySessionUserMap(fetchedPostsLikedBySessionUserMap);
  }, [fetchedPosts, fetchedPostsLikedBySessionUserMap]);

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
          className="search_input"
        />
      </form>

      <PromptCardList
        data={searchText ? searchedResults : allPosts}
        likedPostsMap={postsLikedBySessionUserMap}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
