import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (offset: number) => {
  const response = await fetch(
    "https://api.weekday.technology/adhoc/getSampleJdJSON",
    {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        limit: 10,
        offset,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const data = await response.json();
    console.log("uu", data);
    return data;
  }
});

const initialState: any = {
  jobs: [],
  total: 0,
  jobRoles: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        console.log("hello", action);
        state.loading = false;
        state.error = null;
        state.jobs = [...state.jobs, ...action.payload.jdList];
        state.total = action.payload.total;
        state.jobRoles = [
          ...(new Set(
            action.payload.jdList.map((job: any) => job.jobRole)
          ) as any),
        ];
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch jobs";
      });
  },
});

export default jobSlice.reducer;
