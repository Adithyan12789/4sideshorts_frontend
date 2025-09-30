import axios from "axios";
import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getNewsChannelList = createAsyncThunk(
  "admin/getNewsChannelList/get",
  async (payload) => {
    const response = await apiInstanceFetch.get(
      `/api/admin/movieSeries/fetchAllMediaContent?start=${payload?.page}&limit=${payload?.size}`
    );

    console.log("getNewsChannelResponse: ", response);
    return response;
  }
);

export const getNewsChannelListVideo = createAsyncThunk(
  "admin/getNewsChannelListVideo/get",
  async (payload) => {
    const response = await apiInstanceFetch.get(
      `/api/admin/shortVideo/retrieveMovieSeriesVideoData?start=${payload?.start}&limit=${payload?.limit}&movieSeriesId=${payload?.movieSeriesId}`
    );

    console.log("getNewsChannelListVideo: ", response);

    return response;
  }
);

export const addNewsChannelList = createAsyncThunk(
  "admin/addNewsChannelList/add",
  async (payload) => {
    const response = await apiInstanceFetch.post(
      `/api/admin/movieSeries/createContent`,
      payload
    );
    return response;
  }
);
export const uploadImage = createAsyncThunk(
  "admin/uploadImage/add",
  async (payload) => {
    console.log("payloaddd", payload);

    // console.log("payloaddd",payload)
    const response = await axios.post(`/api/admin/file/upload-file`, payload);
    return response;
  }
);

export const editNewsChannelList = createAsyncThunk(
  "admin/editNewsChannelList/update",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/movieSeries/updateContent`,
      payload
    );

    console.log("editNewsChannelList: ", response);
    return response;
  }
);
export const newsChannelListActive = createAsyncThunk(
  "admin/newsChannelListActive/update",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/movieSeries/toggleActiveStatus?movieWebseriesId=${payload}`
    );
    return response;
  }
);
export const newsChannelListBanner = createAsyncThunk(
  "admin/newsChannelListBanner/update",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/movieSeries/toggleAutoAnimateBanner?movieWebseriesId=${payload}`
    );
    return response;
  }
);
export const newsChannelListTrending = createAsyncThunk(
  "admin/newsChannelListTrending/update",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/movieSeries/toggleTrendingStatus?movieWebseriesId=${payload}`
    );
    return response;
  }
);

export const deleteNewsCategory = createAsyncThunk(
  "admin/deleteNewsCategory/delete",
  async (payload) => {
    const response = await apiInstanceFetch.delete(
      `/api/admin/category/deleteCategory?categoryId=${payload}`
    );
    return response;
  }
);

export const deleteNewsChannel = createAsyncThunk(
  "api/admin/movieSeries/removeMovieSeries",
  async (payload) => {
    return await apiInstanceFetch.delete(
      `/api/admin/movieSeries/removeMovieSeries?movieWebseriesId=${payload}`
    );
  }
);

export const deleteShortVideo = createAsyncThunk(
  "api/admin/shortVideo/removeShortMedia",
  async (payload) => {
    return await apiInstanceFetch.delete(
      `/api/admin/shortVideo/removeShortMedia?start=${payload.start}&limit=${payload.limit}&shortVideoId=${payload.shortVideoId}&movieSeriesId=${payload.movieSeriesId}`
    );
  }
);

// API function for updating news position
export const updateNewsPosition = createAsyncThunk(
  "api/admin/shortVideo/editShortVideo",
  async (payload) => {
    const { movieSeriesId, shortVideoId, newNewsPosition } = payload;
    const response = await apiInstanceFetch.patch(
      `/api/admin/shortVideo/editShortVideo?movieSeriesId=${movieSeriesId}&shortVideoId=${shortVideoId}&newNewsPosition=${newNewsPosition}`
    );

    console.log("updateNewsPosition: ", response);
    return response;
  }
);

// Batch update multiple News positions
export const reorderNews = createAsyncThunk(
  "api/admin/shortVideo/editShortVideo",
  async (payload) => {
    const { movieSeriesId, newses } = payload;

    // Call the API for each News that needs position update
    const updatePromises = newses.map((news) =>
      apiInstanceFetch.patch(
        `/api/admin/shortVideo/editShortVideo?movieSeriesId=${movieSeriesId}&shortVideoId=${news._id}`,
        { newNewsPosition: news.newsNumber }
      )
    );

    const responses = await Promise.all(updatePromises);

    console.log("reorderNewses responses: ", responses);

    return {
      status: true,
      message: "Newses reordered successfully",
      data: newses,
      responses,
    };
  }
);

const newsChannelListSlice = createSlice({
  name: "newsChannelsList",
  initialState: {
    newsChannelsList: [],
    newsChannelListVideo: [],
    totalUser: 0,
    dailyReward: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNewsChannelList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getNewsChannelList.fulfilled, (state, action) => {
      // console.log("actiop", action);
      state.isLoading = false;
      state.newsChannelsList = action?.payload.data;
      state.totalUser = action?.payload.total;
    });
    builder.addCase(getNewsChannelList.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
    builder.addCase(getNewsChannelListVideo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getNewsChannelListVideo.fulfilled, (state, action) => {
      // console.log("actiop", action);
      state.isLoading = false;
      state.newsChannelListVideo = action?.payload.data;
      state.totalUser = action?.payload?.total;
    });
    builder.addCase(getNewsChannelListVideo.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
    builder.addCase(editNewsChannelList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(editNewsChannelList.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(addNewsChannelList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(addNewsChannelList.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deleteNewsChannel.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteNewsChannel.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deleteShortVideo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteShortVideo.fulfilled, (state, action) => {
      console.log("actiop", action);
      if (action.payload.status) {
        state.isLoading = false;
        state.newsChannelListVideo = action?.payload.videos;
        setToast("success", action.payload?.message);
      } else {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    });
    builder.addCase(deleteShortVideo.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
    builder.addCase(updateNewsPosition.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateNewsPosition.fulfilled, (state, action) => {
      // state.isLoading = false;
      if (action.payload.status) {
        setToast("success", "News position updated successfully");
        // manually update the state
        // state.newsChannelListVideo = action.payload.;
      } else {
        setToast("error", action.payload?.message);
      }
    });
    builder.addCase(updateNewsPosition.rejected, (state, action) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
    });
    // builder.addCase(reorderNewses.pending, (state, action) => {
    //     state.isLoading = true;
    // });
    // builder.addCase(reorderNewses.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     if (action.payload.status) {
    //         setToast("success", action.payload?.message);
    //         // Update the local state with reordered newses
    //         state.newsChannelListVideo = action.payload.data;
    //     } else {
    //         setToast("error", action.payload?.message);
    //     }
    // });
    // builder.addCase(reorderNewses.rejected, (state, action) => {
    //   state.isLoading = false;
    //   setToast("error", action.payload?.message);
    // });
  },
});

export default newsChannelListSlice.reducer;
