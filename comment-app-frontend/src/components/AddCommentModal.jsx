import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
function AddCommentModal({ onCommentAdded }) {
  const [open, setOpen] = React.useState(false);
  const [commentTitle, setCommentTitle] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/comments", {
        title: commentTitle,
        content: commentContent,
      });

      console.log("Comment created:", response.data);

      setCommentTitle("");
      setCommentContent("");
      setOpen(false);

      onCommentAdded();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ marginBottom: "30px" }}
      >
        Add a new Comment
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add a comment</DialogTitle>
        <DialogContent className="flex flex-col gap-5">
          <DialogContentText>Add a wonderful Comment</DialogContentText>

          <TextField
            id="outlined-textarea"
            label="Title"
            placeholder="Add the comment title"
            multiline
            value={commentTitle}
            onChange={(e) => setCommentTitle(e.target.value)}
          />

          <TextField
            id="outlined-textarea"
            label="Content"
            placeholder="Add the comment Content"
            multiline
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddCommentModal;
