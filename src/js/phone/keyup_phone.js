const muteBTN = document.getElementById("button-mute");
const incomingMuteBTN = document.getElementById("button-mute-incoming");
let phone = "";

// Набирать номер при нататии кнопок
$(".keyboard-number").click(function (event) {
    event.preventDefault();
    phone = $("#phone-number").val();
    let key = $(this).data("key");
    phone += key;
    $("#phone-number").val(phone);
});

// Стирать номер, при нажатии кнопки назад
$(".keyboard-item__backspace").click(function (event) {
    event.preventDefault();
    phone = $("#phone-number").val();
    phone = phone.substring(0, phone.length - 1);
    $("#phone-number").val(phone);
});

// Подстветка кнопок при их нажатии
$("#phone-number").keydown(function (event) {
    let keyCode = event.keyCode || event.which;
    if ((keyCode >= 96 && keyCode <= 105) || (keyCode >= 48 && keyCode <= 57)) {
        if (keyCode >= 96 && keyCode <= 105) {
            keyCode -= 48;
        }
        let number = String.fromCharCode(keyCode);
        setTimeout(function () {
            $(`.keyboard-number[data-key="${number}"]`).addClass("active");
        }, 100);
        setTimeout(function () {
            $(`.keyboard-number[data-key="${number}"]`).removeClass("active");
        }, 500);
        phone = $("#phone-number").val();
    } else if (keyCode === 107) {
        setTimeout(function () {
            $(`.keyboard-number[data-key="+"]`).addClass("active");
        }, 100);
        setTimeout(function () {
            $(`.keyboard-number[data-key="+"]`).removeClass("active");
        }, 500);
        phone = $("#phone-number").val();

    } else if (keyCode === 8) {
        phone = $("#phone-number").val();
    }
});

// Маска для телефон(убирает пробелы, дефисы и ограничивает длину)
const phone_number = $("#phone-number");
phone_number.inputmask("+1 (ddd) ddd-dddd d{0,6}");
phone_number.on('input', () => {
    let value = phone_number.val().replace(/[^+\d]/g, '');
    if (value.length > 12) {
        phone_number.inputmask("+1 (ddd) ddd-dddd \\* d{0,6}");
    } else {
        phone_number.inputmask("+1 (ddd) ddd-dddd d{0,6}");
    }
})


// Отключить или включить принимать звонки
function changeAvailable(item, token) {

    let url_available = '/api/v1/user/is_available/change/';
    let availableData = new FormData();
    availableData.append("is_available", item);

    $.ajax({
        headers: {"X-CSRFToken": token},
        url: url_available,
        async: false,
        processData: false,
        contentType: false,
        method: 'PATCH',
        data: availableData,
        success: function (data) {
        },
        error: function (data) {
            toastr.error(
                data.responseText,
                'Error',
                {
                    positionClass: "toast-bottom-right",
                    timeOut: 7000,
                    fadeOut: 5000,
                    progressBar: false,
                    showDuration: 700,
                    hideDuration: 7000,
                    tapToDismiss: true
                });
            return false;
        }
    });
}

// Функция для available(отключить звонки)
$("#avaible").click(function (event) {
    let is_avaible = $(this).data("avaible");
    let csrftoken = getCookie('csrftoken');

    if (is_avaible === "active") {
        changeAvailable(false, csrftoken);

        $(this).data("avaible", "no_active");
        $(this).removeAttr('checked');
    } else if (is_avaible === "no_active") {
        changeAvailable(true, csrftoken);
        $(this).data("avaible", "active");
        $(this).attr('checked');
    }
});

// Функция для форварда на другого диспетчера
$('#disList').on('click', ".forward-btn", function (event) {
    event.preventDefault();
    let id = $(this).data('dis');
    let url = "/api/v1/twilio/forward/" + id + "/";
    let csrftoken = getCookie('csrftoken');

    $.ajax({
        headers: {"X-CSRFToken": csrftoken},
        url: url,
        processData: false,
        contentType: false,
        method: 'GET',
        success: function (data) {
        },
        error: function (data) {
            toastr.error(
                data.responseText,
                'Error',
                {
                    positionClass: "toast-bottom-right",
                    timeOut: 7000,
                    fadeOut: 5000,
                    progressBar: false,
                    showDuration: 700,
                    hideDuration: 7000,
                    tapToDismiss: true
                });
        }
    });

});

// Нажимаешь на форвард (при исходящем)
$('#button-forward').click(function () {
    $('#forwardBlock').removeClass('hide');

    $('#volume-indicators').addClass('hide');
    $('#sendDigit').addClass('hide');
    $('#button-forward').addClass('hide');
    $('#button-hangup').addClass('hide');
    $('#button-mute').addClass('hide');
    $('#contactNameInProgressCallDisplay').addClass('hide');
    $('#timerOutgoing').addClass('hide');
});

// Нажимаешь на форвард (при входящем)
$('#button-forward-incoming').click(function () {
    $('#forwardBlock').removeClass('hide');

    $('#volume-indicators').addClass('hide');
    $('#incoming-call').addClass('hide');
    $('#button-forward-incoming').addClass('hide');
    $('#button-hangup-incoming').addClass('hide');
    $('#button-mute-incoming').addClass('hide');
});

// Нажимаешь назад при включенном форварде
$('.forward-back').click(function () {

    if ($('#incoming-call').hasClass('hide')) {
        $('#forwardBlock').addClass('hide');

        $('#volume-indicators').removeClass('hide');
        $('#sendDigit').removeClass('hide');
        $('#button-forward').removeClass('hide');
        $('#button-hangup').removeClass('hide');
        $('#button-mute').removeClass('hide');
        $('#contactNameInProgressCallDisplay').removeClass('hide');
        $('#timerOutgoing').removeClass('hide');
    } else {
        $('#forwardBlock').addClass('hide');

        $('#volume-indicators').removeClass('hide');
        $('#incoming-call').removeClass('hide');
        $('#button-forward-incoming').removeClass('hide');
        $('#button-hangup-incoming').removeClass('hide');
        $('#button-mute-incoming').removeClass('hide');
    }
});

// Менять стрелочку при открытии/закрытии диалпада
$(".openEventLogs").click(function (event) {
    event.preventDefault();
    if ($(window).width() > 992) {
        $(this).toggleClass("active");
    }
});

// Прослушивание микрофона для изменения активности
muteBTN.addEventListener('click', () => {
    muteBTN.classList.toggle("grayBackground");
});

// Для изменения активности микрофона во время входящего
incomingMuteBTN.addEventListener('click', () => {
    incomingMuteBTN.classList.toggle("grayBackground");
});


// Для форматирования номеров From в селекте в читаемый вид
//+19127159555
//+1(912)715-9555
function format_phone() {
    const from_phone_options = $('#from_phone option');
    for (let i = 0; i < from_phone_options.length; i++) {
        let old_value = from_phone_options[i].text;
        from_phone_options[i].text = `+1(${old_value.substring(2, 5)})${old_value.substring(5, 8)}-${old_value.substring(8, 12)}`;
    }
}

format_phone();
