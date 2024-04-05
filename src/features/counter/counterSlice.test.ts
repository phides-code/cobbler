import type { AppStore } from '../../app/store';
import { makeStore } from '../../app/store';
import type { CounterSliceState } from './counterSlice';
import {
    counterSlice,
    decrement,
    increment,
    incrementByAmount,
} from './counterSlice';

interface LocalTestContext {
    store: AppStore;
}

describe('counter reducer', (it) => {
    const initialState: CounterSliceState = {
        value: 3,
        status: 'idle',
    };
    beforeEach<LocalTestContext>((context) => {
        const store = makeStore({ counter: initialState });

        context.store = store;
    });

    it('should handle initial state', () => {
        expect(
            counterSlice.reducer(undefined, { type: 'unknown' })
        ).toStrictEqual({
            value: 0,
            status: 'idle',
        });
    });

    it('should handle increment', () => {
        const actual = counterSlice.reducer(initialState, increment());
        expect(actual.value).toEqual(4);
    });

    it('should handle decrement', () => {
        const actual = counterSlice.reducer(initialState, decrement());
        expect(actual.value).toEqual(2);
    });

    it('should handle incrementByAmount', () => {
        const actual = counterSlice.reducer(initialState, incrementByAmount(2));
        expect(actual.value).toEqual(5);
    });
});
