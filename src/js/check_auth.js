function check_auth() {
    if (localStorage.getItem('refresh_token')) {

        const refresh_token = localStorage.getItem('refresh_token');
        const update_token_url = "https://testtwilio.uzdevelop.ru/api/v1/token/refresh/";
        let Data = new FormData();
        Data.append("refresh", refresh_token);

        $.ajax({
            url: update_token_url,
            processData: false,
            contentType: false,
            method: 'POST',
            data: Data,
            success: function (data) {
                localStorage.setItem('access_token', data.access);
            },
            error: function (data) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '../login.html';
            }
        });

    } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '../login.html';
    }
}

check_auth();


