// import { Provider } from 'react-redux'; //babel style
const { connect } = ReactRedux;

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
            return state.map(t => 
                t.id === action.id 
                ? Object.assign({}, t, {completed: !t.completed}) 
                : t
            );
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

const {
    combineReducers
} = Redux;
const todoApp = combineReducers({
    todos,
    visibilityFilter
});
 
const {
    Component
} = React;

class Link extends Component {
    render() {
        const {
            active,
            children,
            onClick
        } = this.props;

        if (active) {
            return (React.createElement('span', {}, children))
        }

        return (React.createElement('a', {
            href: '#',
            onClick: () => { onClick(); },
        }, children));
    }
}

const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    }
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => (dispatch({  type: 'SET_VISIBILITY_FILTER', filter: ownProps.filter }))
    }
}

const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);

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
    render() {
        const {
            onClick,
            completed,
            text,
            id
        } = this.props;

        return (React.createElement('li', {
                onClick,
                key: id,
                style: {
                    textDecoration: completed ? 'line-through' : 'none'
                }
            },
            text));
    }
}

class TodoList extends Component {
    render() {
        const {
            todos,
            onTodoClick
        } = this.props;
        return (React.createElement('ul', {}, todos.map(t =>
            React.createElement(Todo, {
                completed: t.completed,
                text: t.text,
                key: t.id,
                onClick: () => {
                    onTodoClick(t.id)
                }
            })
        )));
    }
}

let nextTodoId = 0;
let AddTodo = ({ dispatch }) => {
    let input = null;
    return (
        React.createElement(
            'div', {},
            React.createElement("input", {
                ref: (node) => {
                    input = node;
                }
            }),
            React.createElement('button', {
                onClick: () => {
                        dispatch({
                        type: 'ADD_TODO',
                        text: input.value,
                        id: nextTodoId++
                    });
                    input.value = '';
                }
            }, 'Add Todo')
        )
    )
}

// note AddTodo already declared as a class, note the last part of this where AddTodo is passed:
AddTodo = connect()(AddTodo); // passing nothing to connect, you get dispatch by default (but no subscription to store)

class Footer extends Component {
    render() {
        return (
            React.createElement('div', {}, 
                React.createElement(FilterLink, {
                    filter: 'SHOW_ALL',
                }, 'All'),
                React.createElement(FilterLink, {
                    filter: 'SHOW_ACTIVE',
                }, 'Active'),
                React.createElement(FilterLink, {
                    filter: 'SHOW_COMPLETED',
                }, 'Completed')
            )
        )
    }
}

class TodoAppComponent extends Component {
    render() {
        return (
            React.createElement('div', {},
                React.createElement(AddTodo),
                React.createElement(VisibleTodoList),
                React.createElement(Footer)
            )
        );
    }
};

const { createStore } = Redux;
const { Provider } = ReactRedux;

const mapStateTodoListToProps = (state) => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
};
const mapDispatchTodoListToProps = (dispatch) => {
    return {
        onTodoClick: (id) => dispatch({ 
            type: 'TOGGLE_TODO',
            id
        })
    }
}
// see video 27 for converting VisibleTodoList class to ReactRedux connect
const VisibleTodoList = connect(
    mapStateTodoListToProps,
    mapDispatchTodoListToProps
)(TodoList);

const render = () => {
    ReactDOM.render(
        React.createElement(Provider, { store : createStore(todoApp)}, React.createElement(TodoAppComponent)),
        document.getElementById('root')
        );
}

render();
