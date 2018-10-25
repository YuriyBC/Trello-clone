import React from 'react'
import { CatalogListTasks } from './CatalogListTasks'
import './Catalog.css';
import '../../assets/css/fontawesome-all.min.css'

export const CatalogItem = (props) => {
    const { item, addTaskInCatalog, switchTaskInCatalog, dragElementInCatalog } = props
    function onDrop (ev) {
        ev.preventDefault()
        let payload = ev.dataTransfer.getData('task')
        payload = payload ? JSON.parse(payload) : null
        payload.aimCatalogId = +ev.currentTarget.id

        dragElementInCatalog(payload)
    }
    function sibmitForm (ev, id) {
        if (ev.key === 'Enter') {
            addTaskInCatalog(ev, id)
        }
    }

    function allowDrop (ev) {
        ev.preventDefault()
        ev.stopPropagation()
    }
    return (
        <div
            id={item.id}
            onDrop={onDrop}
            onDragOver={allowDrop}
            className="catalog__item">
        <div className="catalog__item-title">{item.title}</div>
        <input type="text"
               className="taskForm"
               ref={form => {this.form = form}}
               onKeyDown={(ev) => {sibmitForm(ev, item.id)}} />
        <CatalogListTasks
            catalogId={item.id}
            switchTaskInCatalog={switchTaskInCatalog}
            taskList={item.tasks}/>
    </div>
)}