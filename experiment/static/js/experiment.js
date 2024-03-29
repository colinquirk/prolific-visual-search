nTrials = 500;
trialsPerBlock = 50;
setSize = 6;

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
    window.ctx.font = "16px Roboto";
    window.ctx.textAlign = "center";
}

function clearCanvas() {
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}

function writeCenterText(text) {
    for (i=0; i<text.length; i++) {
        var offset = (window.canvas.height / 2) - ((text.length - 1) * 25);
        var height = (50 * i) + offset;
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
        'Alternatively, you can use W (up), A (left), S (down), and D (right).',
        'Sometimes the "T" will be blue in order to help you find it.',
        'Press a key regardless of the color of the T.',
        "If you don't respond quickly enough the trial will time out.",
        'Please respond as fast as possible.',
        'Press space to continue.']);
}

function showExamples() {
    var images = [
        window.t_image, window.t_image, window.t_image, window.t_image,
        window.t_blue_image, window.t_blue_image, window.t_blue_image, window.t_blue_image,
        window.l1_image, window.l2_image, window.l1_image, window.l2_image
    ];
    var xs = [45, 195, 345, 495,
              45, 195, 345, 495,
              45, 195, 345, 495];
    var ys = [100, 100, 100, 100,
              200, 200, 200, 200,
              400, 400, 400, 400];
    var rotations = [0, 90, 180, 270,
                     0, 90, 180, 270,
                     0, 180, 90, 270];

    drawImages(images, xs, ys, rotations)

    window.ctx.fillText('Example "T"s', 300, 75)

    window.ctx.fillText('press up/W', 75, 175)
    window.ctx.fillText('press right/D', 225, 175)
    window.ctx.fillText('press down/S', 375, 175)
    window.ctx.fillText('press left/A', 525, 175)

    window.ctx.fillText('press up/W', 75, 275)
    window.ctx.fillText('press right/D', 225, 275)
    window.ctx.fillText('press down/S', 375, 275)
    window.ctx.fillText('press left/A', 525, 275)

    window.ctx.fillText('Example "L"s', 300, 375)

    window.ctx.fillText('ignore', 75, 475)
    window.ctx.fillText('ignore', 225, 475)
    window.ctx.fillText('ignore', 375, 475)
    window.ctx.fillText('ignore', 525, 475)

    window.ctx.fillText('Press space to continue.', 300, 550)
}

function showPractice() {
    window.ctx.fillText('If you saw a trial like this, you should press down/S.', 300, 100)
    
    var images = [window.t_image, window.l1_image, window.l2_image, window.l1_image, window.l2_image, window.l1_image];
    var xs = [144, 322, 252, 473, 285, 101];
    var ys = [402, 132, 231, 321, 321, 111];
    var rotations = [180, 90, 0, 270, 0, 180];
    drawImages(images, xs, ys, rotations)

    window.ctx.fillText('Press space to continue.', 300, 500)

    redCircle = setTimeout(function() {
        window.ctx.arc(174, 432, 50, 0, 2 * Math.PI);
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

var instruct_states = [
    welcome,
    basicInstruct,
    responseInstruct,
    showExamples,
    showPractice,
    startExperimentScreen
];

function instructions() {
    var state = 0;
    instruct_states[state]();

    $(document).keypress(function(e){
        if (e.keyCode == 32) {
            e.preventDefault();
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
    var possible_rotations = [0, 90, 180, 270];
    var possible_targets = [window.t_image, window.t_blue_image];
    var possible_distractors = [window.l1_image, window.l2_image];

    var images = [];
    var rotations = [];

    for (i=0; i < setSize; i++) {
        if (i == 0) {
            var target = possible_targets[Math.floor(Math.random() * possible_targets.length)];
            images.push(target);
        } else {
            var distractor = possible_distractors[Math.floor(Math.random() * possible_distractors.length)];
            images.push(distractor);
        }
        var rotation = possible_rotations[Math.floor(Math.random() * possible_rotations.length)];
        rotations.push(rotation);
    }

    return [images, rotations];
}

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function checkDistance(x1, y1, x2, y2) {
    return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
}

function generateLocations() {
    var counter = 0;
    var xs = [getRandInt(100, 500) - 30];
    var ys = [getRandInt(100, 500) - 30];
    var locations = [[xs[0], ys[0]]];
    while (locations.length < setSize) {
        counter += 1;
        if (counter >= 50) {
            locations = [[xs[0], ys[0]]];
            xs = [xs[0]];
            ys = [ys[0]];
            counter = 0;
        }
        var newx = getRandInt(100, 500) - 30;
        var newy = getRandInt(100, 500) - 30;
        var badLoc = false
        for (i=0; i<locations.length; i++) {
            if (checkDistance(locations[i][0], locations[i][1], newx, newy) < 100) {
                badLoc = true
                break
            }
        }
        if (!badLoc) {
            locations.push([newx, newy])
            xs.push(newx);
            ys.push(newy);
        }
    }
    return [xs, ys]
}

function saveData(trial) {
    trial.distractor_xs = JSON.stringify(trial.distractor_xs);
    trial.distractor_ys = JSON.stringify(trial.distractor_ys);
    trial.distractor_rotations = JSON.stringify(trial.distractor_rotations);
    trial.distractor_type = JSON.stringify(trial.distractor_type);
    $.post('save-data', trial)
}

function getCode(key) {
    if ([38, 87].includes(key)) {
        return 'up';
    } else if ([37, 65].includes(key)) {
        return 'left';
    } else if ([39, 68].includes(key)) {
        return 'right';
    } else {
        return 'down';
    }
}

function getCRESP(rotation) {
    if (rotation == 0) {
        return 'up';
    } else if (rotation == 270) {
        return 'left';
    } else if (rotation == 90) {
        return 'right';
    } else {
        return 'down';
    }
}

function doNextState() {
    window.trial_num += 1;
    if (window.trial_num >= nTrials) {
        endExperiment();
    } else if (window.trial_num % trialsPerBlock == 0) {
        displayBreak();
    } else {
        displayTrial();
    }
}

function getResponse(trial) {
    var rtStart = new Date();
    var trialTimeout = setTimeout(function() {
        clearCanvas();
        $(document).off();
        trial.response = "";
        trial.accuracy = false;
        trial.reaction_time = "";
        saveData(trial);
        progress();
        doNextState();
    }, 3000)

    $(document).keydown(function(e) {
        if ([37, 38, 39, 40, 65, 68, 83, 87].includes(e.keyCode)) {
            var rtEnd = new Date()
            e.preventDefault();
            $(document).off();
            clearTimeout(trialTimeout);
            clearCanvas();
            trial.response = getCode(e.keyCode);
            trial.accuracy = trial.response == trial.correct_response;
            trial.reaction_time = rtEnd - rtStart;
            saveData(trial);
            progress();
            doNextState();
        }
    }
)}

function displayBreak() {
    writeCenterText([
        'Take a short break if you would like to.',
        'Press space to continue.'
    ])
    $(document).keypress(function(e){
        if (e.keyCode == 32) {
            e.preventDefault();
            $(document).off();
            clearCanvas();
            displayTrial();
        }
    })
}

function displayTrial() {
    var locations = generateLocations();
    var stimuli = generateStimuli();

    var trial = {};
    trial.trial_num = window.trial_num;
    trial.timestamp = Date.now();
    trial.target_color = (stimuli[0][0] == window.t_blue_image) ? "blue" : "black";
    trial.target_loc_x = locations[0][0];
    trial.target_loc_y = locations[1][0];
    trial.target_rotation = stimuli[1][0];
    trial.distractor_xs = locations[0].slice(1);
    trial.distractor_ys = locations[1].slice(1);
    trial.distractor_rotations = stimuli[1].slice(1);
    trial.distractor_type = [];
    trial.correct_response = getCRESP(trial['target_rotation']);

    for (i=1; i<6; i++) {
        trial.distractor_type.push((stimuli[0][i] == window.l1_image) ? "L1" : "L2")
    }

    setTimeout(function() {
        drawImages(stimuli[0], locations[0], locations[1], stimuli[1]);
        getResponse(trial);
    }, 1500);
}

function startExperiment() {
    window.trial_num = 0;
    displayTrial();
}

function endExperiment() {
    clearCanvas();
    writeCenterText(['Saving the data, please wait a moment...'])
    setInterval(function() {
        window.location.href = "https://app.prolific.co/submissions/complete?cc=517DF314";
    }, 2000);
}

function progress() {
    var newWidth = Math.max(5, (window.trial_num / nTrials) * 100)
    $("#progressBar").css({'width': newWidth})
}

function main() {
    setup();
    instructions();
}

$(window).on('load', main);
