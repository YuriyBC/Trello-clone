const API = "http://localhost:3001"
const headers = {
    "delete": {
        "Content-type": "application/json"
    },
    "post": {
        "Content-type": "application/json"
    }
};

// BOARDS START
export const getBoard = () => {
    let url = API + '/boards'
    return fetch(url, {
        method: 'GET'
    }).then((resp) => resp.json())
        .then(function(data) {
          return data
        })
}

export const setBoards = (payload) => {
    const url = API + '/setboards';
    return fetch(url, {
        method: 'POST',
        headers: headers.post,
        body: JSON.stringify(payload)
    })
};

export const addBoard = (payload) => {
    console.log(payload)
    const url = API + '/boards';
    return fetch(url, {
        method: 'POST',
        headers: headers.post,
        body: JSON.stringify(payload)
    })
};

export const removeBoard = (payload) => {
    const url = API + '/boards';
    return fetch(url, {
        method: 'DELETE',
        headers: headers.delete,
        body: JSON.stringify(payload)
    })
};
// BOARDS END

// CATALOG START
const getCatalogs = () => {
    const URL = API + '/catalogs'

};

export const deleteCatalog = (payload) => {
    const url = API + '/catalog';
    return fetch(url, {
        method: 'DELETE',
        headers: headers.delete,
        body: JSON.stringify(payload)
    })
};

export const addCatalog = (data) => {
    let payload = {...data};
    payload.tasks = '';
    const url = API + '/catalog';
    return fetch(url, {
        method: 'POST',
        headers: headers.post,
        body: JSON.stringify(payload)
    })
};

export const getCatalog = (boardId) => {
    let url = API + `/catalog?boardId=${boardId}`
    return fetch(url, {
        method: 'GET'
    }).then((res) => res.json())
};

export const changeCatalog = (payload) => {
    const url = API + '/tasks';
    fetch(url, {
        method: 'POST',
        headers: headers.post,
        body: JSON.stringify(payload)
    })
};

// CATALOG END
