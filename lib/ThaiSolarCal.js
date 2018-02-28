var ilib=require("./ilib.js");var MathUtils=require("./MathUtils.js");var Calendar=require("./Calendar.js");var GregorianCal=require("./GregorianCal.js");var ThaiSolarCal=function(){this.type="thaisolar"};ThaiSolarCal.prototype=new GregorianCal({noinstance:true});ThaiSolarCal.prototype.parent=GregorianCal;ThaiSolarCal.prototype.constructor=ThaiSolarCal;ThaiSolarCal.prototype.isLeapYear=function(year){var y=typeof year==="number"?year:year.getYears();y-=543;var centuries=MathUtils.mod(y,400);return MathUtils.mod(y,4)===0&&centuries!==100&&centuries!==200&&centuries!==300};Calendar._constructors["thaisolar"]=ThaiSolarCal;module.exports=ThaiSolarCal;