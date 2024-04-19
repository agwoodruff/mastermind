const colorArray = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(0, 0, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 255)", "rgb(255, 0, 255)", "rgb(98, 18, 46)"];
let gameCode = [];
let allowDuplicates = $("#allowDuplicates").is(':checked');
let currentRow = 1;
let codeLength = ($("#length")[0].value == "") ? 4 : $("#length")[0].value;

$("#allowDuplicates").change( function() {
    if ($(this).is(':checked')) {
        allowDuplicates = true;
    } else {
        allowDuplicates = false;
    }
});

$("#length").on("input", function() {
    codeLength = $(this).val();
 });
 
startNewGame();

// display color picker div when div is clicked
$(document).on('click', '.color-block', function(event) {
    let index = $(this).index();
    let row = $(this).parent().index();

    if (row == currentRow) {
        $(".color-picker").css("display", "none");
        $(".color-picker")[index + (codeLength * (row - 1))].style.display = "flex";
    }
});

$(document).on('click', '.color-block-picker', function(event) {
    // stop from firing onclick event for color-block div
    event.stopPropagation();

    let color = this.style.backgroundColor;
    //hide color picker div
    $(this).parent()[0].style.display = "none";
    // change color block to chosen color
    $(this).parent().parent()[0].style.backgroundColor = color;

});

function startNewGame() {
    gameCode = [];
    currentRow = 1;
    $("#result").html(" ");
    $(".color-block-answer").css("background-color", "rgb(69, 54, 39)");
    $(".color-block").css("background-color", "gray");
    $("#result").css("display", "none");

    $(".blocks").not(':first').remove();

    let htmlblocks = "";

    for (let i = 0; i < codeLength; i++) {
        htmlblocks += '<div class="color-block"><div class="color-picker">';
        for (let color in colorArray) {
            htmlblocks += `<div style="background-color: ${colorArray[color]}" class="color-block-picker"></div>`;
        }
        htmlblocks += '</div></div>';
    }

    htmlblocks += '<div id="answers">';
    for (let i = 0; i < codeLength; i++) { 
        htmlblocks += '<div class="color-block-answer"></div>';
    }
    htmlblocks += '</div>';

    $(".blocks").html(htmlblocks);
    $(".blocks").removeClass("current-row");

    for (let i = 0; i < 9; i++) {
        $($(".blocks")[0]).after($($(".blocks")[0]).clone());
    }

    // indicate current row by changing background color
    $($(".blocks")[currentRow - 1]).addClass("current-row");

    generateCode();
}

// check if guess submitted by user is correct
function checkAnswer() {
    if (currentRow <= 10) {
        let colorGuess = [];
        let correctCount = 0;
    
        for(let i = 0; i < codeLength; i++) {
            // get color guess for specific block
            let currentColor = getComputedStyle($(".color-block")[i + (codeLength * (currentRow - 1))]).backgroundColor;
            // if its the correct color in the correct position
            if (currentColor == gameCode[i]) {
                colorGuess.push("rgb(0, 255, 0");
                correctCount += 1;
            } 
            //if its the correct color in the wrong position 
            else if (gameCode.includes(currentColor)) {
                colorGuess.push("rgb(200, 200, 200");
            }
            // if its the wrong color
            else {
                colorGuess.push("rgb(69, 54, 39)");
            }
        }
    
        // sort by green (correct), then light gray (wrong position), then dark gray (incorrect)
        colorGuess.sort();

        // change indicators to show user if their guess is correct
        $($(".blocks")[currentRow - 1]).find(".color-block-answer").each(function(index) {
            this.style.backgroundColor = colorGuess[index];
        });
    
        currentRow += 1;

        // indicate current row by changing background color
        $($(".blocks")[currentRow - 2]).removeClass("current-row");
        
        // close color picker
        $(".color-picker").css("display", "none");
        
        if (correctCount == codeLength) {
            gameResult(true);
            currentRow = 11;
        } else if (currentRow > 10) {
            gameResult(false);
        } else {
            $($(".blocks")[currentRow - 1]).addClass("current-row");
        }
    }
}

function gameResult(result) {
    let correctHTML = '<div class="blocks-correct">';
    for (let i = 0; i < codeLength; i++) {
        correctHTML += `<div class="color-block" style="background-color:${gameCode[i]}"></div>`;
    }
    correctHTML += '</div></div>';
    
    if (result) {
        $("#result").html("<h3>You won!</h3>" + "<h4>Correct Answer:</h4>" + correctHTML);
    } else {
        $("#result").html("<h3>You lost!</h3>" + "<h4>Correct Answer:</h4>" + correctHTML);
    }

    $("#result").css("display", "block");
}

function generateCode() {
    while (gameCode.length < codeLength) {
        let num = Math.floor(Math.random() * 8);

        // check if color is already included in code
        if (allowDuplicates) {
            gameCode.push(colorArray[num]);
        } else {
            if (!gameCode.includes(colorArray[num])) {
                gameCode.push(colorArray[num]);
            }
        }
    }
    //console.log(gameCode);
}