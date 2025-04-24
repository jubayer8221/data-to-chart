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
      state.exportFormat = action.payload; // 'pdf' or 'image'
      state.exportRequested = true;
    },
    resetExport: (state) => {
      state.exportFormat = null;
      state.exportRequested = false;
    },
  },
});

export const { requestExport, resetExport } = exportSlice.actions;
export default exportSlice.reducer;