const toggleTodo = (todo) => {
    return Object.assign({}, todo, { completed: true });
}

const _testToggleTodo = () => {
    const todoBefore = {
        id: 0,
        text: 'Learn redux',
        completed: false
    };

    const todoAfter = {
        id: 0,
        text: 'Learn redux',
        completed: true
    };

    deepFreeze(todoBefore);

    expect(toggleTodo(todoBefore)).toEqual(todoAfter);
}

_testToggleTodo();


