import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
const Comment = ({ comment }) => {
  const [editedAgo, setEditedAgo] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTitle, setReplyTitle] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
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

  const handleReplyButtonClick = () => {
    setShowReplyForm(!showReplyForm);
  };
  const handleSubmitReply = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/comments", {
        title: replyTitle,
        content: replyContent,
        parent_id: comment.id,
      });
      console.log("Reply added:", response.data);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };
  console.log(showReplyForm);
  return (
    <div>
      <div className="flex justify-between md:mx-24 my-3">
        <div className="flex gap-5">
          {comment.id % 2 == 0 ? (
            <img className="w-[20px] h-[20px]" src="../images/user.png" />
          ) : (
            <img className="w-[20px] h-[20px]" src="../images/user1.png" />
          )}

          <div className="flex flex-col">
            <h2 className="font-bold">{comment.title}</h2>
            <p>{comment.content}</p>
            <div
              onClick={handleReplyButtonClick}
              className="text-sm font-semibold self-start border-transparent rounded-md px-1 py-1 text-[#1da57e] cursor-pointer hover:bg-[#dceae5] transition duration-300 ease-in"
            >
              Reply Comment
            </div>

            {showReplyForm && (
              <div className="flex flex-col ">
                <textarea
                  value={replyTitle}
                  onChange={(e) => setReplyTitle(e.target.value)}
                  placeholder="Set your title"
                  className="border p-2 mt-2 rounded-md w-full h-[40px] text-sm"
                ></textarea>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..."
                  className="border p-2 mt-2 rounded-md h-[50px] text-sm"
                ></textarea>
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitReply}
                    className="bg-[#1da57e] text-white rounded-md px-2 py-2 mt-2 text-sm font-bold"
                  >
                    Submit Reply
                  </button>
                  <button
                    onClick={handleReplyButtonClick}
                    className="bg-[#d2372b] text-white rounded-md px-2 py-2 mt-2 text-sm font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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

  return (
    <div className="md:w-[70%] mx-auto">
      {comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
