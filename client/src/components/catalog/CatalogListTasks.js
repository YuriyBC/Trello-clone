import React from 'react'

export const CatalogListTasks = (props) => {
    const {
        taskList,
        catalogId,
        switchTaskInCatalog
    } = props

    function checkIfTextOverflown (ev, isComplited) {
        const el = ev.target
        const textIsHidden = el.scrollHeight > el.clientHeight
        if (textIsHidden && !isComplited) {
            el.classList.add('allowHover')
        }
    }

    function expandText (ev) {
        const el = ev.target.parentElement
        el.style.maxHeight = 'inherit'
        el.classList.remove('allowHover')
        ev.stopPropagation()
    }

    function closeTextAndSwitchTask (ev, task_id) {
        const el = ev.target
        if (el.style.maxHeight === 'inherit') {
            el.style.maxHeight = '90px'
            el.classList.add('allowHover')
        } else {
            switchTaskInCatalog([catalogId, task_id])
        }
    }

    function DRAGG_CONTROLLER (type, payload) {
        switch (type) {
            case 'dragStart':
                const func = () => {
                   const ev = payload[0]
                   let data = payload[1]
                   data.catalogId = catalogId
                   ev.dataTransfer.setData("task", JSON.stringify(data));
                }
                return func()

        }
    }

    function Task (props) {
        return <div
            draggable="true"
            onDragStart={(ev) => {DRAGG_CONTROLLER('dragStart', [ev, props.item])}}
            onClick={(ev) => {closeTextAndSwitchTask(ev, props.id)}}
            onMouseOver={(ev) => {checkIfTextOverflown(ev, props.isComplited)}}
            className={`catalog__item-task ${props.isComplited ? 'complited' : 'incomplited'}`}>
            {props.title}
            {
                props.isComplited ? <i className="fas fa-check-circle"/> : <i className="fas fa-check"/>
            }
            <div className="catalog__item-task__expand" onClick={expandText}>Expand</div>
        </div>
    }

    let catalogTaskList = taskList.map((cat) => {
        return <Task
            item={cat}
            id={cat.id}
            isComplited={cat.isComplited}
            key={cat.id}
            title={cat.title}/>
    })
    return (
        catalogTaskList
    )
}