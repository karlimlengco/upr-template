// sidebar menu item interaction
$(document).on('click', '.sidebar__menu__item__link', function(e){
    if ( $(this).parent().hasClass('has-child') ) {
        e.preventDefault();
        $(this).toggleClass('is-active');
        $(this).next('.sidebar__child-menu').toggleClass('is-visible');
        $(this).parent().siblings().children().removeClass('is-active is-visible');
    }
});

// show user options
$(document).on('click', '.topbar__user', function(e){
    $(this).find('.topbar__user__options').toggleClass('is-visible');
})

// show item options
$(document).on('click', '.button--options-trigger', function(e){
    e.preventDefault();
    // alert('betlog');
    $(this).find('.button__options').toggleClass('is-visible');
})


// show modal
$(document).on('click', '.topbar__utility__button--modal', function(e){
    $('.modal').addClass('is-visible');
})

//close modal
$(document).on('click', '.modal__close-button', function(e){
    $('.modal').removeClass('is-visible');
})

//show inbox
$(document).on('click', '.open-inbox', function(e){
    $('.inbox').addClass('is-visible');
    $('body').addClass('no-scroll');
})

//close inbox
$(document).on('click', '.inbox__close', function(e){
    $('.inbox').removeClass('is-visible');
    $('.chat').removeClass('is-visible');
})

// open chat
$(document).on('click', '.inbox__item', function(e){
    $('.chat').addClass('is-visible');
})

// open chat
$(document).on('click', '.close-chat', function(e){
    $('.chat').removeClass('is-visible');
})

// close notifier
$(document).on('click', '.notifier__close-button', function(e){
    e.preventDefault();
    $('.notifier').removeClass('is-visible');
})

//show child table
$(document).on('click', '.show-child-table', function(e){
    $(this).children('i').toggleClass('ui-1_circle-add ui-1_circle-delete');
    $(this).parents('tr').next().find('.has-child').first().toggleClass('is-open');
    $(this).parents('tr').next().find('.child-table').toggleClass('is-visible');
})

$(document).on('click', '.show-grand-child-table', function(e){
    $(this).children('i').toggleClass('ui-1_circle-add ui-1_circle-delete');
    $(this).parents('tr').next().find('.has-child').first().toggleClass('is-open');
    $(this).parents('tr').next().find('.grand-child-table').toggleClass('is-visible');
})

$(document).on('click', '.show-great-grand-child-table', function(e){
    $(this).children('i').toggleClass('ui-1_circle-add ui-1_circle-delete');
    $(this).parents('tr').next().find('.has-child').first().toggleClass('is-open');
    $(this).parents('tr').next().find('.great-grand-child-table').toggleClass('is-visible');
})

// togglesidebar
$(document).on('click', '.sidebar__toggle-button', function(e){
    e.preventDefault();
    $('.sidebar').toggleClass('was-minimized');
    $('.topbar').toggleClass('was-extended');
    $('.content').toggleClass('was-extended');
})
