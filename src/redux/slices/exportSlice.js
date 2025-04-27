import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exportFormat: null, // 'pdf' or 'image'
  exportRequested: false,
};

const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    requestExport: (state, action) => {
      const format = action.payload;
      if (format === "pdf" || format === "image") {
        state.exportFormat = format;
        state.exportRequested = true;
      } else {
        console.warn(`Invalid export format requested: ${format}`);
      }
    },
    completeExport: (state) => {
      state.exportRequested = false;
    },
    resetExport: (state) => {
      state.exportFormat = null;
      state.exportRequested = false;
    },
  },
});

export const { requestExport, completeExport, resetExport } = exportSlice.actions;
export default exportSlice.reducer;
