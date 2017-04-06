const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
            break;
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
            return state.map(t => t.id === action.id
            ? Object.assign({}, t, {completed: !t.completed})
            : t);
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

const { combineReducers } = Redux;
const todoApp = combineReducers({
    todos, // es6 short hand notation for todos: todos
    visibilityFilter
});


const { createStore } = Redux;
const store = createStore(todoApp);

const { Component } = React;

class FilterLink extends Component {
    render() {
        const {filter, currentFilter, children} = this.props;

        if (filter === currentFilter) {
            return (React.createElement('span', {}, children))
        }

        return (React.createElement('a', {
            href: '#',
            onClick: e => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter: filter
                });
            }
        }, children)
        );
    }
}

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
    }
}

class Todo extends Component {
    render () {
        const {onClick, completed, text} = this.props;

        React.createElement('li', { 
                onClick, 
                style: {
                    textDecoration: completed ? 'line-through' : 'none'
                }
            }, 
        text);
    }
}

let nextTodoId = 0;
class TodoAppComponent extends Component {
    render () {
        const {
            todos,
            visibilityFilter
        } = this.props;
        
        const visibleTodos = getVisibleTodos(todos, visibilityFilter);

        return (
            React.createElement('div', {},
                React.createElement("input", { ref: (node) => {
                    this.input = node;
                }}),
                React.createElement('button', {
                    onClick: () => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            text: this.input.value,
                            id: nextTodoId++
                        });
                        this.input.value = '';
                    }
                }, 'Add Todo'),
                React.createElement('ul', {}, visibleTodos.map(t => 
                    React.createElement(Todo, {
                        complete: t.completed, 
                        text: t.text, 
                        onClick: () => {
                            store.dispatch({
                                type: 'TOGGLE_TODO',
                                id: t.id
                            })
                        }
                    })
                )),
                React.createElement(FilterLink, { filter: 'SHOW_ALL', currentFilter: visibilityFilter }, 'All'),
                React.createElement(FilterLink, { filter: 'SHOW_ACTIVE', currentFilter: visibilityFilter}, 'Active'),
                React.createElement(FilterLink, { filter: 'SHOW_COMPLETED', currentFilter: visibilityFilter}, 'Completed')
            )
        );
    }
};
    
const render = () => {
    ReactDOM.render(React.createElement(TodoAppComponent, Object.assign({}, store.getState())), document.getElementById('root'));
}

store.subscribe(render);
render();

console.log(store.getState());
