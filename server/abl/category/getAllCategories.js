const categoryService = require("../../daoMethods/categoryService");

async function getAllCategories() {
  const categories = await categoryService.getCategories();

  // Sort categories:
  // 1. Pinned categories first (if any)
  // 2. Then by last_used (most recent first)
  // 3. Then by name for categories with same last_used
  categories.sort((a, b) => {
    // If one is pinned and other isn't, pinned comes first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // If both are pinned or both are not pinned, sort by last_used
    if (a.last_used && b.last_used) {
      const lastUsedCompare = new Date(b.last_used) - new Date(a.last_used);
      if (lastUsedCompare !== 0) return lastUsedCompare;
    }

    // If last_used is same or not set, sort by name
    return a.name.localeCompare(b.name);
  });

  return categories;
}

module.exports = getAllCategories;
