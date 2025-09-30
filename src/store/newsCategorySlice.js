import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getNewsCategory = createAsyncThunk("admin/getNewsCategory/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/category/fetchCategory?start=${payload?.page}&limit=${payload?.size}`)
        return response;
    }
)
export const getNewsActiveCategory = createAsyncThunk("admin/getNewsActiveCategory/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/category/getNewsCategoryOptions`)

        console.log("getNewsActiveCategory res: ", response)

        return response.data;
    }
)

export const addNewsCategory = createAsyncThunk("/admin/addNewsCategory/add",
    async (payload) => {
        const response = await apiInstanceFetch.post(`/api/admin/category/createCategory`, payload)
        return response;
    }
)

export const editNewsCategory = createAsyncThunk("admin/editNewsCategory/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/category/updateCategory?categoryId=${payload?.categoryId}&name=${payload?.name}`)
        return response;
    }
)
export const newsCategoryActive = createAsyncThunk("admin/newsCategoryActive/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/category/modifyActiveState?categoryId=${payload}`)
        return response;
    }
)

// modifyActiveState


export const deleteNewsCategory = createAsyncThunk("admin/deleteNewsCategory/delete",
    async (payload) => {
        const response = await apiInstanceFetch.delete(`/api/admin/category/deleteCategory?categoryId=${payload}`)
        return response;
    }
)
const newsSlice = createSlice({
    name: "newsCategory",
    initialState: {
        newsCategory: [],
        newsActiveCategory:[],
        dailyReward: [],
        isLoading: false,
        total: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getNewsCategory.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getNewsCategory.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.newsCategory = action.payload.data;
                state.total = action.payload.total;
            }
        );
        builder.addCase(
            getNewsCategory.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getNewsActiveCategory.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getNewsActiveCategory.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.newsActiveCategory = action.payload;
            }
        );
        builder.addCase(
            getNewsActiveCategory.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            editNewsCategory.pending,
            (state, action) => {
                state.isLoading = true;
            }
        )
        builder.addCase(
            editNewsCategory.fulfilled,
            (state, action) => {
                state.isLoading = false;
            }
        )
    },
});

export default newsSlice.reducer;
