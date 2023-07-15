"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  // default is set to public unless the post being edited is labelled private
  const [radioBtnSelected, setRadioBtnSelected] = useState("");

  useEffect(() => {
    setRadioBtnSelected(post.privacy || "public");
  }, [post.privacy]);

  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc text-left max-w-d">
        {type} and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Your AI Prompt
          </span>
          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Write your prompt here..."
            required
            className="form_textarea"
          />
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Tag {` `}
            <span className="font-normal">
              (#product, #webdevelopment, #idea)
            </span>
          </span>
          <input
            value={post.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            placeholder="#Tag"
            required
            className="form_input"
          />
        </label>
        <div className="flex flex-col">
          <div className="mb-1">
            <label>
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={radioBtnSelected === "public"}
                onChange={(e) => {
                  setPost({ ...post, privacy: e.target.value });
                  setRadioBtnSelected(e.target.value);
                }}
                className="text-gray-500 mr-2"
              />
              Public
            </label>
          </div>
          <div className="">
            <label>
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={radioBtnSelected === "private"}
                onChange={(e) => {
                  setPost({ ...post, privacy: e.target.value });
                  setRadioBtnSelected(e.target.value);
                }}
                className="text-gray-500 mr-2"
              />
              Private
            </label>
          </div>
        </div>
        <div className="flex-end mx-1 mb-1 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 rounded-full text-sm bg-primary-orange text-white"
          >
            {submitting ? `${type}...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
