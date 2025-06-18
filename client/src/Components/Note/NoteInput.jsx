import React, { useState, useEffect, useRef } from "react";
import "./NoteInput.css";

const NoteInput = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content, max 15 rows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.rows = 1; // Start with 1 row
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
      const maxRows = 15;
      const newRows = Math.min(
        Math.floor(textarea.scrollHeight / lineHeight),
        maxRows
      );
      textarea.rows = newRows;
    }
  }, [text]);
  console.log(text);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Enter alone submits
      e.preventDefault();
      handleSubmit(e);
    }
    // Shift + Enter adds newline (handled by textarea)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <form className="NoteInput d-flex gap-2" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write your thoughts..."
        className="form-control"
        rows={1}
      />
      <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
};

export default NoteInput;
