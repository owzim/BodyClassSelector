BodyClassSelector
=================

* [Intro](#intro)
* [Installation](#installation)
* [Usage](#usage)
* [Settings](#settings)
* [Methods](#methods)
* [Todo/Roadmap](#todoroadmap)

## Intro

BodyClassSelector lets you add a list of checkboxes and radio buttons to the side of a page, to add and remove defined CSS body classes.

During the revision process of webdesign, it can be helpful to clients if you give them a set of variants in styling.

So in your CSS you could do something like this:

```css
.sidebar {
	width: 30%
}

.larger-sidebar .sidebar {
	width: 40%
}

.smaller-sidebar .sidebar {
	width: 20%
}
```

With the BodyClassSelector you would add those two additional classes ```larger-sidebar``` and ```smaller-sidebar``` to the optinonsList, which you then can toggle to show the variants.

You could even use it for debugging, like make your grid elements more visible for testing, or show your clients how it would look in old versions of Internet Explorer.

```css
.grid-debug .container {
	background: red !important;
}

.grid-debug .row {
	background: blue !important;
}

.grid-debug .span {
	background: red !important;
}

.some-element {
	/* fancy css gradient stuff */
}

.oldie .some-element {
	background: black;
}
```

## Installation

Include script *after* the **jQuery** library:

```html
<script src="/your-js-folder/jquery.obcs.js"></script>
```

## Usage

Initialize with the *list of options/body classes* (Array) you want to toggle and and optional *settings* (Object):

```javascript
$.obcs.init(classList, settings);
```

```classList``` must be of the following structure:

```javascript
var classList = [
	// class group
	{
		title: "My classes", // title/heading of the group
		type: "checkbox", // can be "checkbox" or "radio"
		elements: [ // the actual input elements
			{
				// input label - optional, when missing, className is used
				title: "Handsome class",

				// actual class name to be added to or removed from the body
				className: "handsome-class",

				// sets the input to checked, and automatically applies this class to the body
				checked: true
			},
			{
				// ...
			}
		]
	},
	{
		// another group of classes
	}

]
```

## Settings

### Hit area width

The width of the hit area, which triggers the list to show.

```javascript
hitAreaWidth: "20px"
```

### Prevent JS based styling

By default, the list is styled via JS with some basic styles, so no additional CSS is needed. If you want custom CSS, you might want to set this to ```true``, to prevent JS based styling so you don't have to mess around with loads of ```!important```s

```javascript
preventStyling: false
```

### Titles prefix

Prefix of the labels titles. It's followed by the respective class name.

```javascript
titlesPrefix: "Class: "
```


## Methods

### Show

Manually show the classes list. It happens automatically, when the mouse cursor hits the left side (determined by ```hitAreaWidth```) of the browser's content area.

```javascript
$.obcs.show()
```

### Hide

Manually hide the classes list. It happens automatically, when the mouse cursor leaves the classes list.

```javascript
$.obcs.hide()
```

### Pin

Manually pin the classes list. It happens automatically, when you double click it.

```javascript
$.obcs.pin()
```

### Pin

Manually unpin the classes list. It happens automatically, when you double click it, and it was pinned before.

```javascript
$.obcs.unpin()
```

## Todo/Roadmap

* enable selected classes to be saved via cookies/local storage so users don't have to reselect them when visiting an new page on your site.
* list all non-custom body classes in a new class group (bodyclasses from the source, or those added by Modernizr.js)