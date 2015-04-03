/*
    TagIt 1.0.3.0
    Documentation: http://renicorp.com/tagit
    Author: Nathan Renico (nathan@renicorp.com)
    Updated: March 2015
*/

(function(jQuery) {
    var tags = new Array();
    var settings = new Array();
    var delimiter = new Array();

    function generateUuid() {
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
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

        var width = settings[controlPkid].width;
        if (width !== undefined && width != null)
            outterDiv.attr('style', 'width: ' + width + ';');

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

    function findTag(controlPkid, elementPkid) {
        var foundTag;

        tags[controlPkid].forEach(function (tag) {
            if (tag.ElementId === elementPkid)
                foundTag = tag;
        });

        return foundTag;
    };

    function addEventHandlersToControls(inputControl, controlPkid) {
        inputControl.focus(function () {
            var value = jQuery(this).val();
            if (value === settings[controlPkid].defaultText)
                jQuery(this).val('');
        });

        inputControl.blur(function () {
            if (inputControl.val() !== '') {
                if ($('[data-tagitid="' + controlPkid + '"]').addTag(createTag(inputControl.val()))) {
                    inputControl.val('');
                }
                inputControl.focus();
            } else {
                inputControl.val(settings[controlPkid].defaultText);
            }

            return false;
        });

        inputControl.keypress(function (event) {
            jQuery(this).removeClass('error');
            var delimiterForControl = delimiter[controlPkid];

            if ((event.which === 13 ||
                 (delimiterForControl && event.which === delimiterForControl.charCodeAt(0)))
                && isValidInput(this.value)) {
                event.preventDefault();

                if (jQuery('[data-tagitid="' + controlPkid + '"]').addTag(createTag(this.value))) {
                    inputControl.val('');
                }
                return false;
            }

            return true;
        });

        settings[controlPkid].backspaceDeletesTags && inputControl.keydown(function (event) {
            jQuery(this).removeClass('error');

            if (event.keyCode === 8 && this.value === '') {
                event.preventDefault();

                var tagPkid = jQuery(this).closest('.tagit').find('.tag').last().attr('id');
                inputControl.deleteTag(findTag(controlPkid, tagPkid));
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
            jQuery(inputControl).autocomplete(options);
            jQuery(inputControl).bind('autocompleteselect', function (event, ui) {
                var tag = { Pkid: ui.item.value, Text: ui.item.label };
                jQuery('[data-tagitid="' + controlPkid + '"]').addTag(tag);
                inputControl.val('');
                return false;
            });
        }
    }

    jQuery.fn.tagIt = function (options) {
        var currentControl = jQuery(this);
        var controlPkid = generateUuid();
        currentControl.attr('data-tagitid', controlPkid).hide();

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

    jQuery.fn.isValidTag = function (tag) {
        var controlPkid = jQuery(this).data('tagitid');
        var isDuplicate = settings[controlPkid].allowDuplicates ? false : tagExists(controlPkid, tag);

        return !isDuplicate;
    }

    jQuery.fn.addTag = function (tag) {
        var control = jQuery(this);
        var inputControl = jQuery('#' + control.data('tagitid') + '_Input');

        if (!control.isValidTag(tag)) {
            inputControl.addClass('error');
            return false;
        } else {
            tag.ElementId = generateUuid();
            tags[control.data('tagitid')].push(tag);

            jQuery('<span>', { id: tag.ElementId }).addClass('tag').append(
                jQuery('<span>').text(tag.Text).append('&nbsp;&nbsp;'),
                jQuery('<a>', {
                    href: '#',
                    title: 'Delete',
                    text: 'X'
                }).click(function() {
                    return jQuery('#' + tag.ElementId).parent().deleteTag(tag);
                })
            ).insertBefore(inputControl.parent());
            return true;
        }
    };

    jQuery.fn.importTags = function (importTags) {
        if (!importTags) return;

        var control = jQuery(this);
        importTags.forEach(function (tag) {
            control.addTag(tag);
        });

        control.blur();
    }

    jQuery.fn.deleteTag = function (tag) {
        if (tag === undefined) return;
        var controlPkid = jQuery(this).attr('id').replace('_Input', '');

        var index;
        while ((index = tags[controlPkid].indexOf(tag)) > -1) {
            tags[controlPkid].splice(index, 1);
        }

        if (!tag.ElementId) return;
        jQuery('#' + tag.ElementId).remove();
    }

    jQuery.fn.tags = function () {
        var controlPkid = jQuery(this).data('tagitid');
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
        maxLength: null,
        width: null
};
}(jQuery));