const { Component } = React;
const { createStore } = Redux;
const { Provider } = ReactRedux;
const { connect } = ReactRedux;

const nodes = (state = [], action) => {
    switch (action.type) {
        case 'ADD_NODE': 
        return [
            ...state,
            { 
                id: action.id,
                text: action.text,
                editing: false
            }
        ];
        case 'TOGGLE_EDIT':
            return state.map(n => {
                return Object.assign({}, n, {editing: n.id === action.id, text: action.text});
            });
        default:
            return state;
    }
}

const {
    combineReducers
} = Redux;

const todoApp = combineReducers({
    nodes
});

let nextChildNodeId = 0;
class Tree extends Component {
    render() {
        const { nodes, onClick, onKeyPress, dispatch } = this.props;
        let input = null;
        return (
            React.createElement('div', {},
                React.createElement('ul', {}, 
                    nodes.map((node) => { 
                        if (node.editing) {
                            return (React.createElement('input', {
                                key: node.id,
                                defaultValue: node.text,
                                onKeyPress: (e) => {
                                    if (e.charCode == 13) {
                                        dispatch({ id: node.id, text: e.target.value, type: 'TOGGLE_EDIT' })
                                    }
                                },
                            }))
                        }
                        return (React.createElement('li', { 
                            key: node.id,
                            onClick: (e) => {
                                dispatch({ id: node.id, text: e.target.innerText, type: 'TOGGLE_EDIT' }) }
                            }, 
                            node.text)); 
                    })
                )
            )
        );
    }
}
const mapStateNodesToProps = (state) => {
    return { nodes: state.nodes };
}
const mapDispatchNodesToProps = (dispatch, ownProps) => {
    return { 
        onClick: (id, text) => dispatch({ id, text, type: 'TOGGLE_EDIT' }), // TODO Trying to get text to be part of action
        onKeyPress: (id, text) => dispatch({ id, text, type: 'TOGGLE_EDIT' }), // TODO Trying to get text to be part of action
        dispatch
    }
}

Tree = connect(mapStateNodesToProps, mapDispatchNodesToProps)(Tree);

nextChildNodeId = 0;
let AddNodeButtonAndTextBox = ({dispatch}) => {
    let input = null;
    
    return (
        React.createElement('div', {}, 
            React.createElement('input', {
                ref: (node) => {
                    input = node;
                }
            }),
            React.createElement('button', {
                onClick: () => {
                    dispatch({
                            type: 'ADD_NODE',
                            text: input.value,
                            id: nextChildNodeId++
                        });
                }
            }, 'add node')
        )
    )
}

AddNodeButtonAndTextBox = connect()(AddNodeButtonAndTextBox);

class TodoAppComponent extends Component {
    render() {
        return (
            React.createElement('div', {},
                React.createElement(Tree),
                React.createElement(AddNodeButtonAndTextBox)
            )
        );
    }
};

const render = () => {
    ReactDOM.render(
        React.createElement(Provider, { store : createStore(todoApp)}, React.createElement(TodoAppComponent)),
        document.getElementById('root')
        );
}

render();
