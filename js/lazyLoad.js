var dom=require('./domSizePosition.js');

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
