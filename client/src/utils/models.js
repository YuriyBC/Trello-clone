class BoardModel {
    constructor(name, index) {
        this.title = name;
        this.order = index;
    }
}

class CatalogItemModel {
    constructor (title, id, boardId) {
        this.title = title;
        this.tasks = [];
        this.id = id;
        this.boardId = boardId;
    }
}

class TaskModel {
    constructor (title, id, boardId, catalogId) {
        this.title = title;
        this.isComplited = false;
        this.id = id;
        this.boardId = boardId;
        this.catalog = catalogId;
    }
}

export default {
    BoardModel,
    CatalogItemModel,
    TaskModel
}