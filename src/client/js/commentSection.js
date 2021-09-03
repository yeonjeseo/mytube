const form = document.getElementById("commentForm");
const btn = form.querySelector("button");
const videoContainer = document.getElementById("videoContainer");
const commentContainer = document.querySelector(".video__comment");
const deleteBtns = document.querySelectorAll(".delete-comment");

//global variable

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const comment = document.createElement("span");

  newComment.className = "video__comment";
  newComment.dataset.id = id;
  icon.className = "fas fa-comment";
  comment.textContent = ` ${text}`;

  newComment.appendChild(icon);
  newComment.appendChild(comment);
  videoComments.prepend(newComment);
  // console.log(newComment.dataset);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;
  if (text === "") return;
  // how to get user id from session?
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status === 201) {
    const { commentId } = await response.json();
    addComment(text, commentId);
  }
};

const handleDelete = async (e) => {
  const commentId = e.target.parentNode.dataset.id;
  const videoId = videoContainer.dataset.videoid;

  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", handleDelete);
});
if (form) {
  form.addEventListener("submit", handleSubmit);
}
