import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit';
import { User } from '../../app/types';
import { RootState } from '../../app/store';

interface FetchResponseType {
    userId?: string;
    nickname?: User['nickname'] | null;
    error?: string | null;
}

interface NicknameState {
    error: string | null;
    nickNameIdPairs: Record<string, User['nickname']>;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: NicknameState = {
    nickNameIdPairs: {},
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

                const userId = action.payload.userId as string;
                state.nickNameIdPairs[userId] = action.payload
                    .nickname as string;
            })
            .addCase(fetchNickname.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string;
            });
    },
});

export const selectNicknames = createSelector(
    (state: RootState) => state.nickname,
    (nickname) => nickname
);

export default nicknameSlice.reducer;
