var ilib=require("./ilib.js");var Utils=require("./Utils.js");var Charset=require("./Charset.js");var JSUtils=require("./JSUtils.js");var IString=require("./IString.js");var Charmap=function(options){var sync=true,loadParams=undefined;this.charset=new Charset({name:"US-ASCII"});this.missing="placeholder";this.placeholder="?";this.escapeStyle="js";this.expansionFactor=1;if(options){if(typeof options.placeholder!=="undefined"){this.placeholder=options.placeholder}var escapes={html:"html",js:"js","c#":"js",c:"c","c++":"c",java:"java",ruby:"java",perl:"perl"};if(typeof options.escapeStyle!=="undefined"){if(typeof escapes[options.escapeStyle]!=="undefined"){this.escapeStyle=escapes[options.escapeStyle]}}if(typeof options.missing!=="undefined"){if(options.missing==="skip"||options.missing==="placeholder"||options.missing==="escape"){this.missing=options.missing}}}this._calcExpansionFactor()};Charmap._algorithms={};Charmap.prototype={getName:function(){return this.charset.getName()},writeNative:function(array,start,value){if(ilib.isArray(value)){for(var i=0;i<value.length;i++){array[start+i]=value[i]}return value.length}else{array[start]=value;return 1}},writeNativeString:function(array,start,string){for(var i=0;i<string.length;i++){array[start+i]=string.charCodeAt(i)}return string.length},_calcExpansionFactor:function(){var factor=1;factor=Math.max(factor,this.charset.getMaxCharWidth());switch(this.missing){case"placeholder":if(this.placeholder){factor=Math.max(factor,this.placeholder.length)}break;case"escape":switch(this.escapeStyle){case"html":factor=Math.max(factor,8);break;case"c":factor=Math.max(factor,6);break;case"perl":factor=Math.max(factor,10);break;default:factor=Math.max(factor,6);break}break;default:break}this.expansionFactor=factor},dealWithMissingChar:function(c){var seq="";switch(this.missing){case"skip":break;case"escape":var num=typeof c==="string"?c.charCodeAt(0):c;var bigc=JSUtils.pad(num.toString(16),4).toUpperCase();switch(this.escapeStyle){case"html":seq="&#x"+bigc+";";break;case"c":seq="\\x"+bigc;break;case"java":seq="\\\\u"+bigc;break;case"perl":seq="\\N{U+"+bigc+"}";break;default:case"js":seq="\\u"+bigc;break}break;default:case"placeholder":seq=this.placeholder;break}return seq},mapToNative:function(string){if(!string){return new Uint8Array(0)}if(this.algorithm){return this.algorithm.mapToNative(string)}var str=string instanceof IString?string:new IString(string);var c,i=0,j=0,it=str.iterator();var ret=new Uint8Array(str.length*this.expansionFactor);while(it.hasNext()&&i<ret.length){c=it.next();if(c<127){ret[i++]=c}else{i+=this.writeNativeString(ret,i,this.dealWithMissingChar(c))}}return ret},mapToUnicode:function(bytes){var ret="";var c,i=0;while(i<bytes.length){c=bytes[i];if(c<128){ret+=String.fromCharCode(c)}else{ret+=this.dealWithMissingChar(bytes[i++])}}return ret}};module.exports=Charmap;