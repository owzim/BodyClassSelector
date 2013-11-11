BodyClassSelector
=================

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

## Installation

Include script *after* the **jQuery** library:

```html
<script src="/your-js-folder/BodyClassSelector.js"></script>
```

## Usage

Initialize with the *list of options/body classes* (Array) you want to toggle and and optional *settings* (Object):

```javascript
BodyClassSelector.init(optionsList, settings);
```

```optionsList``` must be of the following structure:

```javascript
var optionsList = [
	// options group
	{
		title: "My classes", // title/heading of the group
		type: "checkbox", // can be "checkbox" or "radio"
		elements: [ // the actual input elements
			{
				title: "Handsome class", // input label - optional, when missing, className is used
				className: "handsome-class" // actual class name to be added to or removed from the body
			},
			{
				// ...
			}
		]
	},
	{
		// ...
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

By default, the list is styled via JS with some basic styles, so no additional CSS is needed. If you want custom CSS, you might want to set this to ```true```, to prevent JS based styling so you don't have to mess around with loads of ```!important```s

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

Manually show the options list. It happens automatically, when the mouse cursor hits the left side (determined by ```hitAreaWidth```) of the browser's content area.

```javascript
BodyClassSelector.show()
```

### Hide

Manually hide the options list. It happens automatically, when the mouse cursor leaves the options list.

```javascript
BodyClassSelector.hide()
```

### Pin

Manually pin the options list. It happens automatically, when you double click it.

```javascript
BodyClassSelector.pin()
```

### Unpin

Manually unpin the options list. It happens automatically, when you double click it, and it was pinned before.

```javascript
BodyClassSelector.unpin()
```