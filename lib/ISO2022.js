var Charset=require("./Charset.js");var Charmap=require("./Charmap.js");var ISO2022=function(options){this.charset=new Charset({name:options.name})};ISO2022.prototype=new Charmap();ISO2022.prototype.parent=Charmap;ISO2022.prototype.constructor=ISO2022;ISO2022.prototype.mapToUnicode=function(bytes){};ISO2022.prototype.mapToNative=function(str){};module.exports=ISO2022;