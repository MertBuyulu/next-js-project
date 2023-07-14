"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const [copied, setCopied] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleProfileClick = () => {
    // 1a. the post belongs not to the current user
    // 1b. the post belongs to the current user
    // 2a. direct user to "/profile/:id?name=<user_name>"
    // 2b. direct user to the url "/profile"
    if (post.creator._id !== session?.user.id) {
      // provide the username within the url
      return router.push(
        `/profile/${post.creator._id}?name=${post.creator.username}`
      );
    }
    router.push("/profile");
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    // reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
    navigator.clipboard.writeText(post.prompt);
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
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        // to direct users to similarly tagged posts once clicked
        onClick={() => {
          handleTagClick && handleTagClick(post.tag);
        }}
      >
        {post.tag}
      </p>
      {session?.user.id == post.creator._id && pathname == "/profile" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3'">
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
