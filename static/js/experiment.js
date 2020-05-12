function setup() {
    window.canvas = document.getElementById("experiment");
    window.ctx = canvas.getContext("2d");
    window.ctx.font = "24px Roboto";
    window.ctx.textAlign = "center";
}

function clearCanvas() {
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}

function writeCenterText(text) {
    ctx.fillText(text, window.canvas.width / 2, window.canvas.height / 2);
}

function welcome() {
    writeCenterText('Welcome to the experiment!\nPress the space bar to begin.');
}

function instructText() {
    writeCenterText('You are searching for Ts');
}

function startExperiment() {
    writeCenterText('Press space to start the experiment.');
}

instruct_states = [
    welcome,
    instructText,
    startExperiment
]

function instructions() {
    state = 0;
    instruct_states[state]();

    $(document).keypress(function(e){
        console.log('space')
        if (e.keyCode == 32) {
            state += 1;
            if (state >= instruct_states.length) {
                clearCanvas();
                $(document).off();
            } else {
                clearCanvas();
                instruct_states[state]();
            }
        }
    })
}

function main() {
    setup();
    instructions();
}

$(window).on('load', main);
