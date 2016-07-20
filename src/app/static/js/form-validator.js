var error_msg = new Array();
var success_msg = new Array();

var regExpMail = new RegExp(/^[a-zA-Z0-9]+([\.\-]?\w)*\@[a-zA-Z0-9]+([\.\-]?\w)*(\.[a-zA-Z]{2,4}){1,2}$/);
var regExpNumbers = new RegExp(/^\d+$/);
var regExpLetters = new RegExp(/^[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙãÃõÕâêîôûÂÊÎÔÛçÇñÑºª'äÄÖöëËüÜÏï^ß~õÕãÃ\s]+$/);
var regExpDate = new RegExp(/^(([1-9]|(0[1-9])|([1-2][0-9])|(3[0-1]))|((19|20)[0-9]{2}))[-|\/]([1-9]|(0[1-9])|(1[0-2]))[-|\/](([1-9]|(0[1-9])|([1-2][0-9])|(3[0-1]))|((19|20)[0-9]{2}))$/);
var regExpDateDay = new RegExp(/^(([1-9]|(0[1-9])|([1-2][0-9])|(3[0-1])))$/);
var regExpDateMonth = new RegExp(/^(([1-9]|(0[1-9])|(1[0-2])))$/);
var regExpDateYear = new RegExp(/^(((19|20)[0-9]{2}))$/);

var helperValidateError = function($inputsInError){
    $($inputsInError).each(function(index, item) {
        $item = $(item);
        var typeFieldString = $item.data('validate');
        if (typeof(typeFieldString) === "object"){
            var length = typeFieldString.length;
            for (var i = 0; i < length; ++i) {
                var typeFieldFn = window[typeFieldString[i]];
                if (typeof typeFieldFn === "function") {
                    typeFieldFn($(this));
                }
            }
        }else{
            var typeFieldFn = window[typeFieldString];
            if (typeof typeFieldFn === "function") {
                typeFieldFn($(this));
            }
        }
    });
};

var date_day = function($date_day){
    if($date_day.val().length !== 0 && !($date_day.hasClass('just_numbers_error'))){
        var $input_group = $date_day.closest('.input_group');
        $inputsDate = $input_group.find('input');
        $inputsDateErrors =  $input_group.find('input.error');
        var $inputsInError = $.makeArray($inputsDateErrors);
        if(!regExpDateDay.test($date_day.val())){
            if($inputsInError.length === 0) {
                $input_group.find('.error_msg').remove();
                $input_group.append('<span class="error_msg">' + errorDateFormat + '</span>');
            }else{
                helperValidateError($inputsInError);
            }
            $date_day.addClass('error');
        }else{
            helperValidateError($inputsInError);
        }
    }
};

var date_month = function($date_month){
    if($date_month.val().length !== 0 && !($date_month.hasClass('just_numbers_error'))){
        var $input_group = $date_month.closest('.input_group');
        $inputsDate = $input_group.find('input');
        $inputsDateErrors =  $input_group.find('input.error');
        var $inputsInError = $.makeArray($inputsDateErrors);
        if(!regExpDateMonth.test($date_month.val())){
            if($inputsInError.length === 0) {
                $input_group.find('.error_msg').remove();
                $input_group.append('<span class="error_msg">' + errorDateFormat + '</span>');

            }else{
                helperValidateError($inputsInError);
            }
            $date_month.addClass('error');
        }else{
            helperValidateError($inputsInError);
        }
    }
};

var date_year = function($date_year){
    if($date_year.val().length !== 0 && !($date_year.hasClass('just_numbers_error'))){
        var $input_group = $date_year.closest('.input_group');
        $inputsDate = $input_group.find('input');
        $inputsDateErrors =  $input_group.find('input.error');
        var $inputsInError = $.makeArray($inputsDateErrors);
        if(!regExpDateYear.test($date_year.val())){
            if($inputsInError.length === 0) {
                $input_group.find('.error_msg').remove();
                $input_group.append('<span class="error_msg">' + errorDateFormat + '</span>');
            }else{
                helperValidateError($inputsInError);
            }
            $date_year.addClass('error');
        }else{
            helperValidateError($inputsInError);
        }
    }
};

var min_password = function($min_password) {
    if ($min_password.length) {
        $min_password.each(function(index, item) {
            $item = $(item);
            if ($item.val().length < 6) {
                error_msg.push(errorMinPassword);
                 classError($min_password, 'add');
                 $min_password.val('').attr('placeholder',errorMinPassword)
            } else {
                success_msg.push(item.getAttribute('name'));
                classError($min_password, 'remove');
            }
        });
    }
};

var no_empty = function($no_empty) {
    if(!$no_empty.is('[class*="_error"]')){
        var $input_group = $no_empty.closest('.input_group');
        $input_group.find('.error_msg').remove();
        if ($no_empty.val().length == 0 ) {
            error_msg.push(errorEmptyField);
            $no_empty.addClass('error');
            //$no_empty.val('').attr('placeholder',errorEmptyField);
            //$no_empty.val('');
            $input_group.append('<span class="error_msg">'+errorEmptyField+'</span>');
        } else {
            success_msg.push($no_empty.attr('name'));
            $no_empty.removeClass('error no_empty_error');
        }
    }
};

var select_no_empty = function($select_no_empty) {
    if ($select_no_empty.length) {
        $select_no_empty.each(function(index, item) {
            $item = $(item);
            if ($item.val() == '0') {
                error_msg.push(errorEmptyField);
                classError($select_no_empty, 'add');
            } else {
                success_msg.push(item.getAttribute('name'));
                classError($select_no_empty, 'remove');
            }
        });
    }
};

var just_letters = function($just_letters) {
    if ($just_letters.val().length !== 0 || $just_letters.hasClass('just_letters_error') ) {
        var $input_group = $just_letters.closest('.input_group');
        $input_group.find('.error_msg').remove();
        if ($just_letters.val().length !== 0 && !regExpLetters.test($just_letters.val())) {
            error_msg.push(errorJustLetters);
            $just_letters.addClass('error just_letters_error')
            $input_group.append('<span class="error_msg">'+errorJustLetters+'</span>');
        }else{
            success_msg.push($just_letters.attr('name'));
            $just_letters.removeClass('error just_letters_error')
        }
    }
};

var just_numbers = function($just_numbers) {
    if ($just_numbers.val().length !== 0 || $just_numbers.hasClass('just_numbers_error') ) {
        var $input_group = $just_numbers.closest('.input_group');
        $input_group.find('.error_msg').remove();
        if ($just_numbers.val().length !== 0 && !regExpNumbers.test($just_numbers.val())) {
            error_msg.push(errorJustNumbers);
            $just_numbers.addClass('error just_numbers_error');
            $input_group.append('<span class="error_msg">'+errorJustNumbers+'</span>');
        }else{
            success_msg.push($just_numbers.attr('name'));
            $just_numbers.removeClass('error just_numbers_error');
        }
    }
};

var email = function($email) {
    if ($email.length) {
        $email.each(function(index, item) {
            var $input_group = $(item).closest('.input_group');
            $input_group.find('.error_msg').remove();
            if (item.value.length !== 0 && !regExpMail.test(item.value)) {
                error_msg.push(errorEmail);
                classError($email, 'add');
                $input_group.append('<span class="error_msg">'+errorEmail+'</span>');
            } else if (item.value.length !== 0 && regExpMail.test(item.value)) {
                success_msg.push(item.getAttribute('name'));
                classError($email, 'remove');
            } else if(item.value.length === 0){
                classError($email, 'add');
                $input_group.append('<span class="error_msg">'+errorEmail+'</span>');
            }
        });
    }
};

var valid_date = function($valid_date) {
    if ($valid_date.length) {
        $valid_date.each(function(index, item) {
            if (item.value.length !== 0 && !regExpDate.test(item.value)) {
                error_msg.push(errorDateFormat);
                classError($valid_date, 'add');
                $valid_date.val('').attr('placeholder',errorDateFormat)
            } else if (item.value.length !== 0 && regExpDate.test(item.value)) {
                success_msg.push(item.getAttribute('name'));
                classError($valid_date, 'remove');
            }
        });
    }
};
var min_max = function($min_max) {
    if ($min_max.length) {
        $min_max.each(function(index, item) {
            $item = $(item);
            if ($item.val().length !== 0 && (item.value.length <= $item.data('min-value') || item.value.length >= $item.data('max-value'))) {
                error_msg.push(['El valor no tiene la longitud requerida (' + $item.data('min-value') + ',' + $item.data('max-value') + '): ', true, item.getAttribute('name')]);
                classError($min_max, 'add');
            } else if ($item.val().length !== 0 && item.value.length >= $item.data('min-value') && item.value.length <= $item.data('max-value')) {
                success_msg.push(item.getAttribute('name'));
                classError($min_max, 'remove');
            }
        });
    }
};
var radio_mandatory = function($radio_mandatory) {
    if ($radio_mandatory.length) {
        var radio_groups = new Array();
        //Revisa y crea un array con los distintos nombres de groupos de -radio-
        $radio_mandatory.each(function(index, item) {
                var name = item.getAttribute('name');
                if (radio_groups.indexOf(name) < 0) {
                    radio_groups.push(name);
                }
            });
            //recorre el array anterior y aprovecha que los inputs tienen que tener esa clase para haberse ejecutado
        $.each(radio_groups, function(index, item) {
            $option_group = $('.radio_mandatory[name="' + item + '"]:checked')
            if ($option_group.length <= 0) {
                error_msg.push(['Es obligatorio hacer una seleción en: ', true, item]);
                classError($option_group, 'add');
            }else{
                classError($option_group, 'remove');
            }
        });
    }
};

var required_checkbox_group = function($required_checkbox_group) {
    if ($required_checkbox_group.length) {
        $required_checkbox_group.each(function(index, item) {
            $item = $(item);
            if ($item.find('input:checked').length <= 0) {
                error_msg.push(['Al menos debes seleccionar una opción de este grupo: ', true, $item.find('input')[0].getAttribute('name')]);
                classError($required_checkbox_group, 'add');
            }else{
                classError($required_checkbox_group, 'remove');
           }   
        });
    }
};

var required_checkbox = function($required_checkbox) {
    if ($required_checkbox.length) {
        $required_checkbox.each(function(index, item) {
            $item = $(item);
            if (!$item.is(':checked')) {
                error_msg.push(['Esta opción tiene que estar marcada: ', true, item.getAttribute('name')]);
                classError($required_checkbox, 'add');
            }else{
                classError($required_checkbox, 'remove');
            }
        });
    }
};

var restricted_formats = function($restricted_formats) {
    if ($restricted_formats.length) {
        $restricted_formats.each(function(index, item) {
            $item = $(item);
            var filePath = $item.val();
            var admitted_extensions = $item.data('restricted-formats');
            var file_extension = filePath.substr(filePath.lastIndexOf('.') + 1);
            var admitted_extensions_string = '(';
            $.each(admitted_extensions, function(index, item) {
                admitted_extensions_string += item + ',';
            });
            admitted_extensions_string = admitted_extensions_string.substr(0, admitted_extensions_string.length - 1);
            admitted_extensions_string += ')';
            if (item.value.length !== 0 && $.inArray(file_extension, admitted_extensions) < 0) {
                error_msg.push(['El formato de archivo no es válido ' + admitted_extensions_string + ' en: ', true, item.getAttribute('name')]);
                classError($restricted_formats, 'add');
            } else if (item.value.length !== 0 && $.inArray(file_extension, admitted_extensions) >= 0) {
                item.getAttribute('name');
            }else{
                classError($restricted_formats, 'remove');
            }
        });
    }
};

var classError = function($element, action){
    if (action === 'add'){
        $element.addClass('error');
    }else if (action === 'remove'){
        $element.removeClass('error');
    }else{
        //console.log('Solo se admite add o remove como segundo parámetro.');
    }
};

var validateCustomCheckbox = function($form){
    $customCheckbox = $form.find('.checkbox_alike.required_field');
    var auxFlag = true;
    $customCheckbox.each(function( index, element ) {
        var $element = $(element);
        $linked_checkbox = $($element.data('linked-checkbox'));
        if($linked_checkbox.is(':not(:checked)')){
            auxFlag = false;
            var id = $linked_checkbox.attr('id');
            $element.addClass('error');
        }
    });
};

var validateCustomSelect = function($form){
    $selectCustom = $form.find('.custom_select.can_be_validated');
    $realSelect = $selectCustom.closest('.custom_select_simulate_box').find('select');
    var auxFlag = true;
    $realSelect.each(function( index, element ){
        $element = $(element);
        if($element.val() === ""){
            auxFlag = false;
            $element.closest('.custom_select_simulate_box').find('.custom_select').addClass('error');
        }
    });
};

/************************************************************
 *
 * @param {DOMElement} inputFile
 * @param {Number} size
 *
 * Funcion que comprueba que el fichero subido no tenga mas
 * tamano que size.
 *
 * @return {boolean}
 *
 ************************************************************/
var validateSizeFile = function (inputFile, size) {

    size = typeof size !== 'undefined' ?  size : 5242880;


    var validSize = true;

    for (var i = 0; i < inputFile.files.length; i++) {
        var file = inputFile.files[i];
        file.validSize = false;
        if ('size' in file) {
            var sizeFile = file.size;
            if (sizeFile < size){
                file.validSize = true;
            }else{
                validSize = false;
            }
        }
    }

    var $inputFile = $(inputFile);

    if(!validSize){
        $inputFile.siblings('.text_letter_small').addClass('error_msg');
        $inputFile.addClass('error');
        return false;
    }else{
        $inputFile.siblings('.text_letter_small').removeClass('error_msg');
        $inputFile.removeClass('error');
        return true;
    }
};

var validateForm = function($form) {
    $form.find('.can_be_validated').each(function(index, item) {
        $(item).on('focusout', function() {
            var typeFieldString = $(this).data('validate');
            if (typeof(typeFieldString) === "object"){
                var length = typeFieldString.length;
                for (var i = 0; i < length; ++i) {
                    var typeFieldFn = window[typeFieldString[i]];
                    if (typeof typeFieldFn === "function") {
                        typeFieldFn($(this));
                    }
                }          
            }else{
            var typeFieldFn = window[typeFieldString];
            if (typeof typeFieldFn === "function") {
                typeFieldFn($(this));
            }
            }
        });
    });
};

var preValidateSubmit = function($form){
    validateAllForm($form);
    var auxFlag = true;
    $form.find('.can_be_validated, .checkbox_alike, .custom_select').each(function(index, item){
        $item = $(item);
        if (($item.hasClass('error')) && !($item.hasClass('hidden'))){
            auxFlag =  false;
        }
    });

    if(!auxFlag){
        $form.find('.submit_btn').removeAttr('disabled');
        $form.find('.ajax_loader').addClass('hidden');
        return false;
     }else{
         return true;
     }
};

var validateAllForm = function($form){
    $form.find('input:file').each(function(index, item){
        validateSizeFile(item);
    });
    validateCustomSelect($form);
    validateCustomCheckbox($form);
    $form.find('.can_be_validated').each(function(index, item) {
        $item = $(item);
        var typeFieldString = $item.data('validate');
            if (typeof(typeFieldString) === "object"){
                var length = typeFieldString.length;
                for (var i = 0; i < length; ++i) {
                    var typeFieldFn = window[typeFieldString[i]];
                    if (typeof typeFieldFn === "function") {
                        typeFieldFn($(this));
                    }
                }          
            }else{
            var typeFieldFn = window[typeFieldString];
            if (typeof typeFieldFn === "function") {
                typeFieldFn($(this));
            }
        }
    });
};

$(document).ready(function() {
    var $form = $('form.to_validate');
    validateForm($form);
});

