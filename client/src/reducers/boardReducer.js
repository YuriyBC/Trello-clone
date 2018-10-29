import {
    addBoard,
    removeBoard,
    setBoards
} from '../utils/api'

const initialState = [];

export default function boardList (state = initialState, action) {
    switch (action.type) {
        case 'SET_STATE':
            setBoards(action.payload);
            return action.payload;
        case 'ADD_BOARD_IN_THE_LIST':
            addBoard(action.payload);
            return [...state, action.payload];
        case 'REMOVE_BOARD':
            removeBoard(action.payload);
            return [...state].filter((el) => {
                return el.id !== action.payload.id
            });
    }
    return state
}