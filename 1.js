 const counter = (state = 0, action) => {
            switch (action.type) {
                case 'INCREMENT':
                    return state + 1;
                case 'DECREMENT':
                    return state - 1;
                default:
                    return state;
            };
        }

const CounterComponent = React.createClass({
    render: function () {
        return React.createElement('div', {className: 'nothing'},
            React.createElement('h1', {className: 'nothing'}, this.props.value),
            React.createElement('button', { onClick: this.props.onIncrement }, '+'),
            React.createElement('button', { onClick: this.props.onDecrement }, '-')
            
        );
    }
});

const { createStore } = Redux;
const store = createStore(counter);

const render = () => {
    ReactDOM.render(
        React.createElement(CounterComponent,
            {
                value: store.getState(),
                onIncrement: () => {
                    store.dispatch({ type: 'INCREMENT'})
                },
                onDecrement: () => {
                    store.dispatch({ type: 'DECREMENT'})
                }
            }),
        document.getElementById('root')
    )
};

window.addEventListener('DOMContentLoaded', () => {
    store.subscribe(render);
    
    render();
});
