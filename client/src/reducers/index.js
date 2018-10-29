import { combineReducers } from 'redux'
import boardList from './boardReducer'
import catalogList from './catalogReducer'

export default combineReducers({
    boardList,
    catalogList
})