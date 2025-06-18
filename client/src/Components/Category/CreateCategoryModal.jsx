// CreateCategoryModal.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import "./CreateCategoryModal.css"; // Optional CSS styling

const CreateCategoryModal = ({
  onClose,
  onSubmit,
  mode = "create",
  initialName = "",
  initialImage = "",
  categoryId,
}) => {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialImage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Category name is required");
      return;
    }
    const payload = {
      name: name.trim(),
      image: icon.trim() || undefined,
      ...(mode === "edit" && { id: categoryId }),
    };
    console.log("CreateCategoryModal: Submitting payload:", payload);
    onSubmit(payload);
    onClose();
  };

  const handleCancel = () => {
    setName(initialName);
    setIcon(initialImage);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Create New Category</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Icon URL:
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </label>
          <div className="modal-buttons">
            <button type="submit">{mode === "edit" ? "Save" : "Create"}</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateCategoryModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]),
  initialName: PropTypes.string,
  initialImage: PropTypes.string,
  categoryId: PropTypes.string,
};

export default CreateCategoryModal;
