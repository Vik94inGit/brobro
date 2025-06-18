import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import CreateCategoryModal from "./CreateCategoryModal";
import "./CategoryCard.css";

const CategoryCard = ({
  id,
  icon,
  title,
  onClick,
  onCategoryClick,
  handleUpdateCategory,
  handleDeleteCategory,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create",
    category: null,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = async (e) => {
    e.stopPropagation();
    setModalState({
      isOpen: true,
      mode: "edit",
      category: { id, name: title, image: icon || "" },
    });
    setIsMenuOpen(false);
  };

  const handleEditSubmit = async ({ name, image }) => {
    console.log("handleEditSubmit: Submitting updated category:", {
      id,
      name,
      image,
    });
    try {
      await handleUpdateCategory(id, { name, image: image || undefined });
      console.log("handleEditSubmit: Category updated successfully");
      setModalState({ ...modalState, isOpen: false });
    } catch (error) {
      console.error("Failed to update category:", error);
      alert(`Failed to update category: ${error.message}`);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await handleDeleteCategory(id);
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert(`Failed to delete category: ${error.message}`);
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        className={`category-card ${isMenuOpen ? "active" : ""}`}
        ref={cardRef}
        onClick={onCategoryClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCategoryClick?.();
        }}
      >
        <img
          className="category-icon"
          src={icon || "https://i.postimg.cc/zDCM0t1Z/ideas.jpg"}
          alt={title}
        />
        <h3 className="category-title">{title}</h3>
        <div class="menu-container">
          <button
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent onCategoryClick from firing
              toggleMenu();
              onClick?.(); // Call onClick from props
            }}
            aria-label="Category options"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={(e) => handleEdit(e)} aria-label="Edit category">
                Edit
              </button>
              <button
                onClick={(e) => handleDelete(e)}
                aria-label="Delete category"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Modal render */}

      {modalState.isOpen && (
        <CreateCategoryModal
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          onSubmit={modalState.mode === "edit" ? handleEditSubmit : undefined}
          mode={modalState.mode}
          initialName={
            modalState.mode === "edit" ? modalState.category.name : ""
          }
          initialImage={
            modalState.mode === "edit" ? modalState.category.image : ""
          }
          categoryId={
            modalState.mode === "edit" ? modalState.category.id : undefined
          }
        />
      )}
    </>
  );
};
CategoryCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  isPinned: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onCategoryClick: PropTypes.func,
  handleCreateCategory: PropTypes.func.isRequired,
  handleUpdateCategory: PropTypes.func.isRequired,
  handleDeleteCategory: PropTypes.func.isRequired,
  handleTogglePinCategory: PropTypes.func.isRequired,
};

export default React.memo(CategoryCard);
