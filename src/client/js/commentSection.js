const form = document.getElementById("commentForm");
const btn = form.querySelector("button");
const videoContainer = document.getElementById("videoContainer");
const commentContainer = document.querySelector(".video__comment");

const handleSubmit = async (e) => {
  const textarea = form.querySelector("textarea");
  e.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;
  // how to get user id from session?
  // const user =
  await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  textarea.value = "";
  window.location.reload();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
