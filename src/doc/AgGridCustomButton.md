# 🎯 ViewButtonRenderer Component Documentation

The `ViewButtonRenderer` is a **custom AG Grid cell renderer** built using **React**. It renders a media-type-specific button in a grid cell, allowing users to view or review submissions (image, PDF, or video) in a modal with approval functionality.

---

## 🚀 Features

- ✅ Dynamically detects media type (image, PDF, video)
- 📦 Fetches user data via API call when button is clicked
- 🧩 Opens the `UserApproval` modal with appropriate props
- 🖱️ Renders MUI icons corresponding to media type
- 🔁 Text changes based on `pageType` ("View" or "Review")

---

## 📦 Component Props

| Prop       | Type           | Description                           |
| ---------- | -------------- | ------------------------------------- | -------------- | ------------------------------------------------------------------ |
| `props`    | `any`          | AG Grid's default cell renderer props |
| `pageType` | `'pendingPage' | 'rejectedPage'                        | 'approvePage'` | Determines the label on the button and conditional rendering logic |

---

## 📦 Usage with AG Grid

```tsx
{
  headerName: "Actions",
  field: "actions",
  cellRenderer: ViewButtonRenderer,
  cellRendererParams: {
    pageType: "rejectedPage", // Or "pendingPage", "approvePage"
  }
}
```

---

## 🧠 Implementation Details

### 🔍 Media Type Detection

Uses `getMediaTypeFromSrc()` utility function to determine if the media is an image, PDF, or video.

### 🎨 Button Content

- Renders icon based on media type:
  - 🖼️ `ImageIcon` for images
  - 📄 `PictureAsPdfIcon` for PDFs
  - 🎥 `VideoCameraBackIcon` for videos
- Label changes depending on the `pageType`:
  - `"Review"` for `rejectedPage`
  - `"View"` otherwise

### 🧵 API Integration

On button click, fetches user data using:

```ts
API.getUserData(id);
```

Then stores it in local `state` to be passed into the modal.

### 📦 Modal: `UserApproval`

Props passed:

- `open`: Controls modal visibility
- `onClose`: Closes modal
- `mediaSrc`: The user's media URL
- `userData`: Full user data fetched from API
- `pageType`: Used for conditional rendering inside modal
- `userId`: Unique user ID

---

## 📁 File Structure & Dependencies

```
ViewButtonRenderer.tsx
├── import Button.scss          // For button styling
├── import API                  // For user data fetching
├── import getMediaTypeFromSrc // Utility to determine file type
├── import MUI Icons            // Image, PDF, and Video icons
├── import UserApproval         // Modal component
```

---

## 🧩 Related Components

- `UserApproval.tsx`: Modal triggered on button click
- `GenericAgGrid.tsx`: Parent grid where this is rendered
- `getMediaTypeFromSrc`: Utility to determine media type from URL
- `Button.scss`: Styling for the button

---

## 💡 Tips

- Ensure that each row has a `url` and `id` property for this to work correctly.
- Customize the `UserApproval` modal based on your project needs.
- This renderer is fully reusable in multiple pages by just passing a different `pageType`.

---

## 🔧 Example Button UI

- `Image` + "View"
- `PDF` + "Review"
- `Video` + "View"

---
