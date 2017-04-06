const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
            break;
        case 'TOGGLE_TODO':
            if (state.ids!== state.id) {
                return state;
            } else {
                return Object.assign({}, state, {completed: !state.completed});
            }
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
}

const combineReducers = (reducers) => {
    return (state = {}, action) => {
        let keys = Object.keys(reducers);
        return keys.reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](state[key], action);
                return nextState;
            },
            {}
        );
    };
};

//const { combineReducers } = Redux;
const todoApp = combineReducers({
    todos, // es6 short hand notation for todos: todos
    visibilityFilter
})

/* Equivalent to above:
const todoApp = (state = {}, action) => {
    return {
        todos: todos(
            state.todos,
            action
        ),
        visibilityFilter: visibilityFilter(
            state.visibilityFilter,
            action
        )
    }
}*/

const {createStore} = Redux;
const store = createStore(todoApp);

console.log(store.getState());

console.log(store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
}));

console.log(store.dispatch({
    type: 'TOGGLE_TODO',
    id: 0,
    text: 'Learn Redux',
    completed: true
}));
 
console.log(store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_COMPLETED'
}));

console.log(store.getState());

/*
const testToggleTodo = () => {
    const stateBefore = [];

    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    }

    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: false
        }
    ]

    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: true
        }
    ]

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore)
    ).toEqual(stateAfter);
}

const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    }

    const stateAfter = [{
        id: 0,
        text: 'Learn Redux',
        completed: false
    }]

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
}

testAddTodo();

console.log('Pass.');*/
