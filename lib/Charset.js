var ilib=require("./ilib.js");var Utils=require("./Utils.js");var Charset=function(options){var sync=true,loadParams=undefined;this.originalName="UTF-8";if(options){if(typeof options.name!=="undefined"){this.originalName=options.name}if(typeof options.sync!=="undefined"){sync=options.sync==true}if(typeof options.loadParams!=="undefined"){loadParams=options.loadParams}}if(!Charset.cache){Charset.cache={}}this.info={description:"default",min:1,max:1,bigendian:true,scripts:["Latn"],locales:["*"]};Utils.loadData({object:Charset,locale:"-",nonlocale:true,name:"charsetaliases.json",sync:sync,loadParams:loadParams,callback:ilib.bind(this,function(info){if(info){var n=this.originalName.replace(/[-_,:\+\.\(\)]/g,"").toUpperCase();this.name=info[n]}if(!this.name){this.name=this.originalName}Utils.loadData({object:Charset,locale:"-",nonlocale:true,name:"charset/"+this.name+".json",sync:sync,loadParams:loadParams,callback:ilib.bind(this,function(info){if(info){ilib.extend(this.info,info)}if(options&&typeof options.onLoad==="function"){options.onLoad(this)}})})})})};Charset.prototype={getName:function(){return this.name},getOriginalName:function(){return this.originalName},getDescription:function(){return this.info.description||this.getName()},getMinCharWidth:function(){return this.info.min},getMaxCharWidth:function(){return this.info.max},isMultibyte:function(){return this.getMaxCharWidth()>this.getMinCharWidth()},isBigEndian:function(){return this.info.bigendian},getScripts:function(){return this.info.scripts}};module.exports=Charset;