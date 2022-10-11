// Перемещает из одного селекта в другой
function transfer_contacts(from_select, to_select) {
    $(`#${from_select} option:selected`).each(function () {
        $(this).appendTo(`#${to_select}`);
    });
    $(`#${to_select} option`).each(function (el) {
        $(`#${to_select} option:eq(${el})`).css({"background-color": "transparent", "color": "black"});
        $(`#${to_select} option:eq(${el})`).prop('selected', false);
    });
    $('#choose_all').text(`Choose All (${$('#selectAll option').length})`);
    $('#choose_selected').text(`Choose All (${$('#selectSelected option').length})`);
}

// Выделяет всё
function choose_all_options(select) {
    $(`#${select} option`).each(function (el) {
        $(`#${select} option:eq(${el})`).css({"background-color": "#3297FD", "color": "#FFF"});
        $(`#${select} option:eq(${el})`).prop('selected', true);
    });
}

// Если выбрали один, то у всех возвращает цвет по умолчанию
function default_options(select) {
    $(`#${select} option`).each(function (el) {
        $(`#${select} option:eq(${el})`).css({"background-color": "transparent", "color": "black"});
    });
}

$('#addContacts').click(() => {
    transfer_contacts('selectAll', 'selectSelected');
});

$('#removeContacts').click(() => {
    transfer_contacts('selectSelected', 'selectAll');
});

$('#choose_all').click(() => {
    choose_all_options('selectAll');
});

$('#choose_selected').click(() => {
    choose_all_options('selectSelected');
});

$('#selectAll').click(() => {
    default_options('selectAll');
});

$('#selectSelected').click(() => {
    default_options('selectSelected');
});
