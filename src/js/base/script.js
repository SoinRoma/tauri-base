"use strict";

// Active Tooltip
const active_tooltip = () => {
    const tooltip = $('[data-toggle="tooltip"]');
    if (tooltip.length > 0) {
        tooltip.tooltip();
    }
}
active_tooltip();

// Open Burger Menu
$("#burger-btn").click(() => {
    $('.sidebar-menu-phone').toggleClass('is-active');
});

// Close Burger Menu
$(".burger-link").click(() => {
    $('.sidebar-menu-phone').toggleClass('is-active');
});

// Back in prev page in phone size
$(".chat-header .left_side i").on('click',  () => {
    $('.left-sidebar').removeClass('hide-left-sidebar');
    $('.chat').removeClass('show-chatbar');
});

// If click to back in browser in mobile version
function click_back_browser() {
    if ($(window).width() < 992) {
        $(window).on('popstate', function () {
            if (right_sidebar.hasClass('show-right-sidebar')) {
                right_sidebar.toggleClass('show-right-sidebar');
                right_sidebar.toggleClass('hide-right-sidebar');
                close_right_bar();
                window.history.pushState('forward', null, '#');
                window.history.forward(1);
            } else {
                $('.left-sidebar').removeClass('hide-left-sidebar');
                $('.chat').removeClass('show-chatbar');
                window.history.pushState('forward', null, '#');
                window.history.forward(1);
            }
        });
    }
}

click_back_browser();


// Sidebar-Phone
let chat_width = $('.chat').width();
const right_sidebar = $('.right-sidebar');

const close_right_bar = () => {
    if ($(window).width() > 780) {
        $(".chat").css('margin-left', 0);
    }
    if ($(window).width() < 780) {
        $('.chat').removeClass('hide-chatbar');
    }
}

// Open Right Bar
$(".dream_profile_menu").on('click',  () => {

    right_sidebar.toggleClass('show-right-sidebar');
    right_sidebar.toggleClass('hide-right-sidebar');

    if (right_sidebar.hasClass('show-right-sidebar')) {
        if ($(window).width() > 780 && $(window).width() < 1201) {
            $(".chat:not(.right-sidebar .chat)").css('margin-left', -chat_width);
        }
        if ($(window).width() < 780) {
            $('.chat:not(.right-sidebar .chat)').addClass('hide-chatbar');
        }
    }
    if (right_sidebar.hasClass('hide-right-sidebar')) {
        close_right_bar();
    }
});

// Close Right Bar
$(".close_profile").on('click', () => {
    close_right_bar();
});


// DarkMode
const dark_mode = () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    let darkMode = localStorage.getItem('darkMode');

    if (window.location.hash === "#DarkMode") {
        document.body.classList.add('darkmode');
        localStorage.setItem('darkMode', 'enabled');
    }

    const enable_dark_mode = () => {
        document.body.classList.add('darkmode');
        try {
            darkModeToggle.setAttribute('checked', 'checked');
        } catch (e) {

        }
        localStorage.setItem('darkMode', 'enabled');
    };

    const disable_dark_mode = () => {
        document.body.classList.remove('darkmode');
        localStorage.setItem('darkMode', null);
    };

    if (darkMode === 'enabled') {
        enable_dark_mode();
    }

    const click_dark_mode = () => {
        darkMode = localStorage.getItem('darkMode');
        if (darkMode !== 'enabled') {
            enable_dark_mode();
        } else {
            disable_dark_mode();
        }
    }

    try {
        darkModeToggle.addEventListener('click', () => {
            click_dark_mode();
        });
    } catch {}

}
dark_mode();

// Notifications for favorites only
const notification_for_favorite = () => {
    const notification_favorite = document.getElementById('notification_favorite');

    const enable_notification = () => {
        localStorage.setItem('notification_favorite', 'enabled');
        notification_favorite ? notification_favorite.setAttribute('checked', 'checked') : '';
    };

    const disable_notification = () => {
        localStorage.removeItem('notification_favorite');
    };

    if (localStorage.getItem('notification_favorite')) {
        enable_notification();
    }

    const click_notification_favorite = () => {

        if (!localStorage.getItem('notification_favorite')) {
            enable_notification();
        } else {
            disable_notification();
        }
    }

    try {
        notification_favorite.addEventListener('click', () => {
            click_notification_favorite();
        });
    } catch {}

}
notification_for_favorite();

// Check Cyrillic in messages
const check_cyrillic_in_sms = () => {
    const check_cyrillic = document.getElementById('check_cyrillic');

    const enable_cyrillic = () => {
        localStorage.setItem('check_cyrillic', 'enabled');
        check_cyrillic ? check_cyrillic.setAttribute('checked', 'checked') : '';
    };

    const disable_cyrillic = () => {
        localStorage.removeItem('check_cyrillic');
    };

    if (localStorage.getItem('check_cyrillic')) {
        enable_cyrillic();
    }

    const click_notification_favorite = () => {

        if (!localStorage.getItem('check_cyrillic')) {
            enable_cyrillic();
        } else {
            disable_cyrillic();
        }
    }

    try {
        check_cyrillic.addEventListener('click', () => {
            click_notification_favorite();
        });
    } catch {}

}
check_cyrillic_in_sms();

// Preloader
const preloader = () => {
    $(window).on('load', function () {
        $('html, body').animate({scrollTop: 0}, 'normal');
        $(".loader").fadeOut("slow", function () {
            $(".preloader").delay(300).fadeOut("slow");
            introShow();
        });
    });
};
preloader();
