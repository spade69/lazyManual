//entry.js
var app=require('./module.js'); //必须使用./ 这种path
var domSP=require('./domSizePosition.js');
require('../style.css');
document.write('It works');
app.work();

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
    
    window.onscroll=function(){
        if(domSP.checkScroll(document.body,'diff',window)){
            //alert('ok!');
        }
    }
    
}
