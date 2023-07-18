import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import { User } from '../../app/types';
import { RootState } from '../../app/store';

interface FetchResponseType {
    nickname?: User['nickname'] | null;
    error?: string | null;
}

interface NicknameState extends FetchResponseType {
    status: 'idle' | 'loading' | 'failed';
}

const initialState: NicknameState = {
    nickname: null,
    status: 'idle',
    error: null,
};

export const fetchNickname = createAsyncThunk(
    'nickname/fetchNickname',
    async (userId: string) => {
        const rawFetchResponse = await fetch('/api/getNicknameById', {
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

const nicknameSlice = createSlice({
    name: 'nickname',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchNickname.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNickname.fulfilled, (state, action) => {
                state.status = 'idle';
                state.nickname = action.payload.nickname;
            })
            .addCase(fetchNickname.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const selectNickname = createSelector(
    (state: RootState) => state.nickname,
    (nickname) => nickname
);

export default nicknameSlice.reducer;
