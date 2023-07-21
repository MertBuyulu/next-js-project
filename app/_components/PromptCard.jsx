"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import { Tag } from "antd";
import { LikeTwoTone, LikeOutlined } from "@ant-design/icons";

const PromptCard = ({
  post,
  promptIdsLikedByUserDict,
  handleTagClick,
  handleEdit,
  handleDelete,
  session,
}) => {
  const privacyOptions = {
    private: "red",
    public: "green",
  };
  const router = useRouter();
  const pathname = usePathname();

  // local states
  const [copied, setCopied] = useState("");
  // promptIdsLikedByUserDict is null if no user is currently logged in
  const [isLiked, setIsLiked] = useState();
  const [postCard, setPostCard] = useState(post);

  useEffect(() => {
    setIsLiked(
      promptIdsLikedByUserDict && promptIdsLikedByUserDict[post._id]
        ? true
        : false
    );
  }, [promptIdsLikedByUserDict]);

  const handleLikeBtnToggle = async () => {
    try {
      // make a post request to add a new like clicked by the current user
      if (!isLiked) {
        const likeRes = await fetch(`/api/prompt/${postCard._id}/like`, {
          method: "PATCH",
          body: JSON.stringify({
            likedBy: session?.user.id,
          }),
        });
        const likedPost = await likeRes.json();
        setPostCard(likedPost);
        setIsLiked(true);
        return;
      }

      // make a delete request to remove the like from this post
      const unlikeRes = await fetch(`/api/prompt/${postCard._id}/like`, {
        method: "DELETE",
        body: JSON.stringify({
          likedBy: session?.user.id,
        }),
      });

      const unlikedPost = await unlikeRes.json();
      setPostCard(unlikedPost);
      setIsLiked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = () => {
    // 1a. the post belongs not to the current user
    // 1b. the post belongs to the current user
    // 2a. direct user to "/profile/:id?name=<user_name>"
    // 2b. direct user to the url "/profile"
    if (postCard.creator._id !== session?.user.id) {
      // provide the username within the url
      return router.push(
        `/profile/${post.creator._id}?name=${post.creator.username}`
      );
    }
    router.push("/profile");
  };

  const handleCopy = () => {
    setCopied(postCard.prompt);
    // reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
    navigator.clipboard.writeText(postCard.prompt);
    // reset the copied text to the clickboard after 3 seconds
    setTimeout(() => {
      setCopied("");
    }, 3000);
  };

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={postCard.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-500">
              {postCard.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {postCard.creator.email}
            </p>
          </div>
        </div>
        <Tag className="font-satoshi" color={privacyOptions[postCard.privacy]}>
          {postCard.privacy}
        </Tag>
        <div className="copy_button" onClick={handleCopy}>
          <Image
            src={
              copied === postCard.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === postCard.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>
      <p className="my-4 font-satoshi text-sm text-gray-700">
        {postCard.prompt}
      </p>
      <div className="flex">
        <p
          className="font-inter text-sm blue_gradient cursor-pointer"
          // to direct users to similarly tagged posts once clicked
          onClick={() => {
            handleTagClick && handleTagClick(postCard.tag);
          }}
        >
          {postCard.tag}
        </p>
      </div>
      {/* Like feature is not applicable to private posts shared by users */}
      {postCard.privacy === "public" &&
        (isLiked ? (
          <div className="flex justify-end">
            <LikeTwoTone
              twoToneColor="#ec1d43"
              className="mt-1"
              onClick={session ? handleLikeBtnToggle : undefined}
            />
            <span className="ml-1 tx-sm text-gray-500">
              {postCard.likeCount}
            </span>
          </div>
        ) : (
          <div className="flex justify-end">
            <LikeOutlined
              className="mt-1 text-gray-500"
              onClick={session ? handleLikeBtnToggle : undefined}
            />
            <span className="ml-1 tx-sm text-gray-500">
              {postCard.likeCount}
            </span>
          </div>
        ))}
      {session?.user.id === postCard.creator._id && pathname === "/profile" && (
        <div className="mt-3 flex-center gap-4 border-t border-gray-100 pt-3'">
          <p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
