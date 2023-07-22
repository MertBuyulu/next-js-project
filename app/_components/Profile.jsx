import PromptCard from "./PromptCard";

const Profile = ({
  name,
  desc,
  data,
  likedPostsMap,
  handleEdit,
  session,
  handleDelete,
}) => {
  const viewingOwnProfile =
    data[0] && session?.user.id === data[0]?.creator._id;
  const filteredData = viewingOwnProfile
    ? data
    : data.filter((post) => post.privacy === "public");

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>
      <div className="mt-10 prompt_layout">
        {filteredData.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            likedPostsMap={likedPostsMap}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
