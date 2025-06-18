import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import NoteList from "./NoteList";
import NoteInput from "./NoteInput";
import "./DiaryChat.css";

const DiaryChat = ({ category, onBack }) => {
  const [entries, setEntries] = useState([]);

  const handleNewNote = (text) => {
    const newNote = {
      id: Date.now(),
      text,
      date: new Date(),
    };
    setEntries([...entries, newNote]);
  };

  return (
    <div className="diary-chat">
      <ChatHeader category={category} onBack={onBack} />
      <NoteList entries={entries} />
      <NoteInput onSubmit={handleNewNote} />
    </div>
  );
};

export default DiaryChat;
