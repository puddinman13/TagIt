# TagIt
Yet another tagging plugin for jQuery. This tagging system allows the manipulation of tags that consist of a key/value pair, so data can easily be stored in a relational database. 

Looking to combine several tagging input controls on one page? Not a problem, TagIt allows you to place several tagging control on the same page or even in the same form. Data retrieval is done with a single function call making it easy to send tags to the server.

Also included is the ability to jQueryUi's AutoComplete mechanism to enhance your user's experience.

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

3.  Type in a tag you would like to save. Then hit Enter or Tab to see your tag created. You can remove tags by typing backspace or clicking the 'X' next to the tag name.

4.  To utilize the list of tags

    ```
    $('#tagIt').tags();
    ```

##Advanced Usage
The steps all the same as in the simple usage example, except this example shows all the available settings.

    ```
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
    ```

##Tag Object
The tag object consists of a Pkid property and a Text property. The pkid does *not* have to be a Guid, it can be an int, string, or null as well. The text property should be a string.

##Additional Functions
1. Add Tag

    ```
    var tag = [{ Pkid: 'Test', Text: 'Testing Import'}];
    $('#tagIt').addTag(tag);
    ```
    
2. Import Tags

    ```
    var tags = [{ Pkid: 'Test', Text: 'Testing Import'}];
    $('#tagIt').importTags(tags);
    ```
    
3. Valid Tag

    Returns a true of false value indicating whether the tag can be successfully added or not

    ```
    var tag = [{ Pkid: 'Test', Text: 'Testing Import'}];
    $('#tagIt').isValidTag(tag);
    ```
    
4. Tags

    Returns an array or tags that currently exist in control.

    ```
    $('#tagIt').tags();
    ```

##Defaults / Configurable Properties

1. **allowDuplicates**: true (true or false) - When this value is switched to false, user's will not be able to enter duplicate tags. A duplicate is indicated by a matching key and a matching value. The value will be compared based on the duplicatesCaseSesitive property.
2. **autocomplete**: null (autocomplete settings object) - See jQuery Ui Autocomplete documentation for a full list of options. The most important one is source. This must be set for this feature to work. You can use strings, objects, or a url.
3. **duplicatesCaseSensitive**: false (true or false) - Allows the comparison for a duplicate value to take into account case. Ex: This allows control over whether 'Test' and 'test' should be a duplicate.
4. **backspaceDeletesTags**: true (true or false) - Indicates if pressing backspace will delete exisiting tags if the input box is blank.
5. **defaultText**: 'Add a Tag' (string) - This can be any string you like. It's the default text in the box before the user clicks in it.
6. **delimiter**: null (character) - This can be any single character. When this character is pressed it will take on the same affect as pressing Enter or Tab.
7. **initialTags**: null (Array of Tag objects) - This can be used to default in some tags from the client-side.
8. **maxLength**: null (int) - Max length of the text the user can enter.
