/**
 * Created by arobles on 7/28/14.
 */

/*var IsValidImageUrl = function (url) {
 var img = img || new Image();
 img.src = url;
 console.dir(img.width);
 //alert(img.height != 0);
 }*
 */




var createContent = (function ($){
    var elementId = 0,
        defaultInfo = {
            "title": "{title}",
            "time":  "{time}",
            "img": "default.png"
        },
        parse_url = function (url) {
            return /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(url);
        },
        refreshAttr = function () {
            var elements = $('.container')[0].childNodes,
                lengthItem = elements.length + 3,
                i,
                level,
                colors = {
                    1:'#70afcc',
                    2:'#66a1bd',
                    3:'#5790ab',
                    4:'#4d8199'
                };
            for(i = 0; i < lengthItem; i += 1) {
                level = (i < 14 )? Math.floor((i + 3)/3): 4;
                $(elements[i]).css('background-color', colors[level]);
                $(elements[i]).find('.songNumber').html(i + 1);
            }
            $('#no').html(lengthItem - 3);
        },
        removeOptions = function () {
            $(this).find('.hoverDiv').remove();
        },
        insertContacts = function (contact, position, that) {
            var number = $('.container'),
                recordText = $('<div>')
                    .append($('<h2>')
                        .html('<span class="songNumber">' + (elementId + 1) + '</span>. <span class="songTitle">' + contact.title +
                            '</span> - <span class="songTime">' + contact.time  + '</span>')),
                record = $('<div>')
                    .addClass('record')
                    .append(recordText),
                img = $('<img>', {
                    src: contact.img,
                    class: 'pic',
                    alt: contact.name
                }),
                imgDiv = $('<div>')
                    .append(img)
                    .addClass('imgDiv'),
                displayInfo = $('<div>')
                    .addClass('contentInfo')
                    .addClass('movement')
                    .append(record, imgDiv),
                content = $('<div>')
                    .attr('id', elementId)
                    .addClass('content')
                    .append(displayInfo)
                    .dblclick(dblClickContent)
                    .mouseenter(createOptions)
                    .mouseleave(removeOptions);
            if(position && that){
                if(position === 'before'){
                    $(content).insertBefore($('#' + that.parentNode.parentNode.id));
                }else if(position === 'after') {
                    $('#' + that.parentNode.parentNode.id ).after( $(content) );
                }
            } else {
                number.append(content);
            }
            elementId += 1;
            refreshAttr();
        },
        dblClickContent = function () {
            var close,
                fieldset,
                form,
                edit,
                input,
                button;
            if($(this).find('.contentInfo').length !== 1){
                return;
            }
            close = $('<img>', {
                src: 'cerrar.png',
                class : 'close',
                alt : 'close'
            }).click(function (e) {
                $(e.target.parentNode.nextSibling).css('display', 'block');
                this.parentNode.remove();
            }),
                input = $('<div>')
                    .addClass('form-group'),
                button = input.clone()
                    .append( $('<button>')
                        .addClass('form-control')
                        .attr('type', 'submit')
                        .text('add'));
            input.append($('<input>')
                .addClass('form-control')
                .attr('type', 'text'));
            fieldset = $('<fieldset>')
                .append(input.clone()
                    .find('input')
                    .attr('placeholder', 'Title')
                    .attr('type', 'text')
                    .end(),
                    input.clone()
                        .find('input')
                        .attr('placeholder', 'Time')
                        .end(),
                    input.clone()
                        .find('input')
                        .attr('placeholder', 'Image Url')
                        .attr('type', 'url')
                        .end(),
                    button
                );
            form = $('<form>')
                .submit(function (e) {
                    var info = {};
                    e.preventDefault();
                    info['name'] = e.target[1].value;
                    info['time'] = e.target[2].value;
                    info['img'] = e.target[3].value;
                    if(info.img === '' || info.name === '' || !parse_url(info.img) || !typeof info.name === 'string' || isNaN(parseInt(info.time))) {
                        alert('incorrect');
                        return;
                    }
                    $(e.target.parentNode.nextSibling)
                        .find('.songTitle')
                        .html(info['name'])
                        .end()
                        .find('.songTime')
                        .html(info['time'])
                        .end()
                        .find('.pic')
                        .attr('src', info['img']);
                    $(e.target.parentNode.nextSibling).css('display', 'block');
                    $(e.currentTarget.parentNode).remove();

                }).append(fieldset);
            edit = $('<div>')
                .addClass('contentInfo')
                .append(close, form);
            $(this).find('.contentInfo').css('display','none');
            $(this).prepend(edit);
        };
    function createOptions() {
        if($(this.parentNode).find('.hoverDiv').length) {
            return;
        }
        var icons = $('<div>')
            .addClass('hoverDiv')
            .append($('<div>')
                .click(function () {
                    insertContacts(defaultInfo, 'before', this);
                }), $('<div>')
                .click(function () {
                    this.parentNode.parentNode.remove();
                    refreshAttr();
                }), $('<div>')
                .click(function () {
                    insertContacts(defaultInfo, 'after', this);
                }));
        $(this).append(icons);
    }
    return {
        insertContacts: insertContacts,
        refreshAttr: refreshAttr
    }
}(jQuery));
$.ajax({
    url: "local.json",
    success: function (data) {
        var contacts = data.contacts;
        for (var contact in contacts){
            if(contacts.hasOwnProperty(contact)){
                contacts[contact].img = 'img/' + contacts[contact].img;
                createContent.insertContacts(contacts[contact]);
            }
        }
    }
});

$(document).ready(function() {
    var $dragging = null,
        offset_y,
        offset_x,
        coordinates = [],
        indexPos;
    $(document.body).on("mousemove", function(e) {
        if ($dragging) {
            $dragging.offset({
                top: e.pageY - offset_y,
                left: e.pageX - offset_x
            });
        }
    });
    $(document.body).on("mousedown", ".movement", function (e) {
        $dragging = $(e.target.parentNode);
        $dragging.find('.hoverDiv').remove();
        $dragging.css('z-index', '10');
        $(document.body).css('cursor', 'move');
        offset_x = e.offsetX;
        offset_y = e.offsetY;
        $(".content").each(function() {
            var lefttop = $(this).offset();
            coordinates.push({
                dom: $(this),
                left: lefttop.left,
                top: lefttop.top,
                right: lefttop.left + $(this).width(),
                bottom: lefttop.top + $(this).height()
            });
            if($dragging[0].id === this.id) {
                indexPos = coordinates.length - 1;
            }
        });
    });
    $(document.body).on("mouseup", function (e) {
        $(document.body).css('cursor', 'default');
        for (var i in coordinates) {
            if(coordinates.hasOwnProperty(i)){
                if (e.pageX >= coordinates[i].left && e.pageX <= coordinates[i].right) {
                    if (e.pageY >= coordinates[i].top && e.pageY <= coordinates[i].bottom) {
                        if(i < indexPos) {
                            $($dragging).insertBefore($('#' + coordinates[i].dom[0].id));
                        } else if(i > indexPos) {
                            $($dragging).insertAfter($('#' + coordinates[i].dom[0].id));
                        }
                        createContent.refreshAttr();
                    }
                }
            }
        }
        $dragging.css('position', 'static');
        coordinates = [];
        $dragging = null;
    });
});
