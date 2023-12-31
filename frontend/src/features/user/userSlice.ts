import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import { User } from '../../app/types';
import { RootState } from '../../app/store';

interface FetchResponseType {
    user?: User | null;
    error?: string | null;
}

interface UserState extends FetchResponseType {
    status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null,
};

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (userId: string) => {
        const rawFetchResponse = await fetch('/api/getUserProfileById', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
            }),
        });

        const fetchResponse: FetchResponseType = await rawFetchResponse.json();

        return fetchResponse;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action.payload.user;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const selectUser = createSelector(
    (state: RootState) => state.user,
    (user) => user
);

export default userSlice.reducer;
