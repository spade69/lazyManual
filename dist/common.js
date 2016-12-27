/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		2:0
/******/ 	};

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

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + ".chunk.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var dom=__webpack_require__(1);

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
	            var srcArr=imgs[i].src.split('/');
	            arr.push(srcArr[srcArr.length-1]);

	        }
	        return arr;
	    },
	    setSrc:function(path,arr){
	        var oBoxs=[];
	        oBoxs=this.oBoxs;
	        console.log(oBoxs);
	        for(var i=0;i<oBoxs.length;i++){
	            oBoxs[i].src=path+'/'+arr[i];
	        }
	   /*     oBoxs.forEach(function(item,index){
	            item.src=path+'/'+arr[index];
	        });*/
	    }
	}



	module.exports={
	    Lazy:Lazy
	}


/***/ }
/******/ ]);