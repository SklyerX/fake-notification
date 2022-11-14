# Redux Toolkit

For a more informative guide visit https://redux-toolkit.js.org/tutorials/quick-start

---

### Getting Started (Quick Rundown)

We need to wrap our whole app in a redux provider component

```tsx
import { Provider } from "react-redux";
import { store } from "./redux/store";
```

```tsx
<Provider store={store}>...</Provider>
```

Create a redux folder to keep your code clean and maintainable then create a `store.ts` file in the redux folder with the following code

```ts
// Importing the reducer and the create function
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./navbarSlice";

// exporting our store so we can use in the App.tsx
export const store = configureStore({
  reducer: {
    preset: counterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

Create a file ending in `Slice` for a cleaner filesystem.

```ts
// Import the functons
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// export and create the actual slicer
export const counterSlice = createSlice({
  // Set the name so you can access it through React components
  name: "preset",
  // Set an inital value, this can be anything. Number, String, Array, Object, Etc
  initialState: {
    value: "all",
  },
  // Setup the reducer
  reducers: {
    // Create your functions here. This function updates the value by a custom value.
    changeState: (state, action: PayloadAction<string>) => {
      // Change the string
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeState } = counterSlice.actions;

// Export the reducer
export default counterSlice.reducer;
```
