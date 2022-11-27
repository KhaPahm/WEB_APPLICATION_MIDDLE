//CHECK USER HAVE BEEN LOGED IN 
$.ajax({
    url: '/checkLogin',
    method: 'GET',
    success: (data) => {
        console.log(data);
        if (data.loggedIn == false) {
            // console.log('hehehehe');
            $('#login-form').show();
        } else {
            // $("#black-layer").hide();    
            $("#login-form").hide();
            $('#menu').show(1200)
            $('.user').text(data.data.username)
            if (data.data.level < 1) {
                $('#continue').prop('disabled', true);
            }
            // play();
        }
    }
})

//SIGN UP
function checkSignIn() {
    if ($('#user').val() == "" || $('#password').val() == "" || $('#confim-password').val() == "") {
        alert("You missed some information! Please fill all informaion to sign up!");
        if ($('#user').val() == "") {
            $('#user').addClass('null-input');
        }

        if ($('#password').val() == "") {
            $('#password').addClass('null-input');
        }

        if ($('#confim-password').val() == "") {
            $('#confim-password').addClass('null-input');
        }
        return false;
    }

    if ($('#password').val() != $('#confim-password').val()) {
        alert("Your confirm password is wrong! Please entry again!");
        $('#confim-password').addClass('null-input');
        return false;
    }

    return true
}

//CHECK CONFIRM PASSWORD HAVE TO MATCH WITH PASSWORD
function checkPassword() {
    if ($('#password').val() != $('#confim-password').val()) {
        $('#confim-password').addClass('null-input');
    } else {
        $('#confim-password').removeClass('null-input');

    }
}

//CALL FUNTCTION CHECK PASSWORD WHEN USER ENTRY TEXT FROM KEYBOARD
$('#confim-password').keyup(checkPassword)

//CLICK SIGN UP BUTTON
$('#btn-signup').click(() => {
    // console.log();
    if (checkSignIn()) {
        let user = $('#user').val();
        let pwd = $('#password').val();
        $.ajax({
            url: '/signup',
            method: "POST",
            data: $('#form-signup').serialize(),
            dataType: "JSON",
            success: (data) => {
                if (data.status == false) {
                    alert('Username have been use by another one! Please change your username!');
                    $('#user').addClass('null-input');
                } else {
                    alert('Sign up done!');
                }
            }
        })
    }
})

//ANIMATION TO BACK SIGNIN PAGE
$('#back-signup').click(() => {
    $('#signup-form').hide(1200);
    $('#login-form').animate({
        top: '0px',
        opacity: '1'
    }, 1200)
    $('#form-signup').trigger("reset");
    $('#confim-password').removeClass('null-input');
    $('#password').removeClass('null-input');
    $('#user').removeClass('null-input');
})

//ANIMATION TRANS TO SIGN UP PAGE FROM SIGN IN PAGE
$('#signUp').click(() => {
    $('#login-form').animate({
        top: '100px',
        opacity: '0'
    }, 1200)

    setTimeout(() => {
        $('#signup-form').show(1200)
    }, 400);
})

//FORGOT PASSWORD ANIMATION
$('#forgotPass').click(() => {
    $('#login-form').animate({
        top: '100px',
        opacity: '0'
    }, 1200)

    setTimeout(() => {
        $('#forgot').show(1200)
    }, 400);
})

//ANIMATION BACK TO SIGN IN PAGE FROM FORGOT PASSWORD
$('#back-forgot').click(() => {
    $('#forgot').hide(1200);
    $('#login-form').animate({
        top: '0px',
        opacity: '1'
    }, 1200)
    $('#forgot').trigger("reset");
    $('#confim-passwordForgot').removeClass('null-input');
    $('#passwordForgot').removeClass('null-input');
    $('#userForgot').removeClass('null-input');
})

//FORGOT PASSWORD CHECK
function checkForgot() {
    if ($('#userForgot').val() == "" || $('#passwordForgot').val() == "" || $('#confim-passwordForgot').val() == "") {
        alert("You missed some information! Please fill all informaion to sign up!");
        if ($('#userForgot').val() == "") {
            $('#userForgot').addClass('null-input');
        }

        if ($('#passwordForgot').val() == "") {
            $('#passwordForgot').addClass('null-input');
        }

        if ($('#confim-passwordForgot').val() == "") {
            $('#confim-passwordForgot').addClass('null-input');
        }
        return false;
    }

    if ($('#passwordForgot').val() != $('#confim-passwordForgot').val()) {
        alert("Your confirm password is wrong! Please entry again!");
        $('#confim-passwordForgot').addClass('null-input');
        return false;
    }

    return true
}

//CHECK CONFIRM PASSWORD HAVE TO MATCH WITH PASSWORD
function checkForgotPassword() {
    if ($('#passwordForgot').val() != $('#confim-passwordForgot').val()) {
        $('#confim-passwordForgot').addClass('null-input');
    } else {
        $('#confim-passwordForgot').removeClass('null-input');

    }
}

$('#confim-passwordForgot').keyup(checkForgotPassword)

$('#btn-passwordForgot').click(() => {
    if (checkForgot) {
        $.ajax({
            url: '/forgotPass',
            method: 'POST',
            data: $('#form-forgot').serialize(),
            dataType: 'JSON',
            success: (data) => {
                if(data.status) {
                    alert("Your account have changed pass word! Sign in again!");
                    location.reload();
                } else {
                    alert("Couldn't find your username account! Please try again!");
                    $('#userForgot').addClass('null-input');
                }
            }
        })
    }
})

//SIGN IN BUTTON CLICK
$('#username-si').keyup(() => {
    $('#username-si').removeClass('null-input')
})

$('#password-si').keyup(() => {
    $('#password-si').removeClass('null-input')
})

$('#btn-signin').click(() => {
    if ($('#username-si').val() == "" || $('#password-si').val() == "") {
        alert("You missed some information! Please fill all informaion to sign up!");
        if ($('#username-si').val() == "") {
            $('#username-si').addClass('null-input');
        }

        if ($('#password-si').val() == "") {
            $('#password-si').addClass('null-input');
        }
    } else {
        $.ajax({
            url: '/signin',
            method: 'POST',
            data: $('#form-signin').serialize(),
            dataType: "JSON",
            success: (data) => {
                if (!data.status) {
                    alert("WRONG USERNAME OR PASSWORD!")
                } else {
                    $("#login-form").hide(1200);
                    setTimeout(() => {
                        $("#menu").show(1200);
                    }, 400)
                    $('.user').text(data.data.username)
                    if (data.data.level < 1) {
                        $('#continue').prop('disabled', true);
                    }
                }
            }
        })
    }
})

$('#logout-confirm').click(() => {
    $.ajax({
        url: '/logout',
        method: 'GET',
        success: (data) => {
            if (data.status) {
                $("#menu").hide(1200);
                setTimeout(() => {
                    $("#login-form").show(1200);
                }, 400)
            }
        }
    })
})

function newGame_reload() {
    $.ajax({
        url: '/newGame',
        method: 'POST',
        success: () => {
            $('#menu').hide(1200);
            setTimeout(() => {
                $('#black-layer').hide(500)
                GAME_OVER = false;
                playGame(1, 1, 0);
            }, 400)
        }
    })
}

$('#newgame').click(() => {
    newGame_reload();
})

$('#changepassword').click(() => {
    $('#menu').animate({
        top: '100px',
        opacity: '0'
    }, 1200)

    setTimeout(() => {
        $('#changePass').show(1200)
    }, 400);
})

//CHECK CONFIRM PASSWORD HAVE TO MATCH WITH PASSWORD
function checkPasswordChange() {
    if ($('#passwordChange').val() != $('#confim-passwordChange').val()) {
        $('#confim-passwordChange').addClass('null-input');
    } else {
        $('#confim-passwordChange').removeClass('null-input');

    }
}

//CALL FUNTCTION CHECK PASSWORD WHEN USER ENTRY TEXT FROM KEYBOARD
$('#confim-passwordChange').keyup(checkPasswordChange)

$('#back-menu').click(() => {
    $('#changePass').hide(1200);
    $('#menu').animate({
        top: '0px',
        opacity: '1'
    }, 1200)
    $('#form-changepass').trigger("reset");
    $('#confim-passwordChange').removeClass('null-input');
    $('#passwordChange').removeClass('null-input');
})

function checkChangePass() {
    if ($('#oldpass').val() == "" || $('#passwordChange').val() == "" || $('#confim-passwordChange').val() == "") {
        alert("You missed some information! Please fill all informaion to sign up!");
        if ($('#oldpass').val() == "") {
            $('#oldpass').addClass('null-input');
        }

        if ($('#passwordChange').val() == "") {
            $('#passwordChange').addClass('null-input');
        }

        if ($('#confim-passwordChange').val() == "") {
            $('#confim-passwordChange').addClass('null-input');
        }
        return false;
    }

    if ($('#oldpass').val() == $('#passwordChange').val()) {
        alert("Your new password must be different with old password! Please entry again!");
        $('#passwordChange').addClass('null-input')
        return false;
    }

    if ($('#passwordChange').val() != $('#confim-passwordChange').val()) {
        alert("Your confirm password is wrong! Please entry again!");
        $('#confim-passwordChange').addClass('null-input');
        return false;
    }

    return true
}


$('#btn-changePass').click(() => {
    if (checkChangePass()) {
        $.ajax({
            url: '/changePass',
            method: 'POST',
            data: $('#form-changepass').serialize(),
            dataType: 'JSON',
            success: (data) => {
                if (data.status) {
                    alert("Your password has changed!");
                    location.reload();
                } else {
                    alert("Your old password isn't correct!");
                    $('#oldpass').addClass('null-input')
                }
            }
        })
    }
})

$('#restart').click(() => {
    $('#continue').prop('disabled', true);
    $('#gameover').hide();
    $('#black-layer').show();
    newGame_reload();
})

$('#continue').click(() => {
    $.ajax({
        url: '/getstate',
        method: 'GET',
        success: (data) => {
            if (data.status) {
                $('#menu').hide(1200);
                setTimeout(() => {
                    $('#black-layer').hide(500)
                    GAME_OVER = false;
                    playGame(data.level, data.life, data.score);
                }, 400)
            }
        }
    })
})

$('#showmenu').click(() => {
    $('#continue').prop('disabled', true);
    $('#gameover').hide();
    $('#black-layer').show();
    $('#menu').show(1000)
})


