const filled = [];

const objArray = [{x1: 1, y1: 1, x2: 4, y2: 3}, {x1: 5, y1: 5, x2: 6, y2: 6}]

const range = (start, stop, step = 1) => Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
function spawnNewObject(obj) {
    let x = range(obj.x1, obj.x2, 1)
    let y = range(obj.y1, obj.y2, 1)
    for (let xi of x){
        for (let yi of y) {
            if (filled.some(elem => elem.x === xi && elem.y === yi)) {
                return false
            }
        }
    }
    return true
}
function init() {
    for (let obj of objArray){
        let x = range(obj.x1, obj.x2, 1)
        let y = range(obj.y1, obj.y2, 1)
        for (let xi of x){
            for (let yi of y) {
                filled.push({x: xi, y: yi});
            }
        }
    }
    console.log(filled);
    if (spawnNewObject({x1: 2, y1: 2, x2: 5, y2: 5})){
        console.log('obj {x1: 2, y1: 2, x2: 5, y2: 5} can be spawned');
    } else {
        console.log('obj {x1: 2, y1: 2, x2: 5, y2: 5} can not be spawned');
    }
    if (spawnNewObject({x1: 10, y1: 10, x2: 11, y2: 11})){
        console.log('obj {x1: 2, y1: 2, x2: 5, y2: 5} can be spawned');
    } else {
        console.log('obj {x1: 2, y1: 2, x2: 5, y2: 5} can not be spawned');
    }
    if (spawnNewObject({x1: 6, y1: 6, x2: 7, y2: 7})){
        console.log('obj {x1: 6, y1: 6, x2: 7, y2: 7} can be spawned');
    } else {
        console.log('obj {x1: 6, y1: 6, x2: 7, y2: 7} can not be spawned');
    }
}
init()


