import tokenService from './tokenService';

const BASE_URL = '/api/tasks/';


//INDEX
export function index(){
    return fetch(BASE_URL, {
        headers: {
            'Athorization': 'Bearer ' + tokenService.getToken()
        }
    }).then(res => res.json());
}

export function indexByUser(taskID){
    return fetch(`${BASE_URL}subtasks/${taskID}`, {
        headers: {
            'Athorization': 'Bearer ' + tokenService.getToken()
        }
    }).then(res => res.json());
}

export function indexCategory(){
    return fetch(`${BASE_URL}category`, {
        headers: {
            'Athorization': 'Bearer ' + tokenService.getToken()
        }
    }).then(res => res.json());
}

export function indexPunchCardsByTask(taskID){
    return fetch(`${BASE_URL}punchcardsbytask/${taskID}`, {
        headers: {
            'Athorization': 'Bearer ' + tokenService.getToken()
        }
    }).then(res => res.json());
}

export function indexPunchCardsByUser(userID){
    return fetch(`${BASE_URL}punchcardsbyuser/${userID}`, {
        headers: {
            'Athorization': 'Bearer ' + tokenService.getToken()
        }
    }).then(res => res.json());
}

//CREATE
export function createTask(formData){
    return fetch(`${BASE_URL}create`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json', 'Athorization': 'Bearer ' + tokenService.getToken()}
    }).then(res => res.json());
}

export function createCategory(formData){
    return fetch(`${BASE_URL}category/create`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json', 'Athorization': 'Bearer ' + tokenService.getToken()}
    }).then(res => res.json());
}

export function createPunchCard(punchCardData){
    return fetch(`${BASE_URL}punchcard/create`, {
        method: 'POST',
        body: JSON.stringify(punchCardData),
        headers: {'Content-Type': 'application/json', 'Athorization': 'Bearer ' + tokenService.getToken()}
    }).then(res => res.json());
}


//UPDATE
export function updateTask(taskData){
    return fetch(`${BASE_URL}update`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
        headers: {'Content-Type': 'application/json', 'Athorization': 'Bearer ' + tokenService.getToken()}
    }).then(res => res.json());
}

export function updatePunchCard(punchCardData){
    return fetch(`${BASE_URL}punchcard/update`, {
        method: 'PUT',
        body: JSON.stringify(punchCardData),
        headers: {'Content-Type': 'application/json', 'Athorization': 'Bearer ' + tokenService.getToken()}
    }).then(res => res.json());
}