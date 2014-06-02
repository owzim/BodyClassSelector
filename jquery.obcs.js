(function ($, window, undefined) {

	$.obcs = (function() {
		// private vars
		var	_$body,
			_$wrapper,
			_$hitArea,
			_allClasses = [],
			_settings,
			_optionsList,
			_isPinned = false,
			_isVisible = false,
			_elID = "jquery-obcs",
			_css = {
				wrapper:		{
					position: "fixed",
					fontSize: "12px",
					transition: "opacity 0.3s",
					opacity: 0,

					background: "black",
					backgroundColor: "rgba(0,0,0,0.75)",
					borderRight: "10px solid rgba(0,0,0,0.2)",
					color: "white",

					backgroundClip: "padding-box",
					padding: "1.4em 2em 1.4em 1.4em",
					width: "auto",
					height: "100%",
					top: "0",
					zIndex: "10000000",
					overflow: "auto"
				},
				hitArea:		{
					position: "fixed",
					fontSize: "12px",
					background: "none",
					color: "white",
					width: "10px",
					height: "100%",
					top: "0",
					textIndent: "-9999",
					left: 0
				}
			},
			_defaultSettings = {
				width: "200px",
				hitAreaWidth: "20px",
				preventStyling: false,
				titlesPrefix: "Class: "
			},

			// private methods
			_methods = {

				/**
				 * creates the whole thing and adds it to the body
				 * @return {void}
				 */
				_create: function() {

					_$wrapper = $('<div></div>').attr({
						id: _elID,
						"class": _elID
					});
					_$hitArea = $('<div></div>').attr({
						"class": "hitArea"
					});

					var	$wrapper = _$wrapper,
						$hitArea = _$hitArea;

					$wrapper.prepend($hitArea);
					_$body.append($wrapper);

					if(_settings.preventStyling !== true) {
						$wrapper.css(_css.wrapper);
						$hitArea.css(_css.hitArea);
					}

					this._createOptions();
					this._createEventHandlers();
					this._applyClassesToBody();
					this._applyClassesFromBody();
				},

				/**
				 * creates all the option groups, and add it to the wrapper
				 * @return {void}
				 */
				_createOptions: function() {
					var	ol = _optionsList,
						len = ol.length,
						c,
						$options = $("<div></div>");

					for (var i = 0; i < len; i++) {
						c = ol[i];

						$options.append(this._createOptionGroup(c, i));
					}

					_$wrapper.append($options);
				},


				/**
				 * creates a single option groups, and returns it
				 * @param  {object} optionGroup
				 * @param  {int} groupIndex
				 * @return {jQueryElement}
				 */
				_createOptionGroup: function(optionGroup, groupIndex) {
					var	og = optionGroup,
						oge = og.elements,
						len = oge.length,
						c,
						$optionGroup = $("<div></div>"),
						$title = $("<div></div>").html(optionGroup.title).attr("class", "title");

					$optionGroup.append($title).attr("class", "OptionGroup");

					if(_settings.preventStyling !== true) {
						$title.css({color: "white", fontWight: "bold", margin: "1em 0"});
					}

					for (var i = 0; i < len; i++) {
						c = oge[i];

						$optionGroup.attr("id", "OptionGroup" + groupIndex);

						$optionGroup.append(
							this._createOption(
								c,
								optionGroup,
								$optionGroup
							)
						);
					}

					this._applyDefaultCheckForRadioButtonGroup(optionGroup, $optionGroup);

					return $optionGroup;
				},

				/**
				 * if an obtiongroup of type radio has not default value checked, the firs one is checked
				 * @param  {object} optionGroup
				 * @param  {jQueryElement} $optionGroup
				 * @return {void}
				 */
				_applyDefaultCheckForRadioButtonGroup: function(optionGroup, $optionGroup) {

					if(optionGroup.type === "checkbox") return;

					var checkedArr = [];

					$(optionGroup.elements).each(function(i, e) {
						if(e.checked === true) {
							checkedArr.push(i);
						}
					});

					if(checkedArr.length > 1 || checkedArr.length === 0) {
						$optionGroup.find("input").prop("checked");
						$optionGroup.find("input").eq(0).prop("checked", "checked");
					}
				},


				/**
				 * creates a single option (label with input) and returns it as a jQueryElement
				 * @param  {object} option
				 * @param  {object} optionGroup
				 * @param  {jQueryElement} $optionGroup
				 * @return {jQueryElement}
				 */
				_createOption: function(option, optionGroup, $optionGroup) {

					var	$label = $("<label></label>"),
						$input = $("<input></input>")
							.attr("type", optionGroup.type)
							.attr("value", option.className);

					$label.attr("title", _settings.titlesPrefix + option.className);

					if (optionGroup.type === "radio") {
						$input.attr("name", $optionGroup.attr("id"));
					}

					$label
						.append(
							$input
						).append(
							" " + (option.title || option.className)
						);

					if(_settings.preventStyling !== true) {
						$label.css(
							"display", "block"
						);
					}

					if(option.checked === true) $input.prop("checked", "checked");

					$input.data('option', option);

					_allClasses.push(option.className);

					return $label;
				},


				/**
				 * creates all the mouse event handlers for hiding, pinning and unpinning $wrapper
				 * @return {void}
				 */
				_createEventHandlers: function() {

					// creating local refs
					var	$radios = _$wrapper.find("input[type=radio]"),
						$checkboxes = _$wrapper.find("input[type=checkbox]");

					_$hitArea
						.on("mouseover", $.proxy(function() {
							this.show();
						}, this));

					_$wrapper
						.on("mouseleave", $.proxy(function() { // "mouseleave" rather than "mouseout", because it works better
							this.hide();
						}, this));

					_$wrapper
						.on("dblclick", $.proxy(function() {
							this._toggleIsPinned();
						}, this));

					// making text unselectable cross browser, to prevent the double click for pinning to select text
					_$wrapper
						.attr('unselectable', 'on')
						.css('user-select', 'none')
						.on('selectstart', false);

					$radios
						.on("click", $.proxy(function(e) {
							$t = $(e.target);
							this._check($(e.target));
							if($t.data("option").callback !== undefined) $t.data("option").callback($t, $t.data("option"));
						}, this));

					$checkboxes
						.on("click", $.proxy(function(e) {
							var $t = $(e.target);
							// TODO, encapsulate into extra method
							if($t.is(":checked")) {
								_$body.addClass($t.val());
							} else {
								_$body.removeClass($t.val());
							}
							if($t.data("option").callback !== undefined) $t.data("option").callback($t, $t.data("option"));
						}, this));
				},


				/**
				 * collects all inputs
				 * @return {jQueryElement(s)}
				 */
				_getAllInputs: function() {
					return $(_$wrapper.find("input[type=radio]")).add(_$wrapper.find("input[type=checkbox]"));
				},


				/**
				 * collects all selected/checked inputs
				 * @return {jQueryElement(s)}
				 */
				_getCheckedInputs: function() {
					return $(_$wrapper.find("input[type=radio]:checked")).add(_$wrapper.find("input[type=checkbox]:checked"));
				},


				/**
				 * collects all selected/checked classes
				 * @return {Array}
				 */
				_getCheckedClasses: function() {
					var	$checkedInputs = this._getCheckedInputs(),
						checkedClasses = [];
					$checkedInputs.each(function() {
						checkedClasses.push($(this).val());
					});
					return checkedClasses;
				},


				/**
				 * applies all selected classes
				 * @return {void}
				 */
				_applyClassesToBody: function() {
					_$body.addClass(this._getCheckedClasses().join(" "));
				},


				/**
				 * applies all body classes to inputs
				 * @return {void}
				 */
				_applyClassesFromBody: function() {
					this._getAllInputs().each($.proxy(function(i, e) {
						var $e = $(e);
						if(_$body.hasClass($e.val())) {
							this._check($e);
						}
					}, this));
				},


				/**
				 * sets the given element $e to status "checked", takes radio siblings in
				 * consideration, they must be unchecked, classes are added to the body as well
				 * @param  {jQueryElement(s)} $e
				 * @return {void}
				 */
				_check: function($e) {
					// TODO: hacky, hacky, hacky and dirrrty
					if($e.attr("type") === "radio") {
						$e.closest(".OptionGroup").find("input").each(function(i, e) {  // TODO, hacky
							$(e).prop("checked");
							_$body.removeClass($(e).val());
						});
					}
					$e.prop("checked", "checked");
					_$body.addClass($e.val());
				},


				/**
				 * adds/removes the "is-visible" class from $wrapper
				 * @return {void}
				 */
				_toggleIsVisibleClass: function() {
					_$wrapper.toggleClass("is-visible", _isVisible);
				},


				/**
				 * toggles the isPinned value and adds/removes the class to/from $wrapper accordingly
				 * @return {void}
				 */
				_toggleIsPinned: function() {
					// console.log("_isVisible ", _isVisible);
					if(_isVisible) {
						// console.log("_toggleIsPinned");
						_isPinned = !_isPinned;
						this._toggleIsPinnedClass();
					}
				},


				/**
				 * adds/removes the "is-pinned" class from $wrapper
				 * @see _toggleIsPinned()
				 * @return {void}
				 */
				_toggleIsPinnedClass: function() {
					_$wrapper.toggleClass("is-pinned", _isPinned);
				},

				/**
				 * initialized everything
				 * @param  {object} optionsList
				 * @param  {object} settings
				 * @return {void}
				 */
				init: function(optionsList, settings) {
					_settings = $.extend(_defaultSettings, settings || {});
					_optionsList = optionsList;
					_$body = $('body');
					_methods._create();
					return this;
				},


				/**
				 * shows $wrapper
				 * @return {void}
				 */
				show: function() {
					_isVisible = true;
					_methods._toggleIsVisibleClass();
					_$wrapper.css({
						opacity: 1,
						pointerEvents: 'auto' // reactivate pointer events, because we need 'mouse out' to hide it
					});
					return this;
				},


				/**
				 * hides $wrapper, but ony if is not pinned
				 * @return {void}
				 */
				hide: function() {
					// TODO: when wrapper is 0 opaque, it still sits on top of the page, so other mouse events are not working well
					if(_isPinned !== true) {
						_isVisible = false;
						_methods._toggleIsVisibleClass();
						_$wrapper.css({
							opacity: 0,
							pointerEvents: 'none' // prevent overlaying wrapper disabling mouse events beneath it
						});
						_$hitArea.css({
							pointerEvents: 'auto'  // reactivate pointer events, because they're disabled by parent
						});
					}
					return this;
				},


				/**
				 * sets the isPinned value to true and adds the "is-pinned" class to $wrapper
				 * @return {void}
				 */
				pin: function() {
					_isPinned = true;
					_methods._toggleIsPinnedClass();
					return this;
				},


				/**
				 * sets the isPinned value to false and removes the "is-pinned" class from $wrapper
				 * @return {void}
				 */
				unpin: function() {
					_isPinned = false;
					_methods._toggleIsPinnedClass();
					return this;
				},


				/**
				 * collect all public methods an returns them in an object
				 * @return {object} an object containing all the public methods
				 */
				_getPublicMethods: function() {
					var rtn = {};
					for (var i in this) {
						// if method does not start with an underscore, it's public, so add it
						if(i.indexOf("_") !== 0) {
							rtn[i] = this[i];
						}
					}
					return rtn;
				}
			};

		// public methods
		return _methods._getPublicMethods();
	})();

})(jQuery, window);