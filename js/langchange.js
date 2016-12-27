/**
 * 解析XML 
 * Version: 1.1
 * Native JS || JQ
 * Author : Jason
 * Email: jlin991@gmail.com
 * 
 
--------------------------------------------------------------------------------------------------------- */
var lazy=require('./lazyLoad');
var lazy=new lazy.Lazy();

var arr=lazy.storeSrc();
console.log(arr);

(function($){
    
    $.fn.cloudLang = function(params){
        
     /*   var defaults = {
            file: 'lang_Content.xml',
            lang: 'en'
        }*/
        
        var aTexts ={};
        
        
        $.ajax({
              type: "GET",
              url: params.file,
              dataType: "xml",
              success: function(xml){
                            //这里是遍历解析XML文档
                            $(xml).find('text').each(function()
                            {
                                var textId = $(this).attr("id");//提取id的值
                                var text = $(this).find(params.lang).text();//找到所有<zh> or <en> 标签
                                aTexts[textId] = text;//存储文本到这个数组中
                            });
                            // 遍历HTML文档每个id，然后替换文本
                            for(var id in aTexts){
                                $('#'+id).text(aTexts[id]);
                            }
            }
        });
    };
    
})(jQuery);

//$(document).ready(function(){...})
$(function(){
    $('#language').on('change',function(){
        var value=$('#language').val();
        //console.log(value);
        //根据下拉列表选择的进行填充
        $('body').cloudLang({lang:value,file:"lang_Content.xml"});
    });

});

/*     $("#langen").click(function(){
            $("body").cloudLang({lang: "en", file: "lang_Content.xml"});
           
        });
               var optionx=document.createElement('option');
                optionx.value=text;
                optionx.textContent=text;
                select.appendChild(optionx);
        */
