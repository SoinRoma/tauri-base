// Audio
const speakerDevices = document.getElementById("speaker-devices");
const ringtoneDevices = document.getElementById("ringtone-devices");
const inputVolumeBar = document.getElementById("input-volume");
const volumeIndicators = document.getElementById("volume-indicators");
const inputVolumeBarIncoming = document.getElementById("input-volume-incoming");
const volumeIndicatorsIncoming = document.getElementById("volume-indicators-incoming");

// Buttons
const openEventLogs = document.querySelector('.openEventLogs');
const callButton = document.getElementById("button-call");
const hangupButton = document.getElementById("button-hangup");
const muteButton = document.getElementById("button-mute");
const forwardButton = document.getElementById("button-forward");
const formSendDigit = document.getElementById('sendDigit');
const numberSendDigit = document.getElementById('numberSendDigit');

const callControlsDiv = document.getElementById("call-controls");
const incomingCallDiv = document.getElementById("incoming-call");
const contactNameCallDisplay = document.getElementById("contactNameInProgressCallDisplay");
const contactNameCallBtn = document.getElementById("callContactBtn");
const chat_contact_list = document.getElementById("chatContactList");
const forwardBlock = document.getElementById("forwardBlock");
const middle1 = document.getElementById("middle1");

const incomingCallHangupButton = document.getElementById("button-hangup-incoming");
const incomingCallMuteButton = document.getElementById("button-mute-incoming");
const incomingCallForwardButton = document.getElementById("button-forward-incoming");
const incomingCallAcceptButton = document.getElementById("button-accept-incoming");
const incomingCallRejectButton = document.getElementById("button-reject-incoming");
const phoneNumberInput = document.getElementById("phone-number");
const phone_block = document.querySelector(".phone");
const incomingPhoneNumberEl = document.getElementById("incoming-number");
const incomingFromIVR = document.getElementById("incoming-from-ivr");

const chat_block = document.getElementById('mainAvatar');

// Таймер
const timerIncoming = document.getElementById('timerIncoming');
const timerOutgoing = document.getElementById('timerOutgoing');
let timer = new easytimer.Timer();

// Твилио и токен
let device;
let token;


try {

    function show_right_sidebar() {

        if (!middle1.classList.contains("show-right-sidebar")) {
            right_sidebar.toggleClass('show-right-sidebar');
            right_sidebar.toggleClass('hide-right-sidebar');
            if ($(window).width() > 780 && $(window).width() < 1201) {
                $(".chat:not(.right-sidebar .chat)").css('margin-left', -chat_width);
            }
            openEventLogs.classList.toggle('active');
        }

        if ($(window).width() < 780) {
            $('.left-sidebar').addClass('hide-left-sidebar');
            $('.chat').addClass('show-chatbar');
            right_sidebar.addClass('show-right-sidebar');
            right_sidebar.removeClass('hide-right-sidebar');
            $('.chat:not(.right-sidebar .chat)').addClass('hide-chatbar');
        }
    }

    function make_call(item) {
        hangup();
        const contact_uuid = item.getAttribute("data-uuid");
        const contact_name = item.getAttribute("data-name");
        make_outgoing_call(contact_uuid, contact_name);
    }

    // При попытке позвонить через кнопку, открывать боковое меню справа для телефона
    contactNameCallBtn.addEventListener('click', (event) => {
        event.preventDefault();
        show_right_sidebar();
        make_call(chat_head);
    });

    // При попытке позвонить через Dialpad
    callButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (phoneNumberInput.value !== '') {
            const phone_number = $("#phone-number").val();
            const phone_value = phone_number.replace(/[^+,*\d]/g, '');
            make_outgoing_call(phone_value, phone_value);
        } else {
            if (!chat_block.classList.contains('hide')) {
                make_call(chat_head);
            } else {
                make_outgoing_call('', '');
            }
        }
    });

    // При попытке положить трубку
    hangupButton.addEventListener('click', (event) => {
        event.preventDefault();
        hangup();
    });

} catch {
}


// Первый запрос токена доступа и запуск инициализации Девайса
async function startup_client() {
    await $.ajax({
        url: 'https://testtwilio.uzdevelop.ru/api/v1/twilio/token',
        headers: {'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`},
        type: "GET",
        tokenFlag: true,
        success: (data) => {
            token = data.token;
            initialization_device();
        },
        error: () => {
            console.log(`Error with get Token. Status: ${error}`);
        },
    });
}

startup_client();

// Создание нового экземпляр Twilio Device
function initialization_device() {

    device = new Twilio.Device(token, {
        debug: true,
        answerOnBridge: true,
        allowIncomingWhileBusy: true, // Принимать вторую линию
        closeProtection: true, // Если во время звонка закрыть страницу, то будет предупреждение.
        codecPreferences: ["opus", "pcmu"], // Массив кодеков для качества звука.
        maxCallSignalingTimeoutMs: 0, // Продолжительность в мс, в течении котого будет пытаться повторно подключиться.
        tokenRefreshMs: 5 * 60 * 1000, // менять токен за 5 минут до окончания сродка действия токена
        // sounds: {
        //     outgoing: '/static/v2/sounds/sound-out.mp3',
        //     incoming: '/static/v2/sounds/sound-out.mp3'
        // }
    });

    // Слушатель устройства
    device_listeners(device);
    // Устройство должно быть зарегистрировано для приема входящих звонков
    device.register();
}

// Функция слушателя для устройства Twilio
function device_listeners(device) {

    // Если устройство зарегистрированно
    device.on("registered", function () {
        // проверяем на наличие uuid(к нам перешли по ссылке чтобы сразу позвонить)
        if (window.name === 'cargoetlPhoneCallWindow' || window.name === 'lexivo') {
            // Проверяем на наличие query param
            check_uuid();
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Если интернет вернули, то убираем прелоадер
        $(".preloader").css("display", "none");
        $(".preloader-bg").css("opacity", "1");
        $(".loader").css("display", "none");
        $(".loader-text").css("display", "none");
    });

    // Поступление входящих звонков
    device.on("incoming", handleIncomingCall);

    // Изменение устройств связи
    device.audio.on("deviceChange", update_all_audio_devices.bind(device));

    // Обновление токена
    device.on('tokenWillExpire', () => {
        $.getJSON("/api/v1/twilio/token").success(function (data) {
            device.updateToken(data.token);
        });
    });

    // Обработчик ошибок
    device.on('error', (twilioError) => {

        // Если интернет пропал, то включаем прелоадер
        if (twilioError.code === 31005 || twilioError.code === 31000 || twilioError.code === 31009) {
            $(".preloader").css("display", "block");
            $(".preloader-bg").css("opacity", "0.5");
            $(".loader").css("display", "block");
            $(".loader-text").css("display", "block");
        }
        // Если токен стал невалидный, то заменяем его
        else if (twilioError.code === 20101 || twilioError.code === 20104) {
            $.getJSON("/api/v1/twilio/token").success(function (data) {
                device.updateToken(data.token);
            });
        }
        // Если другой тип ошибок
        else {
            console.log(`Error name: ${twilioError.name}. Error code: ${twilioError.code}`);
        }
    });
}


// СДЕЛАТЬ ИСХОДЯЩИЙ ЗВОНОК
async function make_outgoing_call(number, contact_name) {

    const params = {
        FromTwilioPhone: $('#from_phone').val(),
        To: number,
        Extension: number
    };

    if (device) {

        const call = await device.connect({params});

        // Изменить UI при исходящем звонке
        callControlsDiv.classList.add('hide');
        phone_block.classList.add('justify-content-center');
        contactNameCallDisplay.innerHTML = contact_name;
        contactNameCallDisplay.classList.remove('hide');

        // Приглушения звука SMS
        soundSMS.volume = 0.1;

        call.on('error', (e) => {
            let message = '';
            if (e.message.includes('31401')) {
                message = `You don't have access to the microphone. Turn on the microphone in your browser settings`;
            } else {
                message = `Wrong phone number`;
            }
            toastr.error(
                message,
                'Error',
                {
                    positionClass: "toast-bottom-right",
                    timeOut: 7000,
                    fadeOut: 2000,
                    progressBar: false,
                    showDuration: 700,
                    hideDuration: 2000,
                    tapToDismiss: true,
                    closeButton: true
                });
            set_default_volume_sms();
        });

        // Слушатели звонка для принятия, отключения вызова и безвучный режим
        call.addListener("accept", updateUIAcceptedCall);
        call.addListener("disconnect", updateUIDisconnectedCall);
        muteButton.addEventListener('click', (event) => {
            event.preventDefault();
            mute(call);
        });


    }
}

// Принятие исходящего вызова
function updateUIAcceptedCall(call) {

    // Обновление индикатора громкости
    change_volume_indicator(call, inputVolumeBar);

    // Включение таймера для звонка
    start_timer_for_call(timerOutgoing);


    // Изменить UI при исходящем звонке
    callButton.disabled = true;
    timerOutgoing.classList.remove("hide");
    volumeIndicators.classList.remove("hide");
    formSendDigit.classList.remove('hide');
    forwardButton.classList.remove('hide');
    muteButton.classList.remove('hide');
    hangupButton.classList.remove("hide");

    // Отправка номера (101, 102, ....)
    formSendDigit.addEventListener('submit', function (event) {
        event.preventDefault();
        call.sendDigits(numberSendDigit.value);
    });
}

// Завершении исходящего вызова
function updateUIDisconnectedCall() {
    // Остановка таймера
    finish_timer_for_call(timerOutgoing);

    // Вернуть UI обратно к диалпаду
    callButton.disabled = false;
    callControlsDiv.classList.remove('hide');
    phone_block.classList.remove('justify-content-center');
    muteButton.classList.remove("grayBackground");
    contactNameCallDisplay.classList.add('hide');
    timerOutgoing.classList.add("hide");
    volumeIndicators.classList.add("hide");
    forwardBlock.classList.add("hide");
    hangupButton.classList.add("hide");
    muteButton.classList.add("hide");
    forwardButton.classList.add("hide");
    formSendDigit.classList.add("hide");

    set_default_volume_sms();
}


// ОБРАБОТАТЬ ВХОДЯЩИЙ ЗВОНОК
function handleIncomingCall(call) {

    // Открыть правую панель с диалпадом
    //show_right_sidebar();

    //get_notification(call);

    // Приглушения звука SMS
    //soundSMS.volume = 0.1;


    //  Если звонок в режими ожидания и занят
    if (incomingCallDiv.classList.contains('hide') && !device.isBusy) {
        // Слушатели событий для кнопок во время входящего звонка
        incomingCallAcceptButton.addEventListener('click', (event) => {
            event.preventDefault();
            accept_incoming_call(call);

            incomingCallHangupButton.addEventListener('click', (event) => {
                event.preventDefault();
                hangup_incoming_call(call);
            });

            incomingCallMuteButton.addEventListener('click', (event) => {
                event.preventDefault();
                mute(call);
            });
        });

        incomingCallRejectButton.addEventListener('click', (event) => {
            event.preventDefault();
            reject_incoming_call(call);
        });

        // Изменение UI
        callControlsDiv.classList.add('hide');
        phone_block.classList.add('justify-content-center');
        incomingCallDiv.classList.remove("hide");
        incomingPhoneNumberEl.innerHTML = call.customParameters.get("full_name");
        const from_ivr = call.customParameters.get("from_ivr");
        if (from_ivr !== undefined) {
            incomingFromIVR.innerHTML = `<span class="incoming-span">From IVR:</span> ${from_ivr}`;
        }
        // Слушатели входящего звонка
        call.on("cancel", () => {

            // Остановка таймера для входящего звонка
            finish_timer_for_call(timerIncoming);

            if (!device.isBusy) {
                // Изменение UI
                callControlsDiv.classList.remove("hide");
                phone_block.classList.remove('justify-content-center');
                incomingCallAcceptButton.classList.remove("hide");
                incomingCallRejectButton.classList.remove("hide");
                incomingCallAcceptButton.classList.remove("hide");
                incomingCallRejectButton.classList.remove("hide");
                contactNameCallDisplay.classList.add('hide');
                incomingCallHangupButton.classList.add("hide");
                incomingCallMuteButton.classList.add("hide");
                incomingCallForwardButton.classList.add("hide");
                timerIncoming.classList.add("hide");
                incomingCallDiv.classList.add("hide");
                volumeIndicatorsIncoming.classList.add('hide');
                incomingPhoneNumberEl.innerHTML = "";
                incomingFromIVR.innerHTML = "";

                set_default_volume_sms();
            }
        });
    } else {

        let t = toastr.success(
            `<p class="text-center">${call.customParameters.get("full_name")}</p>` +
            '<div class="d-flex justify-content-center">' +
            '<button class="toastr-accept keyboard-item keyboard-item__phone mb-0" title="Accept">' +
            '  <img src="/static/v2/images/icons/phone.svg" alt="phone">' +
            '</button>' +
            '<button class="toastr-reject keyboard-item keyboard-item__hangup mb-0" title="Reject">' +
            '  <img src="/static/v2/images/icons/phone.svg" alt="phone">' +
            '</button>' +
            '</div>',
            '',
            {
                "positionClass": "toast-bottom-right incoming-toastr",
                "progressBar": false,
                "preventDuplicates": false,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "0",
                "extendedTimeOut": 0,
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut",
                "tapToDismiss": false
            });


        $(t).on('click', '.toastr-accept', function () {
            $(this).closest('#toast-container').remove();

            incomingCallHangupButton.addEventListener('click', (event) => {
                event.preventDefault();
                hangup_incoming_call(call);
            });

            incomingCallMuteButton.addEventListener('click', (event) => {
                event.preventDefault();
                mute(call);
            });

            accept_incoming_call(call);

            // Изменение UI
            callControlsDiv.classList.add('hide');
            phone_block.classList.add('justify-content-center');
            incomingCallDiv.classList.remove("hide");
            incomingPhoneNumberEl.innerHTML = call.customParameters.get("full_name");
            const from_ivr = call.customParameters.get("from_ivr");
            if (from_ivr !== undefined) {
                incomingFromIVR.innerHTML = `<span class="incoming-span">From IVR:</span> ${from_ivr}`;
            }
        });

        $(t).on('click', '.toastr-reject', function () {
            $(this).closest('#toast-container').remove();
            call.reject();
        });

        // Слушатели входящего звонка
        call.on("cancel", () => {
            $(t).closest('#toast-container').remove();
        });

    }

    call.on('disconnect', () => {
        // Остановка таймера для входящего звонка
        finish_timer_for_call(timerIncoming);

        // Изменение UI
        callControlsDiv.classList.remove("hide");
        phone_block.classList.remove('justify-content-center');
        contactNameCallDisplay.classList.add('hide');
        incomingCallAcceptButton.classList.remove("hide");
        incomingCallRejectButton.classList.remove("hide");
        incomingCallHangupButton.classList.add("hide");
        incomingCallMuteButton.classList.add("hide");
        incomingCallForwardButton.classList.add("hide");
        timerIncoming.classList.add("hide");
        incomingPhoneNumberEl.innerHTML = "";
        incomingFromIVR.innerHTML = "";
        incomingCallDiv.classList.add("hide");
        forwardBlock.classList.add("hide");
        volumeIndicatorsIncoming.classList.add("hide");

        set_default_volume_sms();
    });
}

// ПРИНЯТЬ ВХОДЯЩИЙ ЗВОНОК
function accept_incoming_call(call) {

    call.accept();

    // Обновление индикатора громкости
    change_volume_indicator(call, inputVolumeBarIncoming);

    // Включение таймера для звонка
    start_timer_for_call(timerIncoming);

    // Вызов нужного чата по uuid
    if (call.customParameters.get("contact_uuid")) {
        let contact_uuid = call.customParameters.get("contact_uuid");
        let csrfToken = getCookie('csrftoken');

        activity_header(contact_uuid);
        activity_messages(contact_uuid);
        scroll_to_tag();
        check_my_tag(csrfToken);
    }

    // Изменение UI
    incomingCallHangupButton.classList.remove("hide");
    incomingCallMuteButton.classList.remove("grayBackground");
    incomingCallMuteButton.classList.remove("hide");
    incomingCallForwardButton.classList.remove("hide");
    timerIncoming.classList.remove("hide");
    volumeIndicatorsIncoming.classList.remove("hide");
    incomingCallAcceptButton.classList.add("hide");
    incomingCallRejectButton.classList.add("hide");
}

// ОТКЛОНИТЬ ВХОДЯЩИЙ ЗВОНОК
function reject_incoming_call(call) {

    call.reject();

    // Изменение UI
    callControlsDiv.classList.remove("hide");
    phone_block.classList.remove('justify-content-center');
    contactNameCallDisplay.classList.add('hide');
    volumeIndicatorsIncoming.classList.add("hide");
    incomingCallDiv.classList.add("hide");
    incomingPhoneNumberEl.innerHTML = "";
    incomingFromIVR.innerHTML = "";

    set_default_volume_sms();
}

// Положить ВХОДЯЩИЙ ЗВОНОК
function hangup_incoming_call(call) {

    call.disconnect()

    // Изменение UI
    forwardBlock.classList.add("hide");
    volumeIndicatorsIncoming.classList.add("hide");
    incomingCallDiv.classList.add("hide");
    incomingPhoneNumberEl.innerHTML = "";
    incomingFromIVR.innerHTML = "";
}


// Положить телефон
function hangup() {
    if (device) {
        device.disconnectAll();
    }
}

// Отключить/Включить звук
function mute(call) {
    if (call) {
        if (call.isMuted()) {
            call.mute(false);
        } else {
            call.mute(true);
        }
    }
}

// Запуск таймера во время разговора
function start_timer_for_call(timer_block) {
    timer_block.innerHTML = '(00:00)';
    if (timer.isRunning) {
        timer.reset();
    } else {
        timer.start();
    }
    timer.addEventListener("secondsUpdated", () => {
        timer_block.innerHTML = ('(' + timer.getTimeValues().toString().slice(3) + ')');
    });
}

function finish_timer_for_call(timer_block) {
    timer.stop();
    timer_block.innerHTML = '(00:00)';
}

// Изменение индикаторов громкости
function change_volume_indicator(call, bar) {
    call.on("volume", function (inputVolume) {
        let inputColor = "#894c37";
        if (inputVolume < 0.5) {
            inputColor = "#00B57E";
        } else if (inputVolume < 0.75) {
            inputColor = "#8f9e5a";
        }

        bar.style.width = Math.floor(inputVolume * 300) + "px";
        bar.style.background = inputColor;

    });
}

// Прослушать тестовый IVR
async function listen_ivr(number) {
    let params = {
        Text: $('#ivr_text').val() || '',
        To: number,
    };

    if (device) {
        const call = await device.connect({params});
        call.on('error', () => {
            toastr.error(
                `You don't have access to the microphone. Turn on the microphone in your browser settings`,
                'Error',
                {
                    positionClass: "toast-bottom-right",
                    timeOut: 7000,
                    fadeOut: 2000,
                    progressBar: false,
                    showDuration: 700,
                    hideDuration: 2000,
                    tapToDismiss: false,
                    closeButton: true
                });
        });

    }
}

// Уведомление браузера о входящем звонке
function get_notification(call) {

    let options = {
        icon: '/static/v2/images/Logo.png',
        body: 'Incoming Call'
    };

    let notification = new Notification(`Call you from ${call.customParameters.get("full_name")}`, options);
    notification.addEventListener('click', function () {
        window.focus();
    });
}


// Получение и обновление аудио устройств
async function get_audio_devices() {
    await navigator.mediaDevices.getUserMedia({audio: true}).then(() => {
        update_all_audio_devices.bind(device);
    }).catch(() => {
        toastr.error(
            'You don\'t have access to the microphone. Turn on the microphone in your browser settings',
            'Error',
            {
                positionClass: "toast-bottom-right",
                timeOut: 7000,
                fadeOut: 2000,
                progressBar: false,
                showDuration: 700,
                hideDuration: 2000,
                tapToDismiss: true,
                closeButton: true
            })
    });

}

function update_all_audio_devices() {
    if (device && speakerDevices && ringtoneDevices) {
        update_devices(speakerDevices, device.audio.speakerDevices.get());
        update_devices(ringtoneDevices, device.audio.ringtoneDevices.get());
    }
}

function update_devices(selectEl, selectedDevices) {

    selectEl.innerHTML = " ";

    device.audio.availableOutputDevices.forEach(function (device, id) {
        let isActive = selectedDevices.size === 0 && id === "default";
        selectedDevices.forEach(function (device) {
            if (device.deviceId === id) {
                isActive = true;
            }
        });

        let option = document.createElement("option");
        option.label = device.label;
        option.setAttribute("data-id", id);
        if (isActive) {
            option.setAttribute("selected", "selected");
        }
        selectEl.appendChild(option);
    });
}

function update_speakers_device() {
    const selectedDevices = Array.from(speakerDevices.children)
        .filter((node) => node.selected)
        .map((node) => node.getAttribute("data-id"));

    device.audio.speakerDevices.set(selectedDevices);
}

function update_ringtone_device() {
    const selectedDevices = Array.from(ringtoneDevices.children)
        .filter((node) => node.selected)
        .map((node) => node.getAttribute("data-id"));

    device.audio.ringtoneDevices.set(selectedDevices);
}

function set_default_volume_sms() {
    if (localStorage.getItem('volume_sms')) {
        soundSMS.volume = parseInt(localStorage.getItem('volume_sms')) * 0.1;
    }
}
