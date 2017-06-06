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
        case 'START_EDIT':
            return state.map(n => {
                return Object.assign({}, n, {editing: n.id === action.id});
            });
        case 'STOP_EDIT':
            return state.map(n => {
                // only update the text if its the node that we are editing.
                let text = (n.id === action.id) ? action.text : n.text;
                return Object.assign({}, n, {editing: false, text: text});
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
                            let element = (React.createElement('input', {
                                ref: (input) => {
                                    this.textInput = input;
                                },
                                key: node.id,
                                defaultValue: node.text,
                                onKeyPress: (e) => {
                                    if (e.charCode == 13) {
                                        dispatch({ id: node.id, text: e.target.value, type: 'STOP_EDIT' })
                                    }
                                },
                            }))
                            return element;
                        }
                        return (React.createElement('li', { 
                            key: node.id,
                            onClick: (e) => {
                                dispatch({ id: node.id, type: 'START_EDIT' }) }
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
    return { dispatch }
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
                },
                 onKeyPress: (e) => {
                    if (e.charCode == 13 && input.value) {
                         dispatch({
                            type: 'ADD_NODE',
                            text: input.value,
                            id: nextChildNodeId++
                        });
                        input.value = '';
                    }
                }
            }),
            React.createElement('button', {
                //disabled: input && !!input.value, // TODO fix this!!
                onClick: () => {
                    if (input.value) {
                         dispatch({
                            type: 'ADD_NODE',
                            text: input.value,
                            id: nextChildNodeId++
                        });
                        input.value = '';
                    }
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
