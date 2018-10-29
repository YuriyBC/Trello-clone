import React, { Component } from 'react'
import { BoardContentComponent } from '../components/board-content/boardContent'
import { connect } from 'react-redux'
import {getBoard, getCatalog} from '../utils/api'

class BoardContent extends Component {
    constructor (props) {
        super(props)
        this.boardId = +this.props.match.params.boardId
        this.state = {
            isCreateMode: true
        };
    }
    componentDidMount() {
        getBoard().then(res => {
            this.props.actions({type: 'SET_STATE', payload: res})
        });

        getCatalog(this.boardId).then(resp => {
            this.props.actions({type: 'SET_CATALOGS', payload: resp})
        })
    }

    switchCreateMode () {
        this.setState({
            isCreateMode: !this.state.isCreateMode
        })
    }
    addCatalogInBoard (catalogTitle) {
        this.props.actions({type: 'ADD_CATALOG_IN_THE_BOARD', payload: [this.boardId, catalogTitle]})
    }

    addTaskInCatalog (ev, id) {
        const catalogId = id
        const value = ev.target.value

        const currentCatalog = this.props.globalStore.catalogList[this.boardId].find((el) => {return el.id === id})
        const allTasksInCatalog = currentCatalog.tasks.map(v => {return v.title})
        const isTitleUnique = !allTasksInCatalog.includes(value)

        if (ev.key.toString().toLowerCase() === 'enter' && value && isTitleUnique) {
            this.props.actions({type: 'ADD_TASK_IN_THE_CATALOG', payload: [this.boardId, catalogId, value]})
            ev.target.value = ''

            setTimeout(() => {
                let els = document.getElementsByClassName('taskForm')
                for (let i in els) {
                    if (els[i].parentElement && els[i].parentElement.id == id) {
                        els[i].focus()
                    }
                }
            }, 200)
        }
    }

    removeItemFromCatalog (data) {
        this.props.actions({type: 'REMOVE_TASK_IN_THE_CATALOG', payload: [this.boardId, data]})
    }

    dragElementInCatalog (data) {
        this.props.actions({type: 'DRAG_TASK_IN_THE_CATALOG', payload: [this.boardId, data]})
    }

    switchTaskInCatalog ([catalogId, taskId]) {
        this.props.actions({type: 'SWITCH_TASK_IN_THE_CATALOG', payload: [this.boardId, catalogId, taskId]})
    }

    deleteCatalog (catalogId) {
        this.props.actions({type: 'DELETE_CATALOG', payload: {boardId: this.boardId, catalogId}})
    };

    render () {
        const currentCatalogs = this.props.globalStore.catalogList[this.boardId] || []
        return <BoardContentComponent
                    deleteCatalog={this.deleteCatalog.bind(this)}
                    isCreateMode={this.state.isCreateMode}
                    currentCatalogs={currentCatalogs}
                    switchCreateMode={this.switchCreateMode.bind(this)}
                    removeItemFromCatalog={this.removeItemFromCatalog.bind(this)}
                    dragElementInCatalog={this.dragElementInCatalog.bind(this)}
                    addTaskInCatalog={this.addTaskInCatalog.bind(this)}
                    addCatalogInBoard={this.addCatalogInBoard.bind(this)}
                    switchTaskInCatalog={this.switchTaskInCatalog.bind(this)}
                    boardList={this.props.globalStore.boardList}
                    catalogList={this.props.globalStore.catalogList}
                    id={this.props.match.params.boardId}/>
    }
}

export default connect (
    state => ({ globalStore: state }),
    actions => ({ actions })
)(BoardContent)