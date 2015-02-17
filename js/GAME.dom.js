GAME.dom = (function() {
    var $ = Sizzle;

    function hasClass(el, clsName) {
        var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
        return regex.test(el.className);
    }

    function addClass(el, clsName) {
        if (!hasClass(el, clsName)) {
            el.className += " " + clsName;
        }
    }

    function removeClass(el, clsName) {
        var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
        el.className = el.className.replace(regex, " ");
    }
		
		function empty (el) {
			while (el.hasChildNodes()) {el.removeChild(node.firstChild);}
		}

    function bind(element, event, handler) {
        if (typeof element == "string") {
            element = $(element)[0];
        }
        element.addEventListener(event, handler, false)
    }
		
		function bindAll(els, event, handler) {
			var i;
			for (i = 0; i < els.length; i++) {
				bind(els[i], event, handler);
			}
		}
		
		function hide(els) {
			var i;
			for (i = 0; i < els.length; i++) {
				if (els[i].style) {
					els[i].style.display = "none";
				}
			}
		}
		
		function show(els, display) {
			var newDisplay = display || "block";
			var i;
			for (i = 0; i < els.length; i++) {
				if (els[i].style) {
					els[i].style.display = newDisplay;
				}
			}
		}

    return {
        $ : $,
        hasClass : hasClass,
        addClass : addClass,
        removeClass : removeClass,
				empty: empty,
				hide: hide,
				show: show,
        bind : bind,
				bindAll: bindAll
    };
}());
