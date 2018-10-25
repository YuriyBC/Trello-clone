import { combineReducers } from 'redux'
import boardList from './board'
import catalogList from './catalog'

export default combineReducers({
    boardList,
    catalogList
})