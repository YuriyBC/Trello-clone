import React from 'react'

export const BoardListItemComponent = (props) => {
  const {name, id, deleteBoard, toBoard} = props
  return (
        <div className="board__block" id={id} onClick={() => toBoard(id)}>
            <i onClick={deleteBoard} className="far fa-times-circle"/>
                {name}
        </div>
  )
}