import _methods from '../utils/_methods'
import _models from '../utils/models'
import {addCatalog} from '../utils/api'
import {changeCatalog} from '../utils/api'

const {
    CatalogItemModel,
    TaskModel
} = _models

const initialState = {}


function updateTasks (catalogList) {
    const boardId = +window.location.pathname.slice(1);
    let allTasks = [];

    for (let i in catalogList[boardId]) {
        if (catalogList[boardId][i].tasks.length) {
            allTasks = [...allTasks, ...catalogList[boardId][i].tasks]
        }
    }
    changeCatalog({
        boardId,
        data: allTasks
    })
}

export default function catalogList (state = initialState, action) {
    switch (action.type) {
        case 'SET_CATALOGS':
            function setCatalogs (data) {
                let newState = {...state}
                if (data.length) {
                    const boardId = data[0].board
                    newState[boardId] = data

                    newState[boardId].forEach((catalog) => {
                        if (catalog.tasks) {
                            catalog.tasks.forEach((task) => {
                                task.isComplited = task.isComplited !== 'false'
                            })
                        }
                    })
                }
                return newState
            }
            return setCatalogs(action.payload)
        case 'ADD_CATALOG_IN_THE_BOARD':
            function addCatalogInBoard (payload) {
                const [boardId, catalogTitle] = payload
                let newState = {...state}
                if (!newState[+boardId]) newState[+boardId] = []
                const catalog_id = newState[boardId].length

                const newObj = new CatalogItemModel(catalogTitle, catalog_id, boardId)
                addCatalog(newObj)

                newState[boardId].push(newObj)
                return newState
            }
            return addCatalogInBoard(action.payload)
        case 'ADD_TASK_IN_THE_CATALOG':
            return function () {
                const [boardId, catalogId, taskTitle] = action.payload;
                let newState = {...state};
                let currentCatalog = newState[boardId].filter((b) => {return b.id === catalogId})[0];
                const task_id = currentCatalog.tasks.length;

                currentCatalog.tasks.push(new TaskModel(taskTitle, task_id, boardId, catalogId));
                updateTasks(newState);

                return newState
            }();
        case 'SWITCH_TASK_IN_THE_CATALOG':
            const [board_Id, catalog_Id, task_Id] = action.payload
            let board_List = {...state};

            const currentCatalog = board_List[board_Id].filter((catalog) => {
                return catalog.id === catalog_Id
            })[0];
            const task = currentCatalog.tasks.find((task) => {
              return task.id === task_Id
            });
            task.isComplited = !task.isComplited;
            updateTasks(board_List);

            return board_List;

        case 'DRAG_TASK_IN_THE_CATALOG':
            function addElement ([boardId, value]) {
                const dropCatalogId = value.aimCatalogId.toString()
                const dragCatalogId = value.catalogId.toString()
                let boardList = {...state}

                if (dragCatalogId !== dropCatalogId) {
                    let dropCatalog = boardList[boardId].filter((b) => {return b.id.toString() === dropCatalogId})[0];
                    let dragCatalog = boardList[boardId].filter((b) => {return b.id.toString() === dragCatalogId})[0];

                    let dragCatalogTasksWithoutDraggble = dragCatalog.tasks.filter((t) => t.id !== value.id)

                    value.catalog = value.aimCatalogId
                    value.catalogId = value.aimCatalogId

                    dropCatalog.tasks.push(value)
                    dragCatalog.tasks = dragCatalogTasksWithoutDraggble

                    dropCatalog.tasks.forEach((v, index) => {v.id = index})
                    dragCatalog.tasks.forEach((v, index) => {v.id = index})
                }
                updateTasks(boardList);
                return boardList
            }
            return addElement(action.payload)
        case 'REMOVE_TASK_IN_THE_CATALOG':
            function removeTaskFromCatalog ([boardId, value]) {
                let newState = {...state}
                const dragCatalogId = value.catalogId.toString()
                let dragCatalog = newState[boardId].filter((b) => {return b.id.toString() === dragCatalogId})[0];
                let tasksWithoutDraggble = dragCatalog.tasks.filter((t) => t.id !== value.id)

                dragCatalog.tasks = tasksWithoutDraggble;

                updateTasks(newState);
                return newState
            }
            return removeTaskFromCatalog(action.payload)
        default: return state
    }
    return state
}
