"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import PromptCard from "@app/_components/PromptCard";

// Sub Component
const PromptCardList = ({
  data,
  likedPostsByCurrentUser,
  handleTagClick,
  session,
}) => {
  // const promptLikedDict = Object.fromEntries(
  //   likedPostsByCurrentUser.map(likedPrompt[(likedPrompt._id, likedPrompt._id)])
  // );

  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          // promptDict={promptLikedDict}
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
  // this will be an dict object where key and value will map to the same thing
  const [likedPostsByCurrentUser, setLikedPostsByCurrentUser] = useState([]);

  // we have posts -> {fields... , likes: [Object_ID, Creator_ID]}
  // we need to find a way to look up for user's session id to match with one of the likes entiries' creator id if present
  // when we fetch the posts data, we can extract the likes array and create a dict in form of {[creator_id]: {[object_id, creator_id]}}
  // we then can pass this dict to the Prompt_Card component and do the necesaary logic to figure out whether the post is liked by the current user

  // fetch posts liked by the current user
  //

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  // fetch the users' prompts
  useEffect(() => {
    const fetchPosts = async () => {
      const res1 = await fetch("api/prompt");
      // returns in form of {[post1, post2, post3, etc]}
      const prompts = await res1.json();

      // const res2 = await fetch(`/api/users/${session?.user.id}/likes`);

      //const likedPosts = res2.json();

      setAllPosts(prompts);
      // setLikedPostsByCurrentUser(likedPosts);
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
        likedPostsByCurrentUser={likedPostsByCurrentUser}
        handleTagClick={handleTagClick}
        session={session}
      />
    </section>
  );
};

export default Feed;
