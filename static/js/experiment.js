function main() {
    var canvas = document.getElementById("experiment");
    var ctx = canvas.getContext("2d");
    
    ctx.font = "20px Roboto";
    ctx.fillText("Test", 100, 100)
}

$(document).ready(main);
