import PromptCard from "./PromptCard";

const Profile = ({ name, desc, data, handleEdit, session, handleDelete }) => {
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>
      <div className="mt-10 prompt_layout">
        {/* if the user see their profile, display all posts */}
        {/* if the user see someone else's profile, display only the public posts */}
        {session?.user.id === data[0]?.creator._id
          ? data.map((post) => (
              <PromptCard
                key={post._id}
                post={post}
                handleEdit={() => handleEdit && handleEdit(post)}
                handleDelete={() => handleDelete && handleDelete(post)}
              />
            ))
          : data
              .filter((post) => post.privacy === "public")
              .map((post) => (
                <PromptCard
                  key={post._id}
                  post={post}
                  handleEdit={() => handleEdit && handleEdit(post)}
                  handleDelete={() => handleDelete && handleDelete(post)}
                />
              ))}
      </div>
    </section>
  );
};

export default Profile;
