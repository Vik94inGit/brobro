import PropTypes from "prop-types";
import { useState } from "react";
import useNoteService from "../Note/useNoteService"; // Adjust path
import "./Note.css";
import { ACTIONS } from "./NoteList";

const Note = ({ id, content, created_at, categoryId, onNoteAction }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { updateNote, deleteNote, fetchFilteredNotesByDate } = useNoteService();

  const formattedDate = created_at ? new Date(created_at).toLocaleString() : "";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = async (e) => {
    e.stopPropagation();
    const newContent = prompt("Enter new note content:", content);
    if (newContent && newContent !== content) {
      try {
        const updatedNote = await updateNote(
          id,
          categoryId,
          newContent
        );
        console.log("Updated note from backend:", updatedNote);

        onNoteAction({ type: "UPDATE_NOTE", payload: updatedNote });
      } catch (error) {
        console.error("Failed to update note:", error);
        alert(`Failed to update note: ${error.message}`);
      }
    }
    setIsMenuOpen(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        console.log("Attempting to remove note with ID:", id);
        onNoteAction({ type: ACTIONS.REMOVE_NOTE, payload: id });
      } catch (error) {
        console.error("Failed to delete note:", error);
        alert(`Failed to delete note: ${error.message}`);
      }
    }
    setIsMenuOpen(false);
  };

  const handleFilterByDate = async (e) => {
    e.stopPropagation();
    const year = prompt("Enter year (e.g., 2025):");
    const month = prompt("Enter month (1-12):");
    const day = prompt("Enter day (1-31, optional):");

    if (!year || isNaN(year) || year.length !== 4) {
      alert("Please enter a valid 4-digit year (e.g., 2025)");
      setIsMenuOpen(false);
      return;
    }
    if (!month || isNaN(month) || month < 1 || month > 12) {
      alert("Please enter a valid month (1-12)");
      setIsMenuOpen(false);
      return;
    }
    if (day && (isNaN(day) || day < 1 || day > 31)) {
      alert("Please enter a valid day (1-31) or leave blank");
      setIsMenuOpen(false);
      return;
    }

    console.log("Filtering notes with:", { categoryId, year, month, day });

    try {
      const filteredNotes = await fetchFilteredNotesByDate({
        categoryId,
        year,
        month,
        day,
      });

      console.log("Filtered notes:", filteredNotes);

      onNoteAction({ type: "SET_FILTERED_NOTES", payload: filteredNotes });
    } catch (error) {
      console.error("Failed to filter notes:", error);
      alert(`Failed to filter notes: ${error.message}`);
    }

    setIsMenuOpen(false);
  };

  return (
    <div className="Note">
      <div className="Note-content">{content}</div>
      <div className="Note-date">{formattedDate}</div>
      <div className="category-menu">
        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
          aria-label="Note options"
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          ⋮
        </button>
        {isMenuOpen && (
          <ul className="dropdown-menu">
            <li>
              <button onClick={handleEdit}>Edit</button>
            </li>
            <li>
              <button onClick={handleDelete}>Delete</button>
            </li>
            <li>
              <button onClick={handleFilterByDate}>Filter by Date</button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

Note.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  created_at: PropTypes.string,
  categoryId: PropTypes.string.isRequired,
  onNoteAction: PropTypes.func.isRequired,
};

export default Note;
