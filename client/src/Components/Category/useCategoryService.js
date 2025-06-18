import { useState, useEffect, useCallback, useRef } from "react";
import config from "../../config";

function useCategoryService() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Normalize category data to ensure name and image are present
  const normalizeCategory = (category) => ({
    id: category.id,
    name: category.name,
    image: category.image || "https://i.postimg.cc/zDCM0t1Z/ideas.jpg",
    isPinned: category.pinned || false,
    last_used: category.last_used,
    created_at: category.created_at,
  });

  // Fetch categories from API
  async function fetchCategories() {
    console.log("=== FETCHING CATEGORIES ===");
    console.log("API URL:", config.API_URL);

    if (isLoading || hasFetched.current || retryCount.current >= maxRetries) {
      console.log(
        "Fetch blocked: in progress, already fetched, or max retries reached",
        {
          isLoading,
          hasFetched: hasFetched.current,
          retryCount: retryCount.current,
        }
      );
      return categories;
    }

    setIsLoading(true);
    setError(null);
    retryCount.current += 1;

    try {
      const url = `${config.API_URL}/categories`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      console.log("Response status:", response.status);

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

      if (!text) {
        console.log("Empty response received");
        setCategories([]);
        return [];
      }

      const data = JSON.parse(text);
      console.log("Parsed data:", data);

      if (!Array.isArray(data)) {
        console.error("Response is not an array:", data);
        throw new Error("Expected an array of categories");
      }

      const normalizedData = data.map(normalizeCategory);
      setCategories(normalizedData);
      hasFetched.current = true;
      retryCount.current = 0; // Reset retries on success
      return data;
    } catch (err) {
      console.error("Fetch categories error:", err);
      let userMessage = "Failed to load categories. Please try again.";
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
  }
  // Create a category
  const handleCreateCategory = useCallback(async (categoryData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const updatedCategories = await response.json();
      console.log("Received updatedCategories:", updatedCategories);
      if (!Array.isArray(updatedCategories)) {
        console.error(
          "Expected an array of categories, got:",
          updatedCategories
        );
        throw new Error("Expected an array of categories");
      }

      const normalizedCategories = updatedCategories.map(normalizeCategory);
      setCategories(normalizedCategories);
      console.log(
        "handleCreateCategory: Updated categories:",
        normalizedCategories
      );
      setError(null);
      return normalizedCategories[0]; // Return the new category (first item)
    } catch (err) {
      console.error("Create category error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateCategory = useCallback(async (id, updatedCategory) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updatedCategory),
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const updatedData = await response.json();
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat))
      );
      setError(null);
    } catch (err) {
      console.error("Update category error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteCategory = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (err) {
      console.error("Delete category error:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTogglePinCategory = useCallback(
    async (id) => {
      try {
        const category = categories.find((cat) => cat.id === id);
        const response = await fetch(`${config.API_URL}/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ isPinned: !category.isPinned }),
        });
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const updatedData = await response.json();
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat))
        );
      } catch (err) {
        console.error("Toggle pin error:", err);
        setError(err.message);
        throw err;
      }
    },
    [categories]
  );

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Manual retry function

  const retryFetchCategories = () => {
    retryCount.current = 0;
    hasFetched.current = false;
    fetchCategories();
  };

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    retryFetchCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleTogglePinCategory,
  };
}

export default useCategoryService;
