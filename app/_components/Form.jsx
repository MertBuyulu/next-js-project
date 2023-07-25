"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

// Subcomponent
const FormField = ({ label, value, fieldType, placeholder, onChange }) => {
  // React treats components starting with a capital letter as custom
  // components and those starting with a lowercase letter as DOM tags
  const Field = fieldType;
  return (
    <label>
      <span className="font-satoshi font-semibold text-base text-gray-700">
        {label}
      </span>
      <Field
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className={`form_${fieldType}`}
      />
    </label>
  );
};

const FormRadioButton = ({
  label,
  value,
  selectedValue,
  handlePrivacySelection,
}) => {
  return (
    <div className="mb-1">
      <label>
        <input
          type="radio"
          name="privacy"
          value={value}
          checked={selectedValue === value}
          onChange={handlePrivacySelection}
          className="text-gray-500 mr-2"
        />
        {label}
      </label>
    </div>
  );
};

// Main component
const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  // default is set to public unless the post being edited is labelled private
  const [radioBtnSelected, setRadioBtnSelected] = useState("");

  useEffect(() => {
    setRadioBtnSelected(post.privacy || "public");
    setPost({ ...post, privacy: post.privacy || "public" });
  }, [post.privacy]);

  const handlePrivacySelection = (e) => {
    setPostProperty("privacy", e.target.value);
    setRadioBtnSelected(e.target.value);
  };

  const setPostProperty = (key, value) => {
    setPost((prevPost) => ({ ...prevPost, [key]: value }));
  };

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
        <FormField
          label="Your AI Prompt"
          value={post.prompt}
          fieldType="textarea"
          placeholder="Write your prompt here..."
          onChange={(e) => setPostProperty("prompt", e.target.value)}
        />
        <FormField
          label={`Tag (#product, #webdevelopment, #idea)`}
          value={post.tag}
          fieldType="input"
          placeholder="#Tag"
          onChange={(e) => setPostProperty("tag", e.target.value)}
        />
        <div className="flex flex-col">
          <FormRadioButton
            label="Public"
            value="public"
            selectedValue={radioBtnSelected}
            handlePrivacySelection={handlePrivacySelection}
          />
          <FormRadioButton
            label="Private"
            value="private"
            selectedValue={radioBtnSelected}
            handlePrivacySelection={handlePrivacySelection}
          />
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
