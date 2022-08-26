const btn = document.getElementById('btn');
const btn2 = document.getElementById('btn2');

const notification = window.__TAURI__.notification;

// Test Tauri Notification
btn.addEventListener('click', () => {

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



