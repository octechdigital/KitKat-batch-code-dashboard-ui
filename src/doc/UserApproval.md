# UserApproval Component

`UserApproval` is a React component that displays a modal dialog for administrators to approve, reject, or review user-submitted content. It supports image, video, and PDF previews, and dynamically fetches rejection reasons when necessary.

---

## Features

- Preview media (image, video, PDF)
- Display user metadata
- Approve or reject submissions
- Dynamic list of rejection reasons
- Custom rejection message input
- Review rejected users
- Redux integration for refreshing state
- Toast notifications for feedback

---

## Props

| Prop       | Type                              | Description                               |
| ---------- | --------------------------------- | ----------------------------------------- |
| `open`     | `boolean`                         | Controls dialog visibility                |
| `onClose`  | `() => void`                      | Callback when dialog is closed            |
| `mediaSrc` | `string`                          | URL of the media to be previewed          |
| `userData` | `GenericRecord`                   | Object containing metadata about the user |
| `pageType` | `"pendingPage" \| "rejectedPage"` | Determines the dialog's action set        |
| `userId`   | `number`                          | User identifier for API actions           |

---

## API Calls

- `API.getRejectReasonData()` – Fetches rejection reasons
- `API.userAction(action, userId, payload?)` – Sends action request (approve, reject, review)

---

## State Management

- Uses Redux to dispatch `setIsRefreshed(true)` after actions

---

## Media Preview

Based on the `mediaSrc` file type:

- Images: rendered with `<img>`
- Videos: rendered with `<video controls>`
- PDFs: rendered with `<iframe>`

---

## Conditional UI by Page Type

### `pendingPage`

- Can Approve or Reject
- On Reject: Select from dropdown or enter custom reason

### `rejectedPage`

- Option to move submission back to review

---

## Usage Example

```tsx
<UserApproval
  open={openModal}
  onClose={() => setOpenModal(false)}
  mediaSrc="https://example.com/sample.pdf"
  userData={{
    name: "John Doe",
    email: "john@example.com",
    submittedAt: "2025-04-09",
  }}
  pageType="pendingPage"
  userId={123}
/>
```

---

## Notes

- The modal resets form state on close
- Functional and object values in `userData` are rendered safely
- Reject action disables submission until custom reason is provided if "Others" is selected
