import React from 'react'
import { BoardListItemComponent } from './BoardItemComponent'

export const BoardListComponent = (props) => {
  const {
    list,
    deleteBoard,
    toBoard
  } = props
  let array = list.map((val) => {
    return <BoardListItemComponent
      id={val.id}
      name={val.title}
      deleteBoard={($event) => {
        deleteBoard($event, val.id)
      }}
      toBoard={toBoard}
      key={val.id}>
  </BoardListItemComponent>})
    return (
    array
  )
}