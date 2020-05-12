nTrials = 10;
trialsPerBlock = 5;

function setup() {
    window.t_image = new Image(60, 60);
    window.t_image.src = '/static/img/T.png'
    window.t_blue_image = new Image(60, 60);
    window.t_blue_image.src = '/static/img/T_blue.png'
    window.l1_image = new Image(60, 60);
    window.l1_image.src = '/static/img/L1.png'
    window.l2_image = new Image(60, 60);
    window.l2_image.src = '/static/img/L2.png'

    window.canvas = document.getElementById("experiment");
    window.ctx = canvas.getContext("2d");
    window.ctx.font = "20px Roboto";
    window.ctx.textAlign = "center";
}

function clearCanvas() {
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}

function writeCenterText(text) {
    for (i=0; i<text.length; i++) {
        offset = (window.canvas.height / 2) - ((text.length - 1) * 50);
        height = (100 * i) + offset;
        window.ctx.fillText(text[i], window.canvas.width / 2, height);
    }
}

function drawRotatedImage(image, x, y, rotation) {
    window.ctx.save();
    window.ctx.translate(x+30, y+30);
    window.ctx.rotate(rotation * Math.PI / 180);
    window.ctx.drawImage(image, -30, -30, 60, 60);
    window.ctx.restore();
}

function drawImages(images, xs, ys, rotations) {
    for (i=0; i<images.length; i++) {
        drawRotatedImage(images[i], xs[i], ys[i], rotations[i]);
    }
}

function welcome() {
    writeCenterText([
        'Welcome to the experiment!',
        'Press the space bar to begin.']);
}

function basicInstruct() {
    writeCenterText([
        'In this experiment you will be searching for "T"s.',
        'On each trial, multiple items will appear.',
        'One will be a "T" and the others will be offset "L"s.',
        'The "T" can appear in any orientation.',
        'Press space to continue.']);
}

function responseInstruct() {
    writeCenterText([
        'Once you find the "T" press the arrow key associated with the top of the "T."',
        'For example, if the "T" looks normal, you would press the up arrow key.',
        'If the top of the "T" is pointed to the left, you would press the left arrow key.',
        'Sometimes the "T" will be blue in order to help you find it.',
        'Press space to continue.']);
}

function showExamples() {
    images = [
        window.t_image, window.t_image, window.t_image, window.t_image,
        window.t_blue_image, window.t_blue_image, window.t_blue_image, window.t_blue_image,
        window.l1_image, window.l2_image, window.l1_image, window.l2_image
    ];
    xs = [75, 275, 475, 675,
          75, 275, 475, 675,
          75, 275, 475, 675];
    ys = [150, 150, 150, 150,
          325, 325, 325, 325,
          550, 550, 550, 550];
    rotations = [0, 90, 180, 270,
                 0, 90, 180, 270,
                 0, 180, 90, 270];

    drawImages(images, xs, ys, rotations)

    window.ctx.fillText('Example "T"s', 400, 100)

    window.ctx.fillText('press up', 100, 235)
    window.ctx.fillText('press right', 300, 235)
    window.ctx.fillText('press down', 500, 235)
    window.ctx.fillText('press left', 700, 235)

    window.ctx.fillText('press up', 100, 415)
    window.ctx.fillText('press right', 300, 415)
    window.ctx.fillText('press down', 500, 415)
    window.ctx.fillText('press left', 700, 415)

    window.ctx.fillText('Example "L"s', 400, 500)

    window.ctx.fillText('ignore', 100, 635)
    window.ctx.fillText('ignore', 300, 635)
    window.ctx.fillText('ignore', 500, 635)
    window.ctx.fillText('ignore', 700, 635)

    window.ctx.fillText('Press space to continue.', 400, 725)
}

function showPractice() {
    window.ctx.fillText('If you saw a trial like this, you should press down.', 400, 100)
    
    images = [window.t_image, window.l1_image, window.l2_image, window.l1_image, window.l2_image, window.l1_image];
    xs = [133, 355, 460, 204, 605, 515];
    ys = [430, 520, 390, 245, 220, 555];
    rotations = [180, 90, 0, 270, 0, 180];
    drawImages(images, xs, ys, rotations)

    window.ctx.fillText('Press space to continue.', 400, 700)

    redCircle = setTimeout(function() {
        window.ctx.arc(163, 460, 50, 0, 2 * Math.PI);
        window.ctx.strokeStyle = '#FF0000';
        window.ctx.lineWidth = 5;
        window.ctx.stroke();
    }, 2000);
}

function startExperimentScreen() {
    clearTimeout(redCircle);
    writeCenterText([
        'Press space to start the experiment or refresh to see the instructions again.']);
}

instruct_states = [
    welcome,
    basicInstruct,
    responseInstruct,
    showExamples,
    showPractice,
    startExperimentScreen
]

function instructions() {
    state = 0;
    instruct_states[state]();

    $(document).keypress(function(e){
        if (e.keyCode == 32) {
            state += 1;
            if (state >= instruct_states.length) {
                clearCanvas();
                $(document).off();
                startExperiment();
            } else {
                clearCanvas();
                instruct_states[state]();
            }
        }
    })
}

function generateStimuli() {
    images = [window.t_image, window.l1_image, window.l2_image, window.l1_image, window.l2_image, window.l1_image];
    rotations = [180, 90, 0, 270, 0, 180];
    return [images, rotations];
}

function generateLocations() {
    xs = [133, 355, 460, 204, 605, 515];
    ys = [430, 520, 390, 245, 220, 555];
    return [xs, ys];
}

function getResponse() {
    setTimeout(function() {
        window.trialNum += 1
        if (window.trialNum >= nTrials) {
            endExperiment();
        } else {
            displayTrial();
        }
    }, 1500);
}

function displayBreak() {
    
}

function displayTrial() {
    clearCanvas();
    locations = generateLocations();
    stimuli = generateStimuli();
    setTimeout(function() {
        drawImages(stimuli[0], locations[0], locations[1], stimuli[1]);
        getResponse();
    }, 1500);
}

function startExperiment() {
    window.trialNum = 0;
    displayTrial();
}

function endExperiment() {
    clearCanvas();
}

function main() {
    setup();
    instructions();
}

$(window).on('load', main);
