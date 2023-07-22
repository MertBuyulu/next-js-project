"use client";

import { Tag } from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LikeTwoTone, LikeOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

// Subcomponents
const EditDeleteButtons = ({ handleEdit, handleDelete }) => {
  return (
    <div className="mt-3 flex-center gap-4 border-t border-gray-100 pt-3">
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
  );
};

const LikeButton = ({ isLiked, session, handleLikeBtnToggle }) => {
  const ButtonType = isLiked ? LikeTwoTone : LikeOutlined;
  const buttonProps = session
    ? {
        onClick: handleLikeBtnToggle,
        twoToneColor: "#ec1d43",
        className: "mt-1",
      }
    : {};

  return <ButtonType className="mt-1" {...buttonProps} />;
};

// Main Component
const PromptCard = ({
  post,
  likedPostsMap,
  handleTagClick,
  handleEdit,
  handleDelete,
}) => {
  // Constants
  const privacyOptions = {
    private: "red",
    public: "green",
  };
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Local States
  const [copied, setCopied] = useState("");
  const [isLiked, setIsLiked] = useState(null);
  const [postCardLikeCount, setPostCardLikeCount] = useState(post.likeCount);

  useEffect(() => {
    setIsLiked(likedPostsMap && likedPostsMap[post._id] ? true : false);
  }, [likedPostsMap]);

  // Functions
  const handleLikeBtnToggle = async () => {
    try {
      const res = await fetch(`/api/prompt/${post._id}/like`, {
        method: !isLiked ? "PATCH" : "DELETE",
        body: JSON.stringify({
          likedBy: session?.user.id,
        }),
      });
      const returnedPost = await res.json();

      setPostCardLikeCount(returnedPost.likeCount);
      setIsLiked(!isLiked);
    } catch (error) {
      console.log("Error liking or unliking a post", error);
    }
  };

  const handleProfileClick = () => {
    const destination_url =
      post.creator._id !== session?.user.id
        ? `/profile/${post.creator._id}?name=${post.creator.username}`
        : "/profile";

    return router.push(destination_url);
  };

  const handleCopy = () => {
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
    navigator.clipboard.writeText(post.prompt);
    setCopied(post.prompt);
    // Reset the copied text to the clickboard after 3 seconds
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
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-500">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </div>
        <Tag className="font-satoshi" color={privacyOptions[post.privacy]}>
          {post.privacy}
        </Tag>
        <div className="copy_button" onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>
      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      <div className="flex">
        <p
          className="font-inter text-sm blue_gradient cursor-pointer"
          onClick={() => {
            handleTagClick && handleTagClick(post.tag);
          }}
        >
          {post.tag}
        </p>
      </div>
      {post.privacy === "public" && (
        <div className="flex justify-end">
          <LikeButton
            session={session}
            isLiked={isLiked}
            handleLikeBtnToggle={handleLikeBtnToggle}
          />
          <span className="ml-1 tx-sm text-gray-500">{postCardLikeCount}</span>
        </div>
      )}
      {session?.user.id === post.creator._id && pathname === "/profile" && (
        <EditDeleteButtons
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PromptCard;
