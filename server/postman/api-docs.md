# API Documentation

## Categories

### GET /categories

**Input:** None
**Output:**

```json
[
  {
    "id": "uuid",
    "name": "string",
    "image": "string | null",
    "pinned": boolean,
    "last_used": "ISO date string",
    "created_at": "ISO date string"
  }
]
```

**Error:**

```json
{
  "error": "string"
}
```

### POST /categories

**Input:**

```json
{
  "name": "string",
  "image": "string | null"
}
```

**Output:**

```json
{
  "id": "uuid",
  "name": "string",
  "image": "string | null",
  "pinned": false,
  "last_used": "ISO date string",
  "created_at": "ISO date string"
}
```

**Error:**

```json
{
  "error": "string"
}
```

### GET /categories/:id

**Input:** id in URL
**Output:**

```json
{
  "id": "uuid",
  "name": "string",
  "image": "string | null",
  "pinned": boolean,
  "last_used": "ISO date string",
  "created_at": "ISO date string"
}
```

**Error:**

```json
{
  "error": "Category not found"
}
```

### PUT /categories/:id

**Input:**

```json
{
  "name": "string",
  "image": "string | null"
}
```

**Output:**

```json
{
  "id": "uuid",
  "name": "string",
  "image": "string | null",
  "pinned": boolean,
  "last_used": "ISO date string",
  "created_at": "ISO date string"
}
```

**Error:**

```json
{
  "error": "Category not found"
}
```

### PATCH /categories/:id/pin

**Input:** None
**Output:**

```json
{
  "id": "uuid",
  "name": "string",
  "image": "string | null",
  "pinned": boolean,
  "last_used": "ISO date string",
  "created_at": "ISO date string"
}
```

**Error:**

```json
{
  "error": "Category not found"
}
```

### DELETE /categories/:id

**Input:** id in URL
**Output:**

```json
{
  "message": "Category deleted successfully"
}
```

**Error:**

```json
{
  "error": "Category not found"
}
```

## Notes

### GET /notes

**Input:** None
**Output:**

```json
[
  {
    "id": "uuid",
    "content": "string",
    "category_id": "uuid",
    "created_at": "ISO date string"
  }
]
```

**Error:**

```json
{
  "error": "string"
}
```

### POST /notes

**Input:**

```json
{
  "content": "string",
  "category_id": "uuid"
}
```

**Output:**

```json
{
  "id": "uuid",
  "content": "string",
  "category_id": "uuid",
  "created_at": "ISO date string"
}
```

**Error:**

```json
{
  "error": "string"
}
```

### GET /notes/:id

**Input:** id in URL
**Output:**

```json
{
  "id": "uuid",
  "content": "string",
  "category_id": "uuid",
  "created_at": "ISO date string"
}
```

**Error:**

```json
{
  "error": "Note not found"
}
```

### PUT /notes/:id

**Input:**

```json
{
  "content": "string",
  "category_id": "uuid"
}
```

**Output:**

```json
{
  "id": "uuid",
  "content": "string",
  "category_id": "uuid",
  "created_at": "ISO date string"
}
```

**Error:**

```json
{
  "error": "Note not found"
}
```

### DELETE /notes/:id

**Input:** id in URL
**Output:**

```json
{
  "message": "Note deleted successfully"
}
```

**Error:**

```json
{
  "error": "Note not found"
}
```

### GET /notes/category/:categoryId

**Input:** categoryId in URL
**Output:**

```json
[
  {
    "id": "uuid",
    "content": "string",
    "category_id": "uuid",
    "created_at": "ISO date string"
  }
]
```

**Error:**

```json
{
  "error": "Category not found"
}
```

### POST /notes/bulk

**Input:**

```json
{
  "notes": [
    {
      "content": "string",
      "category_id": "uuid"
    }
  ]
}
```

**Output:**

```json
[
  {
    "id": "uuid",
    "content": "string",
    "category_id": "uuid",
    "created_at": "ISO date string"
  }
]
```

**Error:**

```json
{
  "error": "string"
}
```
