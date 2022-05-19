let field = [];
const WHITE = "rgb(255, 255, 255)";
const LENGTH = 20;
const HEIGHT = 20;
let interval;

$(document).ready(() => {
    fill_grid();
    $(".grid-cell").on('click', create_or_delete_cell);
    $(".start").on('click', start_game);
    $(".stop").on('click', stop_game);
});

function executeInterval(func) {
    interval = setInterval(func, 300);
}

function stop_game() {
    clearInterval(interval)
}

function deep_copy(array) {
    return JSON.parse(JSON.stringify(array));
}

function start_game() {

    function sum_of_living_cells(array, i, j) {
        const empty_neighbour = false;
        const left_center = j > 0 ? array[i][j - 1] : empty_neighbour;
        const left_top = j > 0 && i > 0 ? array[i - 1][j - 1] : empty_neighbour;
        const left_bottom = j > 0 && i < array.length - 1 ? array[i + 1][j - 1] : empty_neighbour;
        const center_bottom = i > 0 ? array[i - 1][j] : empty_neighbour;
        const center_top = i < array.length - 1 ? array[i + 1][j] : empty_neighbour;
        const right_center = j < array.length - 1 ? array[i][j + 1] : empty_neighbour;
        const right_top = i > 0 && j < array.length - 1 ? array[i - 1][j + 1] : empty_neighbour;
        const right_bottom = i < array.length - 1 && j < array.length - 1 ? array[i + 1][j + 1] : empty_neighbour;
        return [left_center, left_top, left_bottom,
            center_bottom, center_top, right_center, right_top, right_bottom]
            .filter(cell => cell)
            .map(cell => cell ? +1 : -1)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    }

    function create_cell(i, j) {
        $(`#${i}-${j}`).css("background-color", "black");
        field[i][j] = true;
    }

    function kill_cell(i, j) {
        $(`#${i}-${j}`).css("background-color", "white");
        field[i][j] = false;
    }

    executeInterval(() => {
            let temp = deep_copy(field);
            for (let i = 0; i < HEIGHT; i++) {
                for (let j = 0; j < LENGTH; j++) {
                    let neighbor_count = sum_of_living_cells(temp, i, j);
                    if (!temp[i][j] && neighbor_count === 3) {
                        create_cell(i, j);
                    }
                    if (temp[i][j] && neighbor_count > 3) {
                        kill_cell(i, j)
                    }
                    if (temp[i][j] && neighbor_count < 2) {
                        kill_cell(i, j)
                    }
                }
            }
        }
    )
}

function create_or_delete_cell() {
    let clicked_cell = $(this);
    let bg = clicked_cell.css("background-color");
    let i = clicked_cell.attr("id").split("-")[0];
    let j = clicked_cell.attr("id").split("-")[1];
    if (bg === WHITE) {
        clicked_cell.css("background-color", "black");
        field[i][j] = true;
        return;
    }
    clicked_cell.css("background-color", "white");
    field[i][j] = false;
}


function fill_grid() {
    let grid_cell = $("<div class='grid-cell'></div>");
    for (let i = 0; i < HEIGHT; i++) {
        field.push([]);
        for (let j = 0; j < LENGTH; j++) {
            let temp = grid_cell.clone();
            temp.attr("id", `${i}-${j}`);
            $(".grid").append(temp);
            field[i].push(false);
        }
    }

}
