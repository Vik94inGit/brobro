import { Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./Components/Header/Header.jsx";
import CategoryList from "./Components/Category/CategoryList.jsx";
import NoteList from "./Components/Note/NoteList.jsx";
import useCategoryService from "./Components/Category/useCategoryService.js";

function App() {
  const {
    categories,
    isLoading,
    error,
    handleCreateCategory,
    handleUpdateCategory,
    handleTogglePinCategory,
    handleDeleteCategory,
  } = useCategoryService();

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <CategoryList
                categories={categories}
                isLoading={isLoading}
                error={error}
                onCreateCategory={handleCreateCategory}
                onUpdateCategory={handleUpdateCategory}
                onTogglePinCategory={handleTogglePinCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            }
          />
          <Route path="/categories/:categoryId/notes" element={<NoteList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
