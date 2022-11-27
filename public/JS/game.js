

const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");

let H = window.innerHeight - 50;
let W = H

cvs.width = W;
cvs.height = H;

//VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
let leftArrow = false;
let rightArrow = false;
const BALL_RADIUS = 10;
let bricks = [];
let GAME_OVER = false;
const MAX_LEVEL = 5;


function playGame(LEVEL, LIFE, SCORE) {
    let SCORE_UNIT = 10 + (LEVEL - 1)*5;


    //DRAW LINE
    ctx.lineWitdth = 3;

    //CREATE PADDLE
    const paddle = {
        x: cvs.width / 2 - PADDLE_WIDTH / 2,
        y: cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        dx: 5
    }
    //DRAW PADDLE
    function drawPaddle() {
        ctx.fillStyle = "#2e3548";
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
        ctx.strokeStyle = "#ffcd05";
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)
    }

    //CONTROL PADDLE
    document.addEventListener("keydown", function (event) {
        if (event.keyCode == 37) {
            leftArrow = true;
        } else if (event.keyCode == 39) {
            rightArrow = true;
        }
    })

    document.addEventListener("keyup", function (event) {
        if (event.keyCode == 37) {
            leftArrow = false;
        } else if (event.keyCode == 39) {
            rightArrow = false;
        }
    })

    //MOVE PADDLE
    function movePaddle() {
        if (rightArrow && paddle.x + paddle.width < cvs.width) {
            paddle.x += paddle.dx;
        } else if (leftArrow && paddle.x > 0) {
            paddle.x -= paddle.dx;
        }
    }


    //CREAT BALL
    const ball = {
        x: cvs.width / 2,
        y: paddle.y - BALL_RADIUS,
        radius: BALL_RADIUS,
        speed: 4,
        dx: 3 * (Math.random() * 2 - 1),
        dy: -3
    }

    // DRAW THE BALL
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.strokeStyle = "#2e3548";
        ctx.stroke();
        ctx.closePath();
    }

    //MOVE BALL
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy
    }

    function ballWallCollision() {
        if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
            WALL_HIT.play();
        }
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }

        if (ball.y + ball.radius > cvs.height) {
            LIFE--;
            $.ajax({
                url: '/updatelife',
                method: 'POST'
            })
            LIFE_LOST.play();
            resetBall();
        }
    }

    function resetBall() {
        ball.x = cvs.width / 2;
        ball.y = paddle.y - BALL_RADIUS;

        ball.dy = -3
    }

    function ballPaddleCollision() {
        if (ball.y > paddle.y && ball.y < paddle.y + paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            PADDLE_HIT.play();
            let collidePoint = ball.x - (paddle.x + paddle.width / 2);
            collidePoint = collidePoint / (paddle.width / 2)
            let angle = collidePoint * (Math.PI / 3) //call angle for speed of ball
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);

        }
    }

    //CREATE BRICK
    const brick = {
        row: 2 + LEVEL - 1,
        column: 11,
        width: W / 15,
        height: 20,
        offSetLeft: W / 45,
        offSetTop: 20,
        marginTop: 40,
        fillColor: '#2e3457',
        strokeColor: '#fff'
    }

    //CREATE LIST BRICKS
    function createBricks() {
        for (let r = 0; r < brick.row; r++) {
            bricks[r] = []
            for (let c = 0; c < brick.column; c++) {
                bricks[r][c] = {
                    x: c * (brick.width + brick.offSetLeft) + brick.offSetLeft,
                    y: r * (brick.height + brick.offSetTop) + brick.offSetTop + brick.marginTop,
                    status: true
                }
            }
        }
    }

    createBricks();

    //DRAW BRICKS
    function drawBricks() {
        for (let r = 0; r < brick.row; r++) {
            for (let c = 0; c < brick.column; c++) {
                if (bricks[r][c].status) {
                    ctx.fillStyle = brick.fillColor;
                    ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)
                    ctx.strokeStyle = brick.strokeColor;
                    ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)
                }
            }
        }
    }

    function ballBrickCollision() {
        for (let r = 0; r < brick.row; r++) {
            for (let c = 0; c < brick.column; c++) {
                if (bricks[r][c].status) {
                    let b = bricks[r][c];
                    if (ball.x + ball.radius > b.x
                        && ball.x - ball.radius < b.x + brick.width
                        && ball.y - ball.radius < b.y + brick.height) {
                        BRICK_HIT.play();
                        b.status = false;
                        ball.dy = - ball.dy;
                        SCORE += SCORE_UNIT;
                    }
                }
            }
        }
    }

    function showGameStarts(text, textX, textY, img, imgX, imgY) {
        ctx.fillStyle = "#FFF"
        ctx.font = "25px Montserrat"
        ctx.fillText(text, textX, textY);
        ctx.drawImage(img, imgX, imgY, 25, 25);
    }


    function levelUp() {
        let isLevelDone = true;
        for (let r = 0; r < brick.row; r++) {
            for (let c = 0; c < brick.column; c++) {
                isLevelDone = isLevelDone && (!bricks[r][c].status);
            }
        }

        if (isLevelDone) {
            WIN.play();
            brick.row++;
            createBricks();
            ball.speed += 0.5 * LEVEL;
            resetBall();
            LEVEL++;

            if (LEVEL >= MAX_LEVEL) {
                GAME_OVER = true;
                recordHistory();
                showYouWin();
            } else {
                $.ajax({
                    url: '/updateLevle',
                    method: 'POST',
                    data: {
                        level: LEVEL,
                        score: SCORE
                    }
                })
            }

        }
    }

    function recordHistory() {
        $.ajax({
            url: '/recordhistory',
            method: 'POST',
            data: {
                level: LEVEL,
                state: LIFE,
                score: SCORE
            }
        })
    }


    function gameOver() {
        if (LIFE <= 0) {
            GAME_OVER = true;
            console.log("A");
            recordHistory();
            showYouLose();
        }
    }

    //DRAW function
    function draw() {
        drawPaddle();
        drawBall();
        drawBricks();
        showGameStarts(SCORE, 35, 25, SCORE_IMG, 5, 5)
        showGameStarts(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5)
        showGameStarts(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5)
    }

    //UPDATE function
    function update() {
        movePaddle();
        moveBall();
        ballWallCollision();
        ballPaddleCollision();
        ballBrickCollision();
        gameOver();
        levelUp();
    }


    function loop() {

        ctx.drawImage(BG_IMG, 0, 0, W, H);

        draw();
        update();
        if (!GAME_OVER) {
            requestAnimationFrame(loop)
        }
    }



    const soundE = document.getElementById('sound');

    soundE.addEventListener("click", audioManager);

    function audioManager() {
        let imgSrc = soundE.getAttribute("src");
        let SOUND_IMG = imgSrc == "./img/SOUND_ON.png" ? "./img/SOUND_OFF.png" : "./img/SOUND_ON.png";
        soundE.setAttribute("src", SOUND_IMG);

        WALL_HIT.muted = WALL_HIT.muted ? false : true;
        PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
        BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
        WIN.muted = WIN.muted ? false : true;
        LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
    }

    //
    const gameover = document.getElementById('gameover');
    const youwon = document.getElementById('youwon');
    const youlose = document.getElementById('youlose');

    function showYouWin() {
        gameover.style.display = "block";
        youwon.style.display = "block";
    }

    function showYouLose() {
        gameover.style.display = "block";
        youlose.style.display = "block";
    }

    loop()
}

BG_IMG.addEventListener("load", (e) => {
    ctx.drawImage(BG_IMG, 0, 0, W, H);
})