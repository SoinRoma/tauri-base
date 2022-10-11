const volume_sms = document.getElementById('volume_sms');

soundSMS.volume = volume_sms ? volume_sms.value : 1;


if (localStorage.getItem('volume_sms')) {
    soundSMS.volume = parseInt(localStorage.getItem('volume_sms')) * 0.1;
    volume_sms ? volume_sms.value = localStorage.getItem('volume_sms') : '';
}

volume_sms ? (
    volume_sms.addEventListener('change', (event) => {
    let value = event.target.value;
    localStorage.setItem('volume_sms', value);
    soundSMS.volume = value * 0.1;
    soundSMS.currentTime = 0;
    soundSMS.play();
})) : '';



