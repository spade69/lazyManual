/**
 * Mainly adated to Mobile!
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
        var newOption=new Option(text,text);
        selectbox.options.add(newOption);
        // var option=document.createElement('option');
        // selectbox.appendChild(option);
        // option.text=text;
        // option.value=text;       
    },
    createOptions:function(selectx){
        //var selectx=$('#language');
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
    
