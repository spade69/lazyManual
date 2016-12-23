//lazyload and
function select(){
    var selectx=document.getElementById('language');
    var selectedIndex=selectx.selectedIndex;
    var param=selectx.options[selectedIndex].value.toUpperCase();
    var imgs=document.getElementsByTagName('img');
    for(var i=0;i<imgs.length;i++){
        console.log(imgs[i].src);
        var arr=imgs[i].src.split('/');
        console.log(arr[arr.length-1]);
        imgs[i].src=param+'/'+arr[arr.length-1];
    }
}

function lazyLoad(){
    
}


function createOptions(url,selectx){
    $.get(url,function(data){
        var xml=$(data);
         xml.find('type').children().each(function(){
            var text=$(this).text();
            selectx.append('<option value="'+text+'">'+text+'</option>');
        });
        $('#language')[0].selectedIndex=1;
     });
}
$(function(){
    var selecx=$('#language');
    var url='http://www.linzhida.cc/guide/lang_Content.xml';
    //var url='http://47.88.29.124//guide/lang_Content.xml';
    createOptions(url,selecx);

});


    
