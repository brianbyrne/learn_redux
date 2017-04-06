const addCounter = (list) => {
    console.log(...list);
    return [...list, 0];
}

const removeCounter = (list, index) => {
  let newList = [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];

  return newList;
};

const incrementCounter = (list, index) => {
    let newList = [
        ...list.slice(0, index),
        list[index] + 1,
        ...list.slice(index, list.length)
    ];

    return newList;
}

const testIncrementCounter = () => {
    const listBefore = [2,3,4];
    const listAfter = [2,3,5];

    deepFreeze(listBefore);

    expect(
        incrementCounter(listBefore, 2)
    ).toEqual(listAfter);
}

const testAddCounter = () => {
    const listBefore = [];
    const listAfter = [0];

    deepFreeze(listBefore);

    expect(
        addCounter(listBefore)
    ).toEqual(listAfter);
}

const testRemoveCounter = () => {
    const listBefore = [0,10, 20];
    const listAfter = [0,20];

    deepFreeze(listBefore);

    expect(
        removeCounter(listBefore, 1)
    ).toEqual(listAfter)
}

testRemoveCounter();