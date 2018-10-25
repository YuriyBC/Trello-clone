import React from 'react'
import './boardContent.css'
import { CatalogItem } from '../catalog/CatalogItem'

export const BoardContentComponent = (props) => {
    const {
        id,
        boardList,
        catalogList,
        switchCreateMode,
        isCreateMode,
        currentCatalogs,
        addCatalogInBoard,
        addTaskInCatalog,
        switchTaskInCatalog,
        dragElementInCatalog,
        removeItemFromCatalog
    } = props

    const currentBoard = boardList.filter((board) => {
        return board.id.toString() === id.toString()
    })[0]

    const CatalogList = (props) => {
        const {
            currentCatalogs,
            addTaskInCatalog,
            switchTaskInCatalog
        } = props

        let catalogList = currentCatalogs.map((cat) => {
            return <CatalogItem
                item={cat}
                dragElementInCatalog={dragElementInCatalog}
                switchTaskInCatalog={switchTaskInCatalog}
                addTaskInCatalog={addTaskInCatalog}
                key={cat.id}/>
        })
        return (
            catalogList
        )
    }


    const addList = (ev) => {
        if (ev.key.toString().toLowerCase() === 'enter') {
            addCatalogInBoard(ev.target.value)
            ev.target.value = ''
        }
    }
    function allowDrop (ev) {
        ev.preventDefault()
    }

    function removeItem (ev) {
        ev.preventDefault()
        let payload = ev.dataTransfer.getData('task')
        payload = payload ? JSON.parse(payload) : null
        payload.aimCatalogId = +ev.target.id

        removeItemFromCatalog(payload)
    }

    return (
        <div className="content">
            <div className="content__title">
                {currentBoard && <div>{currentBoard.title}</div>}
            </div>
            <CatalogList catalogList={catalogList}
                         switchTaskInCatalog={switchTaskInCatalog}
                         addTaskInCatalog={addTaskInCatalog}
                         currentCatalogs={currentCatalogs} />
            <div className="content__create">
                {isCreateMode ?
                    <div>
                        <div className="content__create-button" onClick={switchCreateMode}>
                            Add a list...
                        </div>
                        <div className="content__remove"
                             onDrop={removeItem}
                             onDragOver={allowDrop}>
                            <i className="fas fa-trash-alt"></i>
                        </div>
                    </div>
                  :
                    <div className="content__create-button active">
                        <i className="fas fa-times-circle"
                            onClick={switchCreateMode}/>
                        <input type="text"
                               onKeyDown={addList}
                               placeholder="Add a list..."/>
                    </div>
                }
            </div>
        </div>
    )
}