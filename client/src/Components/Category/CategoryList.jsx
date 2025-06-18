import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import useCategoryService from "./useCategoryService";
import "./CategoryList.css";
import CreateCategoryModal from "./CreateCategoryModal";
import { useState } from "react";

const CategoryList = () => {
  const {
    categories,
    isLoading,
    error,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useCategoryService();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create",
    category: null,
  });

  // Debug: Verify service functions
  console.log("CategoryList service functions:", {
    handleCreateCategory: typeof handleCreateCategory,
    handleUpdateCategory: typeof handleUpdateCategory,
    handleDeleteCategory: typeof handleDeleteCategory,
  });

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!categories || categories.length === 0) {
    return (
      <div className="no-categories">
        No categories available. Please add some categories.
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.stopPropagation();
    console.log("handleCreate: Opening CreateCategoryModal");
    setModalState({ isOpen: true, mode: "create", category: null });
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (category, event) => {
    event?.preventDefault(); // Prevent default behavior if needed
    navigate(`/categories/${category.id}/notes`);
  };

  const handleCreateSubmit = async (newCategory) => {
    console.log("handleCreateSubmit: Submitting newCategory:", newCategory);

    try {
      await handleCreateCategory(newCategory);
      console.log("handleCreateSubmit: Category created successfully:");
      setModalState({ ...modalState, isOpen: false });
    } catch (error) {
      console.error("Failed to create category:", error);
      alert(`Failed to create category: ${error.message}`);
    }
  };

  return (
    <div className="category-list-container">
      <button
        className="category-create-button"
        onClick={(e) => handleCreate(e)}
        aria-label="Create new category"
      >
        Create Category
      </button>
      <div className="category-list">
        {categories.map((cat) => (
          <CategoryCard
            id={cat.id}
            title={cat.name}
            icon={cat.image}
            onClick={() => console.log(`Toggled menu for ${cat.name}`)} // Debug menu toggle
            onCategoryClick={() => handleCategoryClick(cat)}
            handleCreateCategory={handleCreateCategory}
            handleUpdateCategory={handleUpdateCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        ))}
      </div>
      {modalState.isOpen && (
        <CreateCategoryModal
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          onSubmit={handleCreateSubmit}
          mode={modalState.mode}
          initialName={""}
          initialImage={""}
        />
      )}
    </div>
  );
};

export default CategoryList;
