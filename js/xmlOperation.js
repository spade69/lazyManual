/**
 * 解析XML 
 * Version: 1.0
 * Native JS || JQ
 * Author : Jason
 * Email: jlin991@gmail.com
 * 
 */
//DOM ready

/*
$(function(){

});*/

/*
usage: serializeXML(document.documentElement);//传入文档元素，这也是一个DOM
序列化XML，把DOM序列化成XML字符串
 */ 
function serializeXML(xmldom){  
    if(typeof XMLSerializer!='undefined'){
        var serilizer=new XMLSerializer(xmldom);
        return serilizer.serializeToString(xmldom);
    }else if(typeof xmldom.xml!="undefined"){
        return xmldom.xml;
    }else{
        //throw error
        throw new Error("Could not serialize XML DOM!");
    }
}
//兼容性处理 XML序列化和XML解析
//可用的版本存入函数的属性 activeXString中。 不必每次调用这个函数都重复检查可用版本
function createDocument(){
    //arguments.callee即函数createDocument本身
    if(typeof arguments.callee.activeXString!="string"){
        var versions=["MSXML2.DOMdocument.6.0","MSXML2.DOMdocument.3.0",
        "MSXML2.DOMdocument"];
        for(var i=0;i<versions.length;i++){
            try{
                new ActiveXObject(versions[i]);
                arguments.callee.activeXString=versions[i];
                break; //一旦第一个符合了就用第一个，否则才继续循环下一个
            }catch(ex){
                console.log(ex);
            }
        }
    }
    return new ActiveXObject(arguments.callee.activeXString);
}

///var xmldom=parser.parseFromString("<root><child/></root>","text/xml");
///兼容主要四种浏览器的解析XML代码
function parsingXML(xml){
    var xmldom=null;
    if(typeof DOMParser!='undefined'){
        var parser=new DOMParser()
        xmldom=parser.parseFromString(xml,'text/xml');
          //调用这个方法，不管是文档元素，还是文档元素的子元素都能够找到
        //如果返回了元素那就是有错误发生了！
        var errors=xmldom.getElementsByTagName('parsererror');
        if(errors.length>0){
            throw new Error("XML parsing error:"+errors[0].textContent);
        }
    }else if(typeof ActiveXObject!='undefined'){
        xmldom=createDocument();
        xmldom.loadXML(xml);
        if(xmldom.parseError!=0){
            throw new Error("XML parsing error:"+xmldom.parseError.reason);
        }
    }else{
        throw new Error("No XML parser available");
    }
    return xmldom;
}

function detectParseError(xmldom){
    if(xmldom.parseError!=0){//没有错误的时候为0
        alert("An error occured:\n Error Code:"
            +xmldom.parseError.errorCode+"\n"
            +"Line: "+xmldom.parseError.linepos+"\n"
            +"Reason:"+xmldom.parseError.reason);
    }
}

function createAndLoad(){
    //创建可以填充xml 的DOM文档
    //调用loadXML 可以把XML字符串填充到
    var xmldom=createDocument();
    xmldom.async=false;
    //xmldom.loadXML('<root><child/></root>');
    xmldom.load('lang_Content.xml');
    if(xmldom.parseError!=0){
        detectParseError(xmldom);
    }
    else{
        alert(xmldom.documentElement.tagName);
        alert(xmldom.documentElement.firstChild.tagName);

        var anotherChild=xmldom.createElement('child');
        xmldom.documentElement.appendChild(anotherChild);
        var children=xmldom.getElementsByTagName('child');
        console.log(children.length);
        console.log(xmldom.xml);
    }
}

var xmldom=createDocument();
xmldom.async=true;

xmldom.onreadystatechange=function(){
    if(xmldom.readyState==4){
        if(xmldom.parseError!=0){
            detectParseError(xmldom);
        }else{
             alert(xmldom.documentElement.tagName);
            alert(xmldom.documentElement.firstChild.tagName);

            var anotherChild=xmldom.createElement('child');
            xmldom.documentElement.appendChild(anotherChild);
            var children=xmldom.getElementsByTagName('child');
            console.log(children.length);
            console.log(xmldom.xml);
        }
    }
};

/*xmldom.load('lang_Content.xml');

//解析XML的用法！必须放在一个try-catch语句中 以防发生错误
try{
    xmldom=parseXml("<root><child/></root>");
}catch(ex){
    alert(ex.message);
}*/

module.exports={
    serializeXML:serializeXML,
    createDocument:createDocument,
    parsingXML:parsingXML,
    detectParseError:detectParseError,
    createAndLoad:createAndLoad
}