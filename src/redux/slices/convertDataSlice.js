// src/redux/slices/convertDataSlice.js
'use client';

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as XLSX from "xlsx";
import Tesseract from "tesseract.js";
import Papa from "papaparse";

const initialState = {
  data: [],
  searchTerm: '',
  filtered: [],
  loading: false,
  error: null,
  progress: 0
};

export const handleFileUpload = createAsyncThunk(
  'data/handleFileUpload',
  async (file, { rejectWithValue, dispatch }) => {
    const updateProgress = (progress) => {
      dispatch(setProgress(Math.floor(progress * 100)));
    };

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'xlsx') {
        updateProgress(0.3);
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        updateProgress(0.7);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        updateProgress(1);
        return XLSX.utils.sheet_to_json(sheet);
      }

      if (extension === 'csv') {
        return new Promise((resolve, reject) => {
          const results = [];
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            chunk: (chunk) => {
              results.push(...chunk.data);
              updateProgress(results.length / 1000); // Simple progress estimation
            },
            complete: () => {
              updateProgress(1);
              resolve(results);
            },
            error: (err) => reject(err),
          });
        });
      }

      if (extension === 'pdf') {
        if (typeof window === 'undefined') {
          throw new Error('PDF processing requires browser environment');
        }
        
        updateProgress(0.1);
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        
        const data = new Uint8Array(await file.arrayBuffer());
        updateProgress(0.3);
        const pdf = await pdfjs.getDocument({ data }).promise;
        const textContent = [];
        const totalPages = pdf.numPages;
        
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .filter(item => 'str' in item)
            .map(item => item.str)
            .join(' ');
          textContent.push({ Page: i, Text: pageText });
          updateProgress(0.3 + (i / totalPages) * 0.7);
        }
        return textContent;
      }

      if (file.type.startsWith('image/')) {
        const { data } = await Tesseract.recognize(file, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              updateProgress(m.progress);
            }
          }
        });
        return [{ Text: data.text }];
      }

      throw new Error('Unsupported file type');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      const searchLower = action.payload.toLowerCase();
      state.filtered = state.data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleFileUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.progress = 0;
      })
      .addCase(handleFileUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.filtered = action.payload;
        state.progress = 100;
      })
      .addCase(handleFileUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.progress = 0;
      });
  }
});

export const { setSearchTerm, setProgress, resetData } = dataSlice.actions;
export default dataSlice.reducer;