$(document).ready(function(){

	$('.drop_down_link').click(function(e){
		e.preventDefault()
        var $this = $(this);
		var $code_block = $this.closest('.code').children('.code_block')
        $this.children('.icoFont').toggleClass('spinned_up_down');
		$code_block.toggleClass('open')
	})

	$('.html .code_block pre').each(function(index,item){
		$item=$(item);
		html_string=$item.html()
		html_string=html_string.replace(/\&/g,'&nbsp;')
		html_string=html_string.replace(/</g,'&lt;')
		html_string=html_string.replace(/>/g,'&gt;')
		html_string=html_string.replace(/\"/g,'_-_') //cambio de comillas por ese string para que despues de crear clases no se confunda con los span creados
		html_string=html_string.replace(/( class| id| href| for| type| value| name| checked)/g,'<span class="attr_name">$1</span>')
		html_string=html_string.replace(/&lt;\/(\w+)/g,'&lt;\/<span class="code_tag">$1</span>')
		html_string=html_string.replace(/&lt;(\w+)/g,'&lt;<span class="code_tag">$1</span>')
		html_string=html_string.replace(/_-_((\#|\.)*(\w*|\_\w+|\-\w+|\s)*)_-_/g,'\"<span class="attr_value">$1</span>\"')

		$item.html(html_string)

	})

	$('.sass .code_block pre').each(function(index,item){
		$item=$(item);
		html_string=$item.html()
		html_string=html_string.replace(/(\.\w+)( \{|,|\{|\#)/g,'<span class="selector_name">$1</span>$2')
        html_string=html_string.replace(/(\#\w+)( \{|,|\{)/g,'<span class="selector_name">$1</span> \{')
		html_string=html_string.replace(/(:before|:after+)( \{|,|\{)/g,'<span class="selector_name">$1</span> \{')
		html_string=html_string.replace(/(\:hover|\%(\w+)|\:first-child|\:last-child|\:last-of-type|\:first-of-type)/g,'<span class="selector_name">$1</span>')
        html_string=html_string.replace(/(p|span|div|table|th|td|tr|ul|ol|li|h1|h2|h3|h4|h5|h6|header)( \{|,|\{)/g,'<span class="tag_name">$1</span>$2')
        html_string=html_string.replace(/(((\w+)-)*\w+)\:/g,'<span class="attr_name">$1\:</span>')
        html_string=html_string.replace(/(&amp;|@extend(?!\w))/g,'<span class="tag_name">$1</span>')
        html_string=html_string.replace(/(\d)(em|px|\%(?!\w))/g,'$1<span class="tag_name">$2</span>')
		html_string=html_string.replace(/(\.*\d+(\.\d+)*|\#([0-9a-fA-F]{3,6}))/g,'<span class="number">$1</span>')
		$item.html(html_string)
	})

	$('.js .code_block pre').each(function(index,item){
		$item=$(item);
		html_string=$item.html()
		html_string=html_string.replace(/(\$|\=|\!|\*|\+|if|else|switch|break)/g,'<span class="symbol">$1</span>');
		html_string=html_string.replace(/\.((\w+(\-|\_)*)+)\(/g,'.<span class="function">$1</span>(');
        html_string=html_string.replace(/(\'[^'\r\n]*\')/g,'<span class="value">$1</span>');
        html_string=html_string.replace(/(var) /g,'<span class="reserved_name">$1 </span> ');
		html_string=html_string.replace(/(function)\(/g,'<span class="reserved_name">$1 </span>\(');
        html_string=html_string.replace(/ ((\.*|\-)\d+(\.\d+)*)/g,' <span class="number">$1</span>')
		$item.html(html_string)
	})





/*js de SLIDER*/


$('.option_slider_container .option_slider').click(function(e){
  e.preventDefault();
  var $option_slider_container = $(this).closest('.option_slider_container')
  $option_slider_container.toggleClass('second_option');
  $option_slider_container.children('input').not(':checked').prop("checked", true);
  })
$('.option_slider_container .option_selector_link').click(function(e){
  e.preventDefault();
  var $option_slider_container = $(this).closest('.option_slider_container');
  if ($(this).is('#second_option')) {
    $option_slider_container.addClass('second_option');
  }else{
    $option_slider_container.removeClass('second_option');
  };
  $option_slider_container.children('input'+this.getAttribute('href')).prop("checked", true)
})


/*js de INFO POPUP */

$('.info_trigger').click(function(e){
	e.preventDefault();
	$(this.getAttribute('href')).show();
})
$('.close_popup').click(function(e){
	e.preventDefault();
	$(this).closest('.info_popup').hide()
})


})

/* js de visible_toggler */
var toggle_property = function(element){
    element.toggleClass('btn-primary btn-danger');
    element.children('.prohibited_icon').toggleClass('hidden');
    element.siblings('input').prop('checked', !element.siblings('input').prop('checked')).trigger('change');
}
var disable_property = function(element){
    element.removeClass('btn-primary');
    element.addClass('btn-danger');
    element.children('.prohibited_icon').removeClass('hidden');
    element.siblings('input').prop('checked', true).trigger('change');
}
var enable_property = function(element){
    element.siblings('input').prop('checked', false).trigger('change');
    element.addClass('btn-primary');
    element.removeClass('btn-danger');
    element.children('.prohibited_icon').addClass('hidden');
}
$(function() {
    $('body').on('click','.visible_link',function(e){
        e.preventDefault();
        var $visible_link=$('.visible_link');
        $this=$(this);
        toggle_property($this);
        if ($this.closest('.visible_selector').hasClass('visible_selector_parent')) {
            $visible_link.each(function(index,item){
                $item=$(item);
                if (index>$visible_link.index($this)) {
                    if(!$item.closest('.visible_selector').hasClass('visible_selector_parent')){
                        if ($this.hasClass('btn-primary')) {
                            enable_property($item);
                        }else{
                            disable_property($item);
                        }
                    }else{
                        return false;
                    }
                }
            })
        }else{
            if ($this.hasClass('btn-primary')) {
                var i=$visible_link.index($this);
                firstEncounter=true;
                while (--i>=0 && firstEncounter){
                    if ($visible_link.eq(i).closest('.visible_selector').hasClass('visible_selector_parent')) {
                        enable_property($visible_link.eq(i));
                        firstEncounter=false;
                    }
                }
            }
        }
    });

//js de select
    var slider_duration = 100;
    
    $('.children_link_opener').click(function(e){
        var $this = $(this);
        var $icon_arrow = $this.children('.dropdown_selected').children('[class^="icon-arrow-"], [class~="icon-arrow-"]');
        var $children_link_list = $this.children('.children_link_list');
        var children_inside = $children_link_list.children().length;
        if ($this.hasClass('open')) {
            $children_link_list.velocity(
                "slideUp",
                { 'duration' : 0.3*slider_duration * children_inside,
                    'easing' : 'linear',
                 });
        }else{
            $children_link_list.velocity(
                "slideDown",
                { 'duration' : slider_duration * children_inside,
                    'easing' : 'linear',
                    complete : function(elements){
                        var scroll_gap = -60;
                        var $elements = $(elements);
                        var scrollTop = $(window).scrollTop();
                        if (scrollTop > $elements.offset().top+scroll_gap) {
                            $elements.velocity('scroll',{
                                duration : '150',
                                offset : scroll_gap,
                            })
                        }
                    }
                 });
        }
        $this.toggleClass('open');
        $icon_arrow.toggleClass('spinned_up_down_cw');
    });

    $('.dropdown_link').click(function(e){
        e.preventDefault();
        var $this = $(this);
        $this.closest('.dropdown_container').find('select option').removeAttr('selected');
        $($this.attr('href')).attr('selected','selected');
        $this.closest('.dropdown_box').find('.dropdown_selected_text').text($this.text());
        $this.closest('li').siblings().removeClass('hidden');
        $this.closest('li').addClass('hidden');
    });

    /********************
      Custom checkbox.
     ********************/
    $('body').on('click', '.checkbox_btn_masked', function(e){
        e.preventDefault();
        var $this = $(this);
        $this.removeClass('error')
        var $linked_checkbox = $($this.data('linked-checkbox'));
        $this.toggleClass('active');
        $linked_checkbox.prop('checked',!$linked_checkbox.prop('checked'));
    });

    $('body').on('change', '.checkbox_masked', function(){
        var $this = $(this);
        var $customCheckbox = $this.siblings('.checkbox_alike');
        $customCheckbox.removeClass('error');
        if($customCheckbox.hasClass('active')){
            $customCheckbox.removeClass('active');
        }else{
            $customCheckbox.addClass('active');
        }
    });

    /********************
      Custom radio
     ********************/
    $('body').on('click', '.radio_btn_masked', function(e){
        e.preventDefault();
        var $this = $(this);
        $this.removeClass('error')
        var $linked_radio = $($this.data('linked-radio'));
        if (!$this.hasClass('active')) {
            $this.addClass('active');
            $linked_radio.prop('checked',true).trigger('change');
        }
    });

    $('body').on('change', '.radio_masked', function(){
        var $this = $(this);
        var $customRadio = $this.siblings('.radio_alike');
        $customRadio.removeClass('error');
        $('input[name="'+$this.attr('name')+'"]').each(function(index,item){
            var $item = $(item);
            var $itemCustomRadio = $item.siblings('.radio_alike');
            if($item.prop('checked')){
                $itemCustomRadio.addClass('active');
            }else{
                $itemCustomRadio.removeClass('active');
            }   
        })
    });
    /********************
      tooltip
     ********************/

    $('body').on('click','.contextual_info',function(e){
        e.preventDefault();
        $(this).toggleClass('opened');
    });
    /********************
     Modal
     ********************/

    var $open_modal = $('.open_modal');
    var $modal = $('.modal');
    var $body = $('body');
    $body.append($modal);

    $open_modal.click(function(e) {
        e.preventDefault();
        var $this = $(this);
        var target = $this.data('modal');
        $(target).fadeIn();
        $('body').append('<div id="modal_overlay"></div>');

    });

    $body.on( "click", '.close_modal , #modal_overlay', function(e) {
        e.preventDefault();
        $('#modal_overlay').remove();
        $modal.fadeOut();
    });

    /********************
     Navigation list
     ********************/

    $('.scroll_btn').on('click', function(){
        $('.current').removeClass('current');
        $(this).addClass('current');
    });

    /********************
     SELECT SIMULATOR
     ********************/

    var clearCustomSelect = function($form){
        $customSelect = $form.find('.select_simulator_cont');
        var firstOption = $customSelect.find('select option:first').text();
        $customSelect.find('.select_simulator').find('.select_value').text(firstOption);
    };


    /********************
     SELECT SIMULATOR: Drop Down
     ********************/
        //var $select_simulator = $('.select_simulator');
    $('body').on('click', '.select_simulator', function(e){
        e.preventDefault();
        var $this = $(this);
        var $options_list = $this.siblings('.options_list');
        if ($this.hasClass('closed')) {
            $this.removeClass('closed placeholder');
            $('.custom_select_simulate_box').css("z-index", '');
            $this.closest('.custom_select_simulate_box').css({
                'z-index' : 11,
            })
            if($options_list.children().length>5){
                var max_height = 200;
                $options_list.css({
                    'height' : 0,
                    'display' : 'block',
                    'overflow-Y' : 'scroll',
                }).velocity('stop').velocity({
                    'height' : max_height+'px',
                },{
                    'duration' : 300,
                });
            }else{
                $options_list.velocity('stop').velocity('slideDown',{
                    'duration' : 300,
                });
            }
            $this.children('.icon-arrow-down').addClass('spinned_up_down');
        }else{
            $this.addClass('closed');
            $this.parent().css({
                'z-index' : 10,
            })
            if($options_list.children().length>5){
                $options_list.velocity('stop').velocity({
                    'height' : 0,
                },{
                    'duration' : 150,
                    'complete' : function(elements){
                        $(elements).css({
                            'display' : 'none',
                        })
                    },
                });

            }else{
                $options_list.velocity('stop').velocity('slideUp',{
                    'duration' : 150
                });
            }
            $this.children('.icon-arrow-down').removeClass('spinned_up_down');

        }
    });

    /********************
     SELECT SIMULATOR: Close Drop Down and styles
     ********************/
    $('body').on('mouseleave', '.select_simulator_cont', function(e){
        e.preventDefault();
        var $this = $(this);
        var $select_simulator = $this.children('.select_simulator');

        if (!$select_simulator.hasClass('closed')) {
            $this.children('.select_simulator').addClass('closed').children('.icon-arrow-down').removeClass('spinned_up_down');
            var $options_list = $this.children('.options_list');
            if($options_list.children().length>5){
                $options_list.velocity('stop').velocity({
                    'height' : 0,
                },{
                    'duration' : 150,
                    'complete' : function(elements){
                        $(elements).css({
                            'display' : 'none',
                        })
                    },
                });

            }else{
                $options_list.velocity('stop').velocity('slideUp',{
                    'duration' : 150
                });
            }
        }
    });

    /********************
     SELECT SIMULATOR: Set value
     ********************/
        //var $options_list_item = $('.options_list li');

    $('body').on('click', '.options_list li', function(e){
        e.preventDefault();
        $this = $(this);
        var $custom_select = $this.closest('.custom_select')
        $custom_select.removeClass('error');
        $custom_select.find('.select_simulator').addClass('closed');
        $this.prev().removeClass('placeholder');
        var $parent = $this.parent();
        var $select_value = $parent.parent().find('.select_value');
        var value_selected = $this.attr('data-value');
        //$parent.slideToggle();
        $select_value.text($this.text());
        var $select = $parent.next('.field');
        $select.attr('value',value_selected);
        $select.find('option').removeAttr('checked')
            .filter('[value="'+value_selected+'"]')
            .attr('selected', 'selected').attr('value', value_selected);
        $select.trigger("change");
        $parent.hide();
    });


    /********************
     SELECT SIMULATOR: Drop Down
     ********************/
        //var $slide_up_down = $('.slide_up_down');

    $('body').on('click', '.slide_up_down', function(e){
        e.preventDefault();
        $this = $(this);
        var dataIconClasses = $this.attr('data-icon-class');
        var dataCurrent = $this.attr('data-current');
        var dataTarget = $this.attr('data-target');
        $this.find('i.ico_up_down').toggleClass(dataIconClasses);
        if(dataCurrent){
            $this.toggleClass(dataCurrent);
        }
        $(dataTarget).slideToggle();
    });
    /********************
     SELECT SIMULATOR: Reset custom select simulator
     ********************/
    var resetCustomSelectValue = function($form){
        $form = $($form);
        $selectCustom = $form.find('.custom_select');
        $selectCustom.each(function(index, item){
            $item = $(item);
            $realSelect = $item.closest('.custom_select_simulate_box').find('select');
            var value = $realSelect.val();
            if((value == " ") || (value == "")){
                var text = $realSelect.find('option').get(0).innerHTML;
                $item.find('.select_value').text(text);
            }else{
                text = $item.find('.options_list').find('li[data-value="' + value +'"]').text();
                $item.find('.select_value').text(text);
            }
        });
    };




});