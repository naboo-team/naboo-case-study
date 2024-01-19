export const move = (array: any[], dir: 'up' | 'down', index: number) => {
    const r = [...array];
    if (dir === 'up') {
        if (index === 0) return r;
        r.splice(index - 1, 0, r.splice(index, 1)[0]);
    } else {
        if (index === array.length - 1) return r;
        r.splice(index + 1, 0, r.splice(index, 1)[0]);
    }
    return r;
};