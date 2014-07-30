/**
 * Created by arobles on 7/28/14.
 */

; var createContent = (function ($){
    var elementId = 0,
        defaultInfo = {
            "title": "{title}",
            "time":  "{time}",
            "img": "css/img/default.png"
        },
        parse_url = function (url) {
            return /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(url);
        },
        matchTime = function (time) {
            return /^([0-9]+):([0-5][0-9])$/.test(time);
        },
        refreshAttr = function () {
            var elements = $('.container')[0].childNodes,
                lengthItem = elements.length,
                i,
                level,
                colors = {
                    1:'#70afcc',
                    2:'#66a1bd',
                    3:'#5790ab',
                    4:'#4d8199'
                };
            for(i = 1; i < lengthItem; i += 1) {
                level = (i < 14 )? Math.floor((i + 2)/3): 4;
                $(elements[i]).css('background-color', colors[level]);
                $(elements[i]).find('.songNumber').html(i);
            }
            lengthItem = lengthItem - 1;
            $('#no').html((lengthItem == 1)? '1 song' :lengthItem + ' songs');
        },
        removeOptions = function () {
            $(this).find('.hoverDiv').remove();
            $(this).find('marquee').attr('scrollamount', '0');
        },
        insertContacts = function (contact, position, that) {
            var number = $('.container'),
                recordText = $('<div>')
                    .append($('<marquee>')
                        .attr('scrollamount', '0')
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
                content = $('<li>')
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
                fieldSet,
                form,
                edit,
                input,
                button,
                songName = $(this).find(".songTitle")[0].childNodes[0].data,
                songTime_ = $(this).find(".songTime")[0].childNodes[0].data,
                pic = $(this).find('.pic').attr('src');
            if($(this).find('.contentInfo').length !== 1){
                return;
            }
            close = $('<img>', {
                src: 'css/img/cerrar.png',
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
                        .text('Add'));
            input.append($('<input>')
                .addClass('form-control')
                .attr('type', 'text'));
            fieldSet = $('<fieldset>')
                .append(input.clone()
                    .find('input')
                    .attr('placeholder', 'Title')
                    .attr('type', 'text')
                    .val((songName === defaultInfo.title)? '' :songName)
                    .end(),
                    input.clone()
                        .find('input')
                        .attr('placeholder', 'Time')
                        .val((songTime_ === defaultInfo.time)? '00:00' : songTime_)
                        .end(),
                    input.clone()
                        .find('input')
                        .attr('placeholder', 'Image Url')
                        .attr('type', 'url')
                        .val((pic === defaultInfo.img)? '': pic)
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
                    if((!parse_url(info.img) && info.img !== '') || !matchTime(info.time)) {
                        alert('incorrect');
                        return;
                    }

                    $(e.target.parentNode.nextSibling)
                        .find('.songTitle')
                        .html(info['name'] || defaultInfo.name)
                        .end()
                        .find('.songTime')
                        .html((info['time'] === '00:00')? defaultInfo.time :info['time'])
                        .end()
                        .find('.pic')
                        .attr('onError','this.src = "css/img/default.png"')
                        .attr('src', info['img']);
                    $(e.target.parentNode.nextSibling).css('display', 'block');
                    $(e.currentTarget.parentNode).remove();

                }).append(fieldSet);
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
        //create movement :marquee
        $(this).find('marquee').attr('scrollamount', '6');
    }
    return {
        insertContacts: insertContacts,
        refreshAttr: refreshAttr,
        createOptions: createOptions,
        dblClickContent: dblClickContent
    }
}(jQuery));

(function (data) {
    var contacts = data.contacts;
    for (var contact in contacts){
        if(contacts.hasOwnProperty(contact)){
            contacts[contact].img = 'img/' + contacts[contact].img;
            createContent.insertContacts(contacts[contact]);
        }
    }

}(data));


(function($) {
    var $dragging = null,
        offset_y,
        offset_x,
        coordinates = [],
        auxIndex,
        indexPos,
        alreadyClickedTimeOut,
        alreadyClicked = false,
        addCoordinates= function() {
            var leftTop = $(this).offset();
            coordinates.push({
                dom: $(this),
                left: leftTop.left,
                top: leftTop.top,
                right: leftTop.left + $(this).width(),
                bottom: leftTop.top + $(this).height()
            });
            if($dragging[0].id === this.id) {
                indexPos = coordinates.length - 1;
            }
        },
        move = function (pageY, pageX) {
            if ($dragging) {
                $dragging.offset({
                    top: pageY - offset_y,
                    left: pageX - offset_x
                });
            }
        },
        addAux = function (element, i) {
            $('.container>.aux').remove();
            if(i <= indexPos) {
                $('<ol>').addClass('aux').insertBefore(element);
            } else {
                $('<ol>').addClass('aux').insertBefore(element);
            }

        },
        wasDoubleClicked = function () {
            var el = $(this);
            if (alreadyClicked) {
                alreadyClicked = false; // reset
                clearTimeout(alreadyClickedTimeOut); // prevent this from happening
                // do what needs to happen on double click.
                return true;
            }else{
                alreadyClicked = true;
                alreadyClickedTimeOut = setTimeout(function(){
                    alreadyClicked = false; // reset when it happens
                },300); //dblclick tolerance here
            }
        },
        singleClick = function (e) {
            //delete hover
            $dragging = $(e.target.parentNode);
            // cursor coordinates
            offset_x = e.offsetX;
            offset_y = e.offsetY;
            //style
            $dragging.css('z-index', '10');
            $(document.body).css('cursor', 'move');
            $($dragging).css('position', 'absolute');
            $('.container').append($('<li>').addClass('phantom'));
            //start moving
            move(e.pageY, e.pageX);
            //add Coordinates to variable
            $(".content").each(addCoordinates);
            addCoordinates.call($('.phantom'));
            addAux(e.target.parentNode.nextSibling);
        };
    $(document.body).on("mousemove", function(e) {
        move(e.pageY ,e.pageX);
        for(var i =0; i < coordinates.length; i += 1){
            if (e.pageX >= coordinates[i].left && e.pageX <= coordinates[i].right) {
                if (e.pageY >= coordinates[i].top && e.pageY <= coordinates[i].bottom) {
                    if(auxIndex !== i) {
                        addAux(coordinates[i].dom, i);
                        auxIndex = i;
                    }

                }
            }
        }
    });
    $(document.body).on("mousedown", ".movement", function (e) {
        if(!wasDoubleClicked.call(this)) {
            singleClick(e);
        }
    });
    $(document.body).on("mouseup", function (e) {
        $(document.body).css('cursor', 'default');
        $($dragging).insertBefore($('.aux'));
        $('.aux').remove();
        $('.phantom').remove();
        createContent.refreshAttr();
        if($dragging) {
            $dragging.css('position', 'static');
            $dragging = null;
        }
        coordinates = [];
    });
}(jQuery));