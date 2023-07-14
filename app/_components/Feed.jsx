"use client";

import { useState, useEffect } from "react";

import PromptCard from "@app/_components/PromptCard";

// Sub Component
const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

// Main Component
const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  // fetch the users' prompts
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("api/prompt");
      // returns in form of {[post1, post2, post3, etc]}
      const data = await res.json();

      setAllPosts(data);
    };

    fetchPosts();
  }, []);

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
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
