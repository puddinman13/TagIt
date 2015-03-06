/*
    TagIt 1.0.1.0
    Documentation: http://renicorp.com/tagit
    Author: Nathan Renico (nathan@renicorp.com)
*/

(function(jQuery) {
    var tags = new Array();
    var settings = new Array();
    var delimiter = new Array();
    var controlIdMap = new Array();

    function generateUuid() {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function lookupControl(controlId) {
        return jQuery(this.document).find('#' + controlIdMap[controlId] + ' input');
    }

    function tagExists(controlPkid, tag) {
        var tagExistsFlag = false;

        tags[controlPkid].forEach(function (storedTag) {
            if (settings[controlPkid].duplicatesCaseSensitive &&
                storedTag.Pkid === tag.Pkid && storedTag.Text === tag.Text) {
                tagExistsFlag = true;
            }
            else if (!settings[controlPkid].duplicatesCaseSensitive &&
                     storedTag.Pkid === tag.Pkid && storedTag.Text.toLowerCase() === tag.Text.toLowerCase())
                tagExistsFlag = true;
        });

        return tagExistsFlag;
    };

    function createTagItControls(parentControl, controlPkid) {
        var outterDiv = jQuery('<div></div>', {
            id: controlPkid,
            'class': 'tagit'
        }).insertAfter(parentControl);

        var innerDiv = jQuery('<div></div>').appendTo(outterDiv);

        var input = jQuery('<input>', {
            id: controlPkid + '_Input',
            type: 'text',
            'data-default': settings[controlPkid].defaultText,
            maxLength: settings[controlPkid].maxLength
        }).appendTo(innerDiv);

        input.val(input.data('default'));

        return outterDiv;
    }

    function createTag(text, pkid) {
        return { Text: text.trim(), Pkid: pkid === undefined ? null : pkid };
    }

    function isValidInput(input) {
        var isNotEmpty = input.trim() !== '';

        return isNotEmpty;
    }

    jQuery.fn.isValidTag = function (tag) {
        var controlPkid = jQuery(this).attr('id').replace('_Input', '');
        var isDuplicate = settings[controlPkid].allowDuplicates ? false : tagExists(controlPkid, tag);

        return !isDuplicate;
    }

    function addEventHandlersToControls(inputControl, controlPkid) {
        inputControl.focus(function () {
            var value = jQuery(this).val();
            if (value === settings[controlPkid].defaultText)
                jQuery(this).val('');
        });

        inputControl.blur(function () {
            var control = jQuery(this);

            if (control.val() !== '') {
                control.addTag(createTag(control.val()));
                control.focus();
            } else {
                control.val(settings[controlPkid].defaultText);
            }

            return false;
        });

        inputControl.keypress(function (event) {
            jQuery(this).removeClass('error');
            var delimiterForControl = delimiter[jQuery(event.target).attr('id').replace('_Input', '')];

            if ((event.which === 13 ||
                 (delimiterForControl && event.which === delimiterForControl.charCodeAt(0)))
                && isValidInput(this.value)) {
                event.preventDefault();

                jQuery(this).addTag(createTag(this.value));
                return false;
            }

            return true;
        });

        settings[controlPkid].backspaceDeletesTags && inputControl.keydown(function (event) {
            jQuery(this).removeClass('error');

            if (event.keyCode === 8 && this.value === '') {
                event.preventDefault();

                var tagPkid = jQuery(this).closest('.tagit').find('.tag').last().attr('id');
                inputControl.deleteTag(inputControl.findTag(tagPkid));
            }
        });
    }

    function setupAutocomplete(inputControl, controlPkid) {
        var controlSettings = settings[controlPkid];
        if (controlSettings.autocomplete === null) return;

        var options = jQuery.extend({
            autoFocus : false,
            focus: function () { return false; }
        }, controlSettings.autocomplete);

        // Ensure that jQueryUi's AutoComplete exists
        if (jQuery.ui.autocomplete !== undefined) {
            $(inputControl).autocomplete(options);
            $(inputControl).bind('autocompleteselect', function (event, ui) {
                var tag = { Pkid: ui.item.value, Text: ui.item.label };
                $(inputControl).addTag(tag);
                return false;
            });
        }
    }

    jQuery.fn.tagIt = function (options) {
        var currentControl = jQuery(this);
        currentControl.hide();
        var controlPkid = generateUuid();

        controlIdMap[currentControl.attr('id')] = controlPkid;
        tags[controlPkid] = new Array();
        settings[controlPkid] = jQuery.extend({}, jQuery.fn.tagIt.defaults, options);
        delimiter[controlPkid] = settings[controlPkid].delimiter;

        var controls = createTagItControls(this, controlPkid);
        var inputControl = controls.find('input');

        addEventHandlersToControls(inputControl, controlPkid);
        setupAutocomplete(inputControl, controlPkid);
        currentControl.importTags(settings[controlPkid].initialTags);

        return controls;
    };

    jQuery.fn.importTags = function (importTags) {
        if (!importTags) return;
        
        var control = lookupControl(jQuery(this).attr('id'));

        importTags.forEach(function (tag) {
            control.addTag(tag);
        });

        control.blur();
    }

    jQuery.fn.addTag = function (tag) {
        var control = jQuery(this);

        if (!control.isValidTag(tag)) {
            control.addClass('error');
        } else {
            tag.ElementId = generateUuid();
            tags[control.attr('id').replace('_Input', '')].push(tag);

            jQuery('<span>', { id: tag.ElementId }).addClass('tag').append(
                jQuery('<span>').text(tag.Text).append('&nbsp;&nbsp;'),
                jQuery('<a>', {
                    href: '#',
                    title: 'Delete',
                    text: 'X'
                }).click(function() {
                    return jQuery('#' + tag.ElementId).parent().deleteTag(tag);
                })
            ).insertBefore(control.parent());

            control.val('');
        }
    };

    jQuery.fn.findTag = function (elementPkid) {
        var controlPkid = jQuery(this).attr('id').replace('_Input', '');
        var foundTag;

        tags[controlPkid].forEach(function (tag) {
            if (tag.ElementId === elementPkid)
                foundTag = tag;
        });

        return foundTag;
    };

    jQuery.fn.deleteTag = function (tag) {
        var controlPkid = jQuery(this).attr('id').replace('_Input', '');

        var index;
        while ((index = tags[controlPkid].indexOf(tag)) > -1) {
            tags[controlPkid].splice(index, 1);
        }

        jQuery('#' + tag.ElementId).remove();
    }

    jQuery.fn.tags = function () {
        var controlPkid = jQuery(this).attr('id');
        var convertedTags = new Array();

        tags[controlPkid].forEach(function (tag) {
            convertedTags.push({ Pkid: tag.Pkid, Text: tag.Text });
        });

        return convertedTags;
    };

    jQuery.fn.tagIt.defaults = {
        allowDuplicates: true,
        autocomplete: null,
        backspaceDeletesTags: true,
        defaultText: 'Add a Tag',
        delimiter: null,
        duplicatesCaseSensitive: false,
        initialTags: null,
        maxLength: null
    };
}(jQuery));
