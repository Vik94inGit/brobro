import { useState, useCallback, useRef } from "react";
import config from "../../config";

// CHANGE: Added persistent state to prevent infinite fetching

function useNoteService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // REMOVED: const activeFetch = useRef(false);
  // CHANGE: Added maxRetries for retry limit
  const maxRetries = 3;

  const fetchCategory = useCallback(async (categoryId) => {
    if (!categoryId) {
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = `${config.API_URL}/categories/${categoryId}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      if (!text) {
        return null;
      }
      const data = JSON.parse(text);
      return data;
    } catch (err) {
      console.error("Fetch category error:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNotesForCategory = useCallback(
    async (categoryId) => {
      console.log("=== FETCHING NOTES ===");
      if (!categoryId) {
        return [];
      }

      // Initialize if not present, but reset if this is a new fetch attempt for this categoryId
      if (!persistentState.current.hasFetched[categoryId]) {
        persistentState.current.hasFetched[categoryId] = false;
        persistentState.current.retryCount[categoryId] = 0;
      }
      // Skip fetch if already fetched and not in retry mode
      if (
        persistentState.current.hasFetched[categoryId] &&
        persistentState.current.retryCount[categoryId] === 0 &&
        !isLoading
      ) {
        console.log(
          "Fetch skipped: already fetched for categoryId:",
          categoryId
        );
        return persistentState.current.lastFetchedData[categoryId] || [];
      }

      // Block fetch if currently loading or max retries reached
      if (
        isLoading ||
        persistentState.current.retryCount[categoryId] >= maxRetries
      ) {
        console.log("Fetch blocked: in progress or max retries reached", {
          isLoading,
          retryCount: persistentState.current.retryCount[categoryId],
        });
        return [];
      }

      try {
        persistentState.current.retryCount[categoryId] += 1;
        setIsLoading(true);
        setError(null);

        const url = `${config.API_URL}/notes/filter?categoryId=${categoryId}`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${
              errorText || "Unknown error"
            }`
          );
        }

        const text = await response.text();
        console.log("Raw response:", text);
        if (!text || text.trim() === "") {
          console.warn("Empty response");
          return [];
        }

        const data = JSON.parse(text);
        console.log("Parsed data:", data);
        if (!Array.isArray(data)) {
          console.error("Invalid data format:", data);
          return [];
        }

        // Store the fetched data and mark as fetched
        persistentState.current.lastFetchedData =
          persistentState.current.lastFetchedData || {};
        persistentState.current.lastFetchedData[categoryId] = data;
        persistentState.current.hasFetched[categoryId] = true;
        persistentState.current.retryCount[categoryId] = 0;
        return data;
      } catch (err) {
        console.error("Fetch notes error:", err);
        let userMessage = "Failed to load notes. Please try again.";
        if (err.message.includes("Failed to fetch")) {
          userMessage =
            "Unable to connect to the server. Check if the backend is running at http://localhost:8888.";
        } else if (err.message.includes("HTTP error")) {
          userMessage = `Server error: ${err.message}`;
        }
        setError(userMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setError]
  );

  const fetchFilteredNotesByDate = async ({ categoryId, year, month, day }) => {
    const params = new URLSearchParams({
      categoryId,
      year,
      month,
    });
    if (day) params.append("day", day);

    const url = `${config.API_URL}/notes/filter?${params.toString()}`;
    console.log("Fetching filtered notes from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch filtered notes: ${response.status}`);
    }

    return await response.json();
  };

  // NEW: Added updateNote function
  const updateNote = useCallback(async (noteId, content) => {
    // Update note logic
    try {
      setIsLoading(true);
      setError(null);

      const url = `${config.API_URL}/notes/${noteId}`; // Use the noteId to construct the URL
      console.log("Updating note at URL:", url, {
        noteId,
        content,
      });

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ content }), // Send the noteId and content in the body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedNote = await response.json();
      return updatedNote;
    } catch (err) {
      let userMessage = "Failed to update note. Please try again.";
      if (err.message.includes("Status: 404")) {
        userMessage = "Note not found. It may have been deleted.";
      } else if (err.message.includes("Failed to fetch")) {
        userMessage =
          "Unable to connect to the server. Check if the backend is running at http://localhost:8888.";
      }
      throw err; // Throw to allow caller to handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveNote = useCallback(async (categoryId, content) => {
    // UNCHANGED: Save note logic
    try {
      setIsLoading(true);
      setError(null);

      const url = `${config.API_URL}/notes/`;
      console.log("Saving to URL:", url);
      console.log("Saving to URL:", url, "with payload:", {
        categoryId,
        content,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ category_id: categoryId, content }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorText || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Save note error:", err);
      let userMessage = "Failed to save note. Please try again.";
      if (err.message.includes("Failed to fetch")) {
        userMessage =
          "Unable to connect to the server. Check if the backend is running at http://localhost:8888.";
      } else if (err.message.includes("HTTP error")) {
        userMessage = `Server error: ${err.message}`;
      }
      setError(userMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // NEW: Add getNote for GET /notes/:id
  const getNote = useCallback(async (noteId) => {
    try {
      setIsLoading(true);
      setError(null);

      const url = `${config.API_URL}/notes/${noteId}`;
      console.log("Fetching note at URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorText || "Unknown error"
          }`
        );
      }

      const text = await response.text();
      if (!text) {
        return null;
      }

      const data = JSON.parse(text);
      return data;
    } catch (err) {
      console.error("Get note error:", err);
      let userMessage = "Failed to fetch note. Please try again.";
      if (err.message.includes("Status: 404")) {
        userMessage = "Note not found. It may have been deleted.";
      } else if (err.message.includes("Failed to fetch")) {
        userMessage =
          "Unable to connect to the server. Check if the backend is running at http://localhost:8888.";
      }
      setError(userMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // NEW: Add deleteNote for DELETE /notes/:id
  const deleteNote = useCallback(async (noteId) => {
    try {
      setIsLoading(true);
      setError(null);

      const url = `${config.API_URL}/notes/${noteId}`;
      console.log("Deleting note at URL:", url);

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorText || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      if (response.ok || data.success) {
        return { id: noteId }; // Return a minimal object with the ID for the frontend to use
      }
      console.log("Unexpected response format:", data);
      if (!data || !data.id) {
        throw new Error("Invalid note response from server");
      }
      return data;
    } catch (err) {
      console.error("Delete note error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistentState = useRef({
    hasFetched: {},
    retryCount: {},
    lastFetchedData: {},
  });
  // CHANGE: Added manual retry function
  const retryFetchNotes = (categoryId) => {
    if (
      categoryId &&
      persistentState.current.hasFetched[categoryId] !== undefined
    ) {
      persistentState.current.retryCount[categoryId] = 0;
      persistentState.current.hasFetched[categoryId] = false;
      delete persistentState.current.lastFetchedData[categoryId];
    }
  };

  return {
    isLoading,
    error,
    fetchCategory,
    fetchNotesForCategory,
    fetchFilteredNotesByDate,
    saveNote,
    updateNote, // NEW: Export updateNote
    getNote, // NEW: Export getNote
    deleteNote, // NEW: Export deleteNote
    retryFetchNotes,
    persistentState,
  };
}

export default useNoteService;
