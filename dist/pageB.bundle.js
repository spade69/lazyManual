webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	//entry.js
	 //必须使用./ 这种path
	    var lazy=__webpack_require__(2);
	    var select=__webpack_require__(7);
	    var lazy=new lazy.Lazy('imgx');
	    var select=new select.Select('language');
	    var arr=lazy.storeSrc();

	    lazy.setSrc('imgs',arr);    


	$(function(){

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
	    
	});

	var selectx=select.selectbox;
	select.createOptions(selectx);

	$(document).ready(function(){
	    $('#language').on('change',function(){
	        var value=$('#language').val();
	        //console.log(value);
	        //根据下拉列表选择的进行填充
	        $('body').cloudLang({lang:value,file:"lang_Content.xml"});
	    });

	});

/***/ },

/***/ 7:
/***/ function(module, exports) {

	/**
	 * Mainly adated to Mobile!
	 * Usage :  for select option 
	 * *(Language)
	 */

	function Select(selectId,url){
	    this.selectbox=document.getElementById(selectId);
	    this.url=url;
	}

	Select.prototype={
	    select:function(){
	        var selectx=this.selectbox;
	        var selectedIndex=selectx.selectedIndex;
	        var param=selectx.options[selectedIndex].value.toUpperCase();
	        var imgs=document.getElementsByTagName('img');
	        for(var i=0;i<imgs.length;i++){
	            //console.log(imgs[i].src);
	            var arr=imgs[i].src.split('/');
	           // console.log(arr[arr.length-1]);
	            imgs[i].src=param+'/'+arr[arr.length-1];
	        }
	    },
	    createOptionsNative:function(selectbox,text){
	        //1)
	        var newOption=new Option(text,text);
	        selectbox.options.add(newOption);
	        // 2) var option=document.createElement('option');
	        // selectbox.appendChild(option);
	        // option.text=text;
	        // option.value=text;       
	    },
	    createOptions:function(selectx){
	        var self=this;
	        $.get('lang_Content.xml',function(data){
	            var xml=$(data);
	            var selectbox=document.getElementById('language');
	            xml.find('type').children().each(function(){
	                var text=$(this).text();
	                //selectx.append('<option value="'+text+'">'+text+'</option>');
	                self.createOptionsNative(selectbox,text);
	            });
	            $('#language')[0].selectedIndex=1;
	            //$('#language option:last-child')[0].selected=true;
	        });
	    }
	}



	// $(function(){
	//     var selecx=$('#language');
	//     var url='http://www.linzhida.cc/guide/lang_Content.xml';
	//     //var url='http://47.88.29.124//guide/lang_Content.xml';
	//     createOptions(url,selecx);

	// });

	module.exports={
	    Select:Select
	}
	    


/***/ }

});