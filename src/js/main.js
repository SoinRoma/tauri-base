const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');

const notification = window.__TAURI__.notification;

// Test Tauri Notification
btn1.addEventListener('click', () => {

    let permissionGranted = notification.isPermissionGranted();
        if (!permissionGranted) {
        const permission =  notification.requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
        notification.sendNotification({title: 'TAURI', body: 'Tauri is awesome!'});
    }
})

// Test Tauri Dialog
btn2.addEventListener('click', () => {

    const yes = window.__TAURI__.dialog.ask('Are you sure?', 'Tauri');

})


// Test Tauri Update
btn3.addEventListener('click', () => {


    const update = window.__TAURI__.updater.checkUpdate();

    // window.__TAURI__.process.relaunch();


})


btn4.addEventListener('click', () => {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '../login.html';

})



