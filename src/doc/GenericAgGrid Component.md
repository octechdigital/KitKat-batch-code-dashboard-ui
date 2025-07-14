# 📊 GenericAgGrid Component Documentation

The `GenericAgGrid` is a reusable React component that wraps the [AG Grid](https://www.ag-grid.com/) table and allows easy data rendering with sorting, filtering, pagination, and custom loading/empty overlays.

---

## 🚀 Features

- Customizable column definitions
- Skeleton loader and no-data overlay
- Quick filtering
- Pagination with selectable page size
- Auto-refresh based on global Redux state
- Lottie animation support in the header

---

## 🧩 Props

| Prop            | Type                 | Description                                                            |
| --------------- | -------------------- | ---------------------------------------------------------------------- |
| `title`         | `string`             | Title displayed in the grid header                                     |
| `fetchData`     | `() => Promise<any>` | Function that fetches data (should return object with `data.userList`) |
| `columnDefs`    | `any[]`              | Column definitions compatible with AG Grid                             |
| `refreshStatus` | `boolean`            | Triggers a refetch when set to `true`                                  |
| `lottieFile`    | `ReactNode`          | Optional Lottie animation/icon to show next to the title               |

---

## 📦 Usage

```tsx
import GenericAgGrid from "./GenericAgGrid";

const fetchUsers = async () => {
  return await axios.get("/api/users");
};

const columns = [
  { headerName: "Name", field: "name" },
  { headerName: "Email", field: "email" },
];

<GenericAgGrid
  title="User List"
  fetchData={fetchUsers}
  columnDefs={columns}
  refreshStatus={refreshFlag}
  lottieFile={<MyLottieIcon />}
/>;
```

---

## 🛠️ Implementation Highlights

- **AG Grid Modules:** Only necessary modules are registered for performance.
- **Custom Overlays:**
  - `SkeletonTable`: Custom loading state while data is being fetched.
  - `CustomNoRowsOverlay`: Displayed when there is no data.
- **Redux Integration:**
  - Uses `refreshStatus` from Redux to determine when to reload data.
  - Dispatches `setIsRefreshed(false)` once data has been refreshed.
- **Quick Filtering:**
  - `input` box at the top of the grid to filter rows quickly.

---

## 🎯 Notes

- Ensure AG Grid CSS is globally included (e.g. `ag-theme-alpine`).
- The `fetchData` function should return a structure like:
  ```ts
  {
    data: {
      userList: Array<any>;
    }
  }
  ```
- All column fields must be defined in the `columnDefs` array passed as props.

---

## 📎 Related Components

- `SkeletonTable`: Located in `components/skelitonTable/`
- `CustomNoRowsOverlay`: Same directory as `SkeletonTable`

---

## 📁 File Structure

```
GenericAgGrid.tsx
components/
  └── skelitonTable/
        ├── SkelitonTable.tsx
        └── CustomNoRowsOverlay.tsx
store/
  └── slices/userSlice.ts
```

---
