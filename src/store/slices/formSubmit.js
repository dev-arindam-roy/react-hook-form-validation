import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const initialState = {
  data: {},
  isLoading: false,
  message: null,
  isSuccess: false,
};


/**
 * NOTE
 * when upload any file the header should be 'Content-Type': 'multipart/form-data'
 * if you want to keep the header 'application/json' and also want to upload then upload file 
 * should be in base64 folmat
 * 
 * const payload = {
      ...formData,
      profileImage: formData.profileImage[0],
      certificateImage: formData.certificateImage[0],
    };

    -OR-

    const payloadData = new FormData();
    payloadData.append("profileImage", await fileToBase64(formData.profileImage[0]));
    payloadData.append(key, formData[key]);
 * 
 */
export const formDataSubmit = createAsyncThunk(
  'form/dataSubmit',
  async (data) => {
    try {
      const response = await api.post('form-submit', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response?.data;
    } catch (err) {
      return err.response?.data || 'failed';
    }
  }
);

export const formDataSubmitSlice = createSlice({
  name: 'formDataSubmitSlice',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(formDataSubmit.pending, (state, { payload }) => {
      state.isLoading = true;
      state.message = '';
      state.isSuccess = false;
    });
    builder.addCase(formDataSubmit.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.isLoading = false;
      state.isSuccess = true;
      state.message = 'Form submitted successfully';
    });
    builder.addCase(formDataSubmit.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.message = 'Something went wrong!!';
    });
  },
});

export default formDataSubmitSlice.reducer;
