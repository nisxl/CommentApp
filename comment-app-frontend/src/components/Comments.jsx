import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
const Comment = ({ comment }) => {
  const [editedAgo, setEditedAgo] = useState("");
  useEffect(() => {
    const editedAt = moment(comment.updated_at);
    const now = moment();
    const diffMinutes = now.diff(editedAt, "minutes");
    const diffHours = now.diff(editedAt, "hours");
    const diffDays = now.diff(editedAt, "days");
    let timeAgo = "";
    if (diffMinutes < 60) {
      timeAgo = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      timeAgo = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      timeAgo = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
    setEditedAgo(timeAgo);
  }, [comment.updated_at]);

  return (
    <div>
      <div className="flex justify-between md:mx-24">
        <div className="flex gap-5">
          <img className="w-[20px] h-[20px]" src="../images/user.png" />
          <div className="flex flex-col">
            <h2 className="font-bold">{comment.title}</h2>
            <p>{comment.content}</p>
            <div className="text-sm font-semibold self-start border-transparent rounded-md px-1 py-1 text-[#1da57e] cursor-pointer hover:bg-[#dceae5] transition duration-300 ease-in">
              Reply Comment
            </div>
          </div>
        </div>
        <h4 className="text-gray-400 text-sm">{editedAgo}</h4>
      </div>

      {/* Render nested replies recursively */}
      {comment?.replies?.map((reply) => (
        <div key={reply.id} style={{ marginLeft: "20px" }}>
          <Comment comment={reply} />
        </div>
      ))}
    </div>
  );
};

// Comments component to render the list of comments
const Comments = () => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/comments");
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  console.log("comments", comments);

  return (
    <div className="md:w-[70%] mx-auto">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
