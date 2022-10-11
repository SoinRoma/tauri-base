const chatContactList = document.getElementById('chatContactList');
let cur_get_list_url = 'https://testtwilio.uzdevelop.ru/api/v1/twilio/contact/list/';


function counterTags(count_tags, id) {
   let divTag = '';
   if (count_tags > 0) {
      divTag = `<div class="count-tag smsCount" id="smsCount${id}">${count_tags}</div>`;
   }
   return divTag;
}

function counterSMS(count_sms, id) {
   let divTag = '';
   if (count_sms > 0) {
      divTag = `<div class="count-sms smsCount" id="smsCount${id}">${count_sms}</div>`;
   }
   return divTag;
}

function counterSMSWithoutTags(count_sms, id) {
   let divTag = '';
   if (count_sms > 0) {
      divTag = `<div class="count-sms withoutTags smsCount" id="smsCount${id}">${count_sms}</div>`;
   }
   return divTag;
}

function linkChat(item, is_append) {



   let name = item.client_name;


   let contact_element = `
    <li>
        <h5 id="contactName${item.id}">
            ${item.client_name}
        </h5>     
    </li>`;

   if (is_append) {
      $("#chatContactList").append(contact_element);
   } else {
      $("#chatContactList").prepend(contact_element);
   }

}

// Загрузить первые 100 контактов в список чатов
$.ajax({
   url: cur_get_list_url,
   headers: {'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`},
   type: "GET",
   tokenFlag: true,
   success: (data) => {
      cur_get_list_url = data.next;
      for (item of data.results) {
         linkChat(item, true);
      }
   },
   error: () => {
      check_auth();
   },
});



