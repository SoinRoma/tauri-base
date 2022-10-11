function introShow() {
    setTimeout(function () {
        if (localStorage.getItem('intro') !== '1' && $(window).width() > 992) {
            introJs().setOptions({
                showBullets: false,
                steps: [{
                    intro: "Welcome to LEXIVO!"
                }, {
                    element: document.querySelector('#search-input'),
                    intro: "Write here to search contacts!"
                }, {
                    element: document.querySelector('.add-contact-id'),
                    intro: "Click here to add new contact",
                }, {
                    element: document.querySelector('.send-sms-id'),
                    intro: "Click here to send SMS to selected contacts!"
                }, {
                    element: document.querySelector('.filter-id'),
                    intro: "Click here to filter contacts."
                }, {
                    element: document.querySelector('#chatContactList'),
                    intro: "Here are your contacts. Double clicking on a contact calls him. " +
                        "Click with the Ctrl button adds the contact to favorites"
                }, {
                    element: document.querySelector('#extention_number'),
                    intro: "This is your extension number!"
                }, {
                    element: document.querySelector('.profile-id'),
                    intro: "Click here to change your settings",

                }, {
                    element: document.querySelector('.update-id'),
                    intro: "Click here to view updates",

                }, {
                    element: document.querySelector('.add-fax-id'),
                    intro: "Click here to send FAX",
                }
                ]
            }).start();
            localStorage.setItem('intro', '1');
        }
    }, 2000);
}

function introSecondShow() {
    setTimeout(function () {
        if (localStorage.getItem('intro2') !== '1' && $(window).width() > 992) {
            introJs().setOptions({
                showBullets: false,
                steps: [{
                    element: document.querySelector('#is_favorite'),
                    intro: "Click here to add a contact to your favorites"
                }, {
                    element: document.querySelector('#callContactBtn'),
                    intro: "Click here to call a contact",
                }, {
                    element: document.querySelector('#more-id'),
                    intro: "Click here to edit or delete a contact"
                }, {
                    element: document.querySelector('#noteBtn'),
                    intro: "Click here to send a note"
                }, {
                    element: document.querySelector('.upload-fileSMS'),
                    intro: "Click here to send files"
                }]
            }).start();
            localStorage.setItem('intro2', '1');
        }
    }, 1000);
}