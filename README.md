# TagIt
Yet another tagging plugin for jQuery. This tagging system allows the manipulation of tags that consist of a key/value pair, so data can easily be stored in a relational database. 

Looking to combine several tagging input controls on one page? Not a problem, TagIt allows you to place several tagging controls on the same page or even in the same form. Data retrieval is done with a single function call making it easy to send tags to the server.

Also included is the ability to use jQueryUi's AutoComplete mechanism to enhance your user's experience.

[Preview a Demo](http://www.renicorp.com/tagit)

##Setup
1. Download yourself a fresh copy of this magnificent plugin from the [releases section](https://github.com/puddinman13/TagIt/releases).
2. Include references to the javascript and css files to your site.

    ```
    <link href="tagIt-1.0.0.0.css" rel="stylesheet">
    <script type="text/javascript" src="tagIt-x.x.x.x.js"></script>
    ```

##Default Usage
1. Add a text input element to your site.

    ```
    <input type="text" id="tagIt" />
    ```

2. Apply TagIt to the input element.

    ```
    $('#tagIt').tagIt();
    ```

3.  Run the page and type in a tag you would like to save. Then hit Enter or Tab to see your tag created. You can remove tags by hitting the backspace key or clicking the 'X' next to the tag name.

4.  To get the list of tags from the control call the tags method.

    ```
    $('#tagIt').tags();
    ```

##Class Level Selector

You can now have multiple elements be controlled through a class level selector.

1. Add multiple text input elements to your site

    ```
    <input type="text" id="tagIt1" class="tagIt" />
    <input type="text" id="tagIt2" class="tagIt" />
    <input type="text" id="tagIt3" class="tagIt" />
    ```
2. Apply TagIt to the input elements

    ```
    $('.myClass').tagIt();
    ```
Note: Some functions require that they be called with a single element selector, or have different functionality depending on the type of selector used. Please see the function list below for details on how to properly make subsequent calls to the TagIt plugin.

##Advanced Initialization
This example demonstrates how to setup an element while override the default options. All of the available settings are in the Defaults / Configurable Properties documentation below.

    $('#tagIt').tagIt({
        allowDuplicates: false,
        autocomplete: { source: 'http://renicorp.com/Home/AutoCompleteOptions' },
        backspaceDeletesTags: false,
        defaultText: 'Enter Something Cool',
        delimiter: ',',
        duplicatesCaseSensitive: true,
        initialTags: [{ Pkid: 'TestPkid', Text: 'Initial Tag' }],
        maxLength: 10
    });

##Tag Object
The tag object consists of three properties: Pkid, Text, and EntityId. 
The Pkid does *not* have to be a Guid, it can be an int, string, date, or null.
The Text property is a string indicating the value that will be displayed to the user.
The EntityId field is a storage location indicating the id of the element the tag is located in. This value is assigned once the tag is added. If a value is passed it for this, it will be overwritten. It cannot be manually assigned.

##Additional Functions
1. Add Tag

    The addTag function accepts a single object representing the tag to add. A tag object is returned and will have a value for the EntityId. Note: If you call this method with a class level selector ($('.myClass')), it will return an array of tag objects.

    ```
    var addedTag = $('#tagIt').addTag({ Pkid: 'Test', Text: 'Testing Add'});
    -OR-
    var addedTags = $('.myClass').addTag({Pkid: 'Test'. Text: 'Testing Add'});
    ```
    
2. Import Tags

    The importTags function accepts an array of objects representing the tags to be added. An array of tag objects is returned.

    ```
    var tags = [{ Pkid: 'Test1', Text: 'Testing Import 1'}, { Pkid: 'Test2', Text: 'Testing Import 2'}];
    var addedTags = $('#tagIt').importTags(tags);
    ```
3. Get Tags By Pkid

    The getTagsByPkid function accepts a single pkid parameter. This will return an array of tag objects representing the tags that contained the pkid that was supplied. If the control is allowed to have duplicates and there were more than one tag with the same pkid, they will all be returned. This can be used to subsequently delete tags. Note: This can only be called with a single element selector ($('#tagIt')).
    
    ```
    $('#tagIt').addTag({Pkid: 'Test', Text: 'Test'});
    var foundTags = $('#tagIt').getTagsByPkid('Test');
    $('#tagIt').deleteTag(foundTags[0]);
    ```

4. Delete Tag

    The deleteTag function can be called with any tag object that was returned from the addTag, importTags, or getTagsByPkid functions. Note: This can only be called with a single element selector ($('#tagIt')).
    
    ```
    var addedTag = $('#tagIt').addTag({ Pkid: 'Test', Text: 'Testing Add'});
    $('#tagIt').deleteTag(addedTag);
    ```

5. Valid Tag

    The isValidTag function returns a true of false value indicating whether the tag can be successfully added or not. This is also automatically called prior to adding any tags. Note: This can only be called with a single element selector ($('#tagIt')).

    ```
    $('#tagIt').isValidTag({ Pkid: 'Test', Text: 'Testing Import'});
    ```
    
6. Tags

    Returns an array of tags that currently exist in the selected control. If a class level selector ($('.myClass')) is used, this will return all tags from all controls that contain that class.

    ```
    var enteredTags = $('#tagIt').tags();
    ```

7. Clear

    Clears all the tags from a control. This works with both an element and a class level selector.
    
    ```
    $('#tagIt').tagIt('clear');
    ```

##Defaults / Configurable Properties

These are all of the available option overrides. The default value is in italics with the required type in parenthesis.

1. **allowDuplicates**: *true* (true or false) - When this value is switched to false, user's will not be able to enter duplicate tags. A duplicate is indicated by a matching key and a matching value. The value will be compared based on the duplicatesCaseSesitive property.
2. **autocomplete**: *null* (autocomplete settings object) - See jQuery Ui Autocomplete documentation for a full list of options. The most important one is source. This must be set for this feature to work. You can use strings, objects, or a url.
3. **duplicatesCaseSensitive**: *false* (true or false) - Allows the comparison for a duplicate value to take into account case. Ex: This allows control over whether 'Test' and 'test' should be a duplicate.
4. **backspaceDeletesTags**: *true* (true or false) - Indicates if pressing backspace will delete exisiting tags if the input box is blank.
5. **defaultText**: *'Add a Tag'* (string) - This can be any string you like. It's the default text in the box before the user clicks in it.
6. **delimiter**: *null* (character) - This can be any single character. When this character is pressed it will take on the same affect as pressing Enter or Tab.
7. **initialTags**: *null* (Array of Tag objects) - This can be used to default in some tags from the client-side.
8. **maxLength**: *null* (int) - Max length of the text the user can enter.
