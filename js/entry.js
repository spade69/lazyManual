//entry.js
 //必须使用./ 这种path
var domSP=require('./domSizePosition.js');
var lazy=require('./lazyLoad');
require('../style.css');
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
