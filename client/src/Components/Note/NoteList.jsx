import { useReducer, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useNoteService from "./useNoteService";
import Note from "./Note";
import NoteInput from "./NoteInput";
import "./NoteList.css";

const ACTIONS = {
  SET_NOTES: "SET_NOTES",
  ADD_NOTE: "ADD_NOTE",
  UPDATE_NOTE: "UPDATE_NOTE", // NEW: For Note.jsx// NEW: For Note.jsx
  REMOVE_NOTE: "REMOVE_NOTE",
  SET_FILTERED_NOTES: "SET_FILTERED_NOTES",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_LOADING: "SET_LOADING",
  SET_SUBMITTING: "SET_SUBMITTING",
  SET_CATEGORY_NAME: "SET_CATEGORY_NAME", // NEW: For category name
};

const initialState = {
  notes: [],
  error: null,
  isLoading: false,
  isSubmitting: false,
  categoryName: "Loading...",
  isFiltered: false,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_NOTES:
      return {
        ...state,
        notes: action.payload
          .filter((note) => note && note.id && note.created_at)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        isFiltered: false,
      };
    case ACTIONS.ADD_NOTE:
      return {
        ...state,
        notes: [
          ...(Array.isArray(action.payload)
            ? action.payload
            : [action.payload]
          ).filter((note) => note && note.id && note.created_at),
          ...state.notes,
        ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
      };
    case ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes
          .map((note) =>
            String(note.id) === String(action.payload.id)
              ? action.payload
              : note
          )
          .filter((note) => note && String(note.id) && note.created_at)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
      };
    case ACTIONS.REMOVE_NOTE:
      console.log("Removing note with id:", action.payload);
      return {
        ...state,
        notes: state.notes.filter(
          (note) => String(note.id) !== String(action.payload)
        ),
      };
    case ACTIONS.SET_FILTERED_NOTES:
      return {
        ...state,
        notes: action.payload
          .filter((note) => note && note.id && note.created_at)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        isFiltered: true,
      };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    case ACTIONS.SET_CATEGORY_NAME:
      return { ...state, categoryName: action.payload };
    default:
      return state;
  }
}

function NoteList() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { notes, error, isLoading, isSubmitting } = state;
  const { categoryId } = useParams();
  const { fetchNotesForCategory, saveNote, fetchCategory, retryFetchNotes } =
    useNoteService();
  const hasFetchedRef = useRef({});

  useEffect(() => {
    console.log("=== LOADING NOTES ===");
    console.log("Category ID:", categoryId);

    if (!categoryId || hasFetchedRef.current[categoryId]) return;

    hasFetchedRef.current[categoryId] = true;
    retryFetchNotes(categoryId); // Reset persistent state for fresh fetch

    const loadData = async () => {
      if (!categoryId) return;

      // Force a fresh fetch for this categoryId

      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const category = await fetchCategory(categoryId);
        dispatch({
          type: ACTIONS.SET_CATEGORY_NAME,
          payload: category?.name || "Notes",
        });

        const notes = await fetchNotesForCategory(categoryId);
        console.log("Received notes:", notes);

        if (Array.isArray(notes)) {
          dispatch({ type: ACTIONS.SET_NOTES, payload: notes });
        } else {
          console.error("Notes is not an array:", notes);
          dispatch({ type: ACTIONS.SET_NOTES, payload: [] });
        }
      } catch (err) {
        console.error("Error loading data:", err);
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
        dispatch({ type: ACTIONS.SET_NOTES, payload: [] });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadData();
  }, [categoryId]);

  const handleSubmit = async (content) => {
    console.log("=== SUBMITTING NEW NOTE ===");
    if (!content.trim() || !categoryId) {
      console.log("Invalid input - note empty or no category ID");
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Note content or category ID is missing",
      });
      return;
    }

    try {
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: true });
      console.log("Creating note with:", { categoryId, content });
      const createdNote = await saveNote(categoryId, content);
      console.log("Server response for new note:", createdNote);

      if (createdNote && createdNote.id) {
        dispatch({ type: ACTIONS.ADD_NOTE, payload: createdNote });
        dispatch({ type: ACTIONS.CLEAR_ERROR });
      } else {
        console.error("Invalid note response:", createdNote);
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: "Invalid note response from server",
        });
      }
    } catch (err) {
      console.error("Error creating note:", err);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: `Failed to save note: ${err.message}`,
      });
    } finally {
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
    }
  };

  const handleNoteAction = (action) => {
    console.log("Dispatching action:", action.type, action.payload);
    dispatch(action);
  };

  console.log("Current state:", {
    categoryId,
    notes: state.notes,
    error: state.error,
    isLoading: state.isLoading,
    isSubmitting: state.isSubmitting,
    categoryName: state.categoryName,
  });

  return (
    <div className="NoteList">
      <div className="NoteList-content">
        <div className="NoteList-header">
          <h2>Notes for Category: {state.categoryName}</h2>
        </div>

        {isLoading && <div>Loading notes...</div>}
        {error && <div className="NoteList-error">Error: {state.error}</div>}

        <div className="NoteList-notes">
          {notes.length === 0 ? (
            <div className="NoteList-empty">
              No notes yet. Add your first note below!
            </div>
          ) : (
            <div className="NoteList-notes-container">
              {notes.map((note) => (
                <Note
                  key={note.id}
                  id={String(note.id)}
                  content={note.content}
                  created_at={note.created_at}
                  categoryId={categoryId}
                  onNoteAction={handleNoteAction}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <NoteInput onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

export { ACTIONS };
export default NoteList;
