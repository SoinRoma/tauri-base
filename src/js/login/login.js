$("#login_form").submit(function (e) {
    e.preventDefault();
    const login_url = "https://testtwilio.uzdevelop.ru/api/v1/token/";
    let loginData = new FormData();
    loginData.append("username", $("#username").val());
    loginData.append("password", $("#password").val());

    $.ajax({
        url: login_url,
        processData: false,
        contentType: false,
        method: 'POST',
        data: loginData,
        success: function (data) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            window.location.href = '../../index.html';
        },
        error: function (data) {
            alert(data.responseText);
        }
    });

});