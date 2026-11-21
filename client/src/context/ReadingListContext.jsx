import { createContext, useContext, useEffect, useReducer } from "react";

// Create the context
const ReadingListContext = createContext();

// Reducer handles all reading list actions
function readingListReducer(state, action) {
  switch (action.type) {
    case "ADD_BOOK": {
      const alreadyExists = state.some((book) => book.id === action.payload.id);

      if (alreadyExists) {
        return state;
      }

      return [...state, action.payload];
    }

    case "REMOVE_BOOK":
      return state.filter((book) => book.id !== action.payload);

    case "CLEAR_LIST":
      return [];

    default:
      return state;
  }
}

// Restore saved books from localStorage
function getInitialReadingList() {
  try {
    const savedList = localStorage.getItem("readingList");
    return savedList ? JSON.parse(savedList) : [];
  } catch (error) {
    console.error("Could not restore reading list:", error);
    return [];
  }
}

// Provider makes the reading list available to the application
export function ReadingListProvider({ children }) {
  const [readingList, dispatch] = useReducer(
    readingListReducer,
    undefined,
    getInitialReadingList,
  );

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("readingList", JSON.stringify(readingList));
  }, [readingList]);

  const addBook = (book) => {
    dispatch({ type: "ADD_BOOK", payload: book });
  };

  const removeBook = (bookId) => {
    dispatch({ type: "REMOVE_BOOK", payload: bookId });
  };

  const clearList = () => {
    dispatch({ type: "CLEAR_LIST" });
  };

  return (
    <ReadingListContext.Provider
      value={{ readingList, addBook, removeBook, clearList }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

// Custom hook for accessing the reading list
export function useReadingList() {
  const context = useContext(ReadingListContext);

  if (!context) {
    throw new Error("useReadingList must be used inside ReadingListProvider");
  }

  return context;
}
