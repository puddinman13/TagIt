# TagIt
Yet another tagging plugin for jQuery. This tagging system allows the manipulation of tags that consist of a key/value pair, so data can easily be stored in a relational database. 

Looking to combine several tagging input controls on one page? Not a problem, TagIt allows you to place several tagging control on the same page or even in the same form. Data retrieval is done with a single function call that returns an array containing your tags with their key/value pairs. This data can easily be sent to the server.

Also included is the ability to jQueryUi's AutoComplete mechanism to enhance your user's experience.

##Setup
1. Download yourself a fresh copy of this magnificent plugin.
2. Include references to the javascript and css files to your site.
````
<link href="tagIt-1.0.0.0.css" rel="stylesheet">
<script type="text/javascript" src="tagIt-1.0.0.0.js"></script>
````

##Simple Usage
1. Add a text input element to your site.

````<input type="text" id="tagIt" />````

2. Apply TagIt to the input element.

````
$('#tagIt').tagIt();
````

3.  Type in a tag you would like to save. Then hit Enter or Tab to see your tag created. You can remove tags by typing backspace or clicking the 'X' next to the tag name.

4.  To utilize the list of tags

```` $('#tagIt').tags(); ````


##Advanced Setup

##Defaults / Configurable Properties

1. allowDuplicates: true (true or false) - When this value is switched to false, user's will not be able to enter duplicate tags. A duplicate is indicated by a matching key and a matching value. The value will be compared based on the duplicatesCaseSesitive property.
2. duplicatesCaseSensitive: false (true or false) - Allows the comparison for a duplicate value to take into account case. Ex: This allows control over whether 'Test' and 'test' should be a duplicate.
3. backspaceDeletesTags: true (true or false) - Indicates if pressing backspace will delete exisiting tags if the input box is blank.
4. defaultText: 'Add a Tag' (any string) - 

##Functions
