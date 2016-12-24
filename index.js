/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//entry.js
	 //必须使用./ 这种path
	var domSP=__webpack_require__(2);
	var lazy=__webpack_require__(3);
	__webpack_require__(4);
	document.write('It works');

	var lazy=new lazy.Lazy('diff');

	//onload != domReady  !!!! onload是包括图片其他文件加载完成之后。
	//domReady仅仅是文档
	window.onload=function(){
	    var selectbox=document.getElementById('language');
	    
	    var  view=domSP.getViewport(window);
	    var rect=domSP.getBoundingClientRect(selectbox);
	    var pos=domSP.getElementPosSize(selectbox);
	    var offsets=domSP.getScrollOffsets(window);

	    console.log('Offset: ',offsets.left,offsets.top);
	    console.log('selectbox position',pos.left,pos.top,pos.width,pos.height);
	    console.log('size of view',view.height,view.width);
	    console.log(rect);
	    
	    //lazy.lazyLoad()
	    var arrSrc=lazy.storeSrc();
	    console.log(arrSrc);
	    lazy.clearSrc(arrSrc,window);
	}


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	
	/**
	 * [getBoundingClientRect [使用了自身属性来确定是否要对坐标调整
	 * 返回的是TRBL]
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 * Note: arguments.callee 在严格模式会报错
	 */
	function getBoundingClientRect(element){
	    var scrollTop=document.documentElement.scrollTop;
	    var scrollLeft=document.documentElement.scrollLeft;
	    if(element.getBoundingClientRect){
	        //函数如果没有被调用过就不会有这个属性，如果调用过就可以重用
	        if(typeof arguments.callee.offset!="number"){
	            //没有定义就定义一个
	            var temp=document.createElement('div');
	            temp.style.cssText="position:absolute;left:0;top:0;";
	            document.body.appendChild(temp);
	            //IE中为-2  其他为-0 . 仅仅是距离文档顶部的距离
	            arguments.callee.offset=-temp.getBoundingClientRect().top-scrollTop;
	            document.body.removeChild(temp);//移除这个临时元素
	            temp=null;
	        }
	        //native implementation of getBoundingClientRect
	        var rect=element.getBoundingClientRect();
	        var offset=arguments.callee.offset;
	        return {
	            left:rect.left+offset,
	            right:rect.right+offset,
	            top:rect.top+offset,
	            bottom:rect.bottom+offset
	        };
	    }else{
	        var actualLeft=getElementLeft(element);
	        var actualTop=getElementTop(element);
	        //actualLeft 元素距离最左边缘的距离-滚动条水平距离
	        //actualTop元素距离最上方距离-滚动条垂直距离
	        return{
	            left:actualLeft-scrollLeft,
	            right:actualLeft+element.offsetWidth-scrollLeft,//加上元素本身的尺寸
	            top:actualTop-scrollTop,
	            bottom:actualTop+element.offsetHeight-scrollTop
	        };
	    }
	}

	/**
	 * [getViewport 跨浏览器获取浏览器可视区域(视口)大小]
	 * @return {[type]} [description]
	 */
	function getViewport(w){
	    w=w||window;
	    //除了IE8以及之前的版本，其他都能用 
	    if(w.innerWidth!=null) return {
	        width:w.innerWidth,
	        height:w.innerHeight
	    };
	    
	    var d=w.document;
	    //怪异模式
	    if(d.compatMode=='BackCompat'){
	        return {
	            width:d.body.clientWidth,
	            height:d.body.clientHeight
	        };

	    }else{
	        //标准模式
	        return{ //CSS1Compat
	            width:d.documentElement.clientWidth,
	            height:d.documentElement.clientHeight
	        };
	    }
	}

	/**
	 * 获取距离文档最顶部的距离
	 * 获取距离文档最左边缘的距离
	 * 为了使得文档包含可滚动的且有溢出内容的元素时也能正常工作
	 */
	function getElementPosSize(element){
	    var x=0,y=0;
	    var actualLeft=element.offsetLeft;//元素左外边框距离父元素的左内边框
	    for(var e=element;e!=null;e=e.offsetParent){
	        x+=e.offsetLeft;
	        y+=e.offsetTop;
	    }
	    //再次循环所有的祖先元素，减去滚动的偏移量
	    //这也减去了主滚动条，并转换为视口坐标
	    for(var e=element.parentNode;e!=null&&e.nodeType==1;e=e.parentNode){
	        x-=e.scrollLeft;
	        y-=e.scrollTop;
	    }

	    return {
	        left:x,
	        top:y,
	        width:element.offsetWidth,
	        height:element.offsetHeight
	    };
	}

	/**
	 * 窗口滚动条的位置！
	 * [getScrollOffsets 以一个对象的x和y属性的方式返回滚动条的偏移量]
	 * @param  {[type]} w [输入变量 window]
	 * @return {[Object]}   [返回一个对象]
	 */
	function getScrollOffsets(w){
	    //使用指定的窗口,如果不带参数则使用当前窗口
	    w=w||window;
	    //除了IE8及更高之外，都能使用
	    if(w.pageXOffset!==null) {
	        return{
	                left:w.pageXOffset,
	                top:w.pageYOffset
	        };
	    }else{
	        //对标准模式下的IE
	        var d=w.document;
	        if(document.compatMode=='CSS1Compat')
	            return {left:d.documentElement.scrollLeft,top:d.documentElement.scrollTop};
	        //怪异模式
	        else{
	            return {left:d.body.scrollLeft,top:d.body.scrollTop};
	        }
	    }
	}

	/*Example for scroll  implementation your detecting algorithm*/
	function checkScroll(element,window){//check this ele
	    //一张图片距离顶部的距离+该元素一半的高度 lastBoxH
	    var ele=getElementPosSize(element);
	    var lastBoxH=ele.top+Math.floor(ele.height/2);
	    var lastBoxW=ele.left+Math.floor(ele.width/2);
	    var view=getViewport(window);//view.width, view.height
	    var scrollSize=getScrollOffsets(window);//scrollSize.x scroll.y

	    console.log(lastBoxW,view.width,scrollSize.left)

	    return (lastBoxH<scrollSize.top+view.height)&&(lastBoxW<view.width+scrollSize.left);
	}



	module.exports={
	    getBoundingClientRect:getBoundingClientRect,
	    getViewport:getViewport, 
	    getElementPosSize:getElementPosSize,
	    getScrollOffsets:getScrollOffsets,
	    checkScroll:checkScroll
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var dom=__webpack_require__(2);

	function Lazy(box){
	    this.oBoxs=document.getElementsByClassName(box)||document.getElementsByTagName('img');
	}

	Lazy.prototype={
	    lazyLoad:function(arr,window){ //box -- 'diff'
	        //var oBoxs=getByClass(element,box);//获取所有匹配这个样式名的子元素
	        var oBoxs=this.oBoxs;
	        window.onscroll=function(arr){
	            oBoxs.forEach( function(item, index) {
	                // statements
	                if(dom.checkScroll(item,window)){
	                    item.src=arr[index];
	                }
	            });

	        }
	    },
	    clearSrc:function(box){
	        if(box){
	            var imgs=document.getElementsByClassName(box);
	        }else{
	            var imgs=document.getElementsByTagName('img');
	        }
	        for(var i=0;i<imgs.length;i++){
	            imgs[i].src=' ';
	        }
	    },
	    storeSrc:function(){
	        var arr=[];
	        var imgs=this.oBoxs;
	        for(var i=0;i<imgs.length;i++){
	            arr.push(imgs[i].src);

	        }
	        return arr;
	    }
	}



	module.exports={
	    Lazy:Lazy
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/.npminstall/css-loader/0.26.1/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./node_modules/.npminstall/css-loader/0.26.1/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "body{\r\n\tfont-size:11pt;\r\n\tline-height:200%;\r\n\tmargin: 0px;\r\n\tpadding: 0px;\r\n\tborder: 0px;\r\n\twidth: 100%;\r\n}\r\nh4{\r\n\tcolor: #008080;\r\n}\r\nimg{\r\n\tdisplay: block;\r\n\tmargin:0 auto;\t\r\n}\r\n.fix{\r\n\twidth:321px;\r\n}\r\n.diff{\r\n\twidth:450px;\r\n}\r\ndiv{\r\n\tpadding: 10px 0;\r\n}", ""]);

	// exports


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);