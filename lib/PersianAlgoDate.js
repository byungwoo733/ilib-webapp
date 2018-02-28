var ilib=require("./ilib.js");var SearchUtils=require("./SearchUtils.js");var MathUtils=require("./MathUtils.js");var Locale=require("./Locale.js");var LocaleInfo=require("./LocaleInfo.js");var TimeZone=require("./TimeZone.js");var IDate=require("./IDate.js");var Calendar=require("./Calendar.js");var PersianAlgoCal=require("./PersianAlgoCal.js");var PersAlgoRataDie=require("./PersAlgoRataDie.js");var PersianAlgoDate=function(params){this.cal=new PersianAlgoCal();this.timezone="local";if(params){if(params.locale){this.locale=typeof params.locale==="string"?new Locale(params.locale):params.locale;var li=new LocaleInfo(this.locale);this.timezone=li.getTimeZone()}if(params.timezone){this.timezone=params.timezone}if(params.year||params.month||params.day||params.hour||params.minute||params.second||params.millisecond){this.year=parseInt(params.year,10)||0;this.month=parseInt(params.month,10)||1;this.day=parseInt(params.day,10)||1;this.hour=parseInt(params.hour,10)||0;this.minute=parseInt(params.minute,10)||0;this.second=parseInt(params.second,10)||0;this.millisecond=parseInt(params.millisecond,10)||0;this.dayOfYear=parseInt(params.dayOfYear,10);if(typeof params.dst==="boolean"){this.dst=params.dst}this.rd=this.newRd(this);if(!this.tz){this.tz=new TimeZone({id:this.timezone})}this.offset=this.tz._getOffsetMillisWallTime(this)/864e5;if(this.offset!==0){this.rd=this.newRd({rd:this.rd.getRataDie()-this.offset})}}}if(!this.rd){this.rd=this.newRd(params);this._calcDateComponents()}};PersianAlgoDate.prototype=new IDate({noinstance:true});PersianAlgoDate.prototype.parent=IDate;PersianAlgoDate.prototype.constructor=PersianAlgoDate;PersianAlgoDate.prototype.newRd=function(params){return new PersAlgoRataDie(params)};PersianAlgoDate.prototype._calcYear=function(rd){var shiftedRd=rd-173126;var numberOfCycles=Math.floor(shiftedRd/1029983);var shiftedDayInCycle=MathUtils.mod(shiftedRd,1029983);var yearInCycle=shiftedDayInCycle===1029982?2820:Math.floor((2816*shiftedDayInCycle+1031337)/1028522);var year=474+2820*numberOfCycles+yearInCycle;return year>0?year:year-1};PersianAlgoDate.prototype._calcDateComponents=function(){var remainder,rd=this.rd.getRataDie();this.year=this._calcYear(rd);if(typeof this.offset==="undefined"){if(!this.tz){this.tz=new TimeZone({id:this.timezone})}this.offset=this.tz.getOffsetMillis(this)/864e5}if(this.offset!==0){rd+=this.offset;this.year=this._calcYear(rd)}var yearStart=this.newRd({year:this.year,month:1,day:1,hour:0,minute:0,second:0,millisecond:0});remainder=rd-yearStart.getRataDie()+1;this.dayOfYear=remainder;this.month=SearchUtils.bsearch(remainder,PersAlgoRataDie.cumMonthLengths);remainder-=PersAlgoRataDie.cumMonthLengths[this.month-1];this.day=Math.floor(remainder);remainder-=this.day;remainder=Math.round(remainder*864e5);this.hour=Math.floor(remainder/36e5);remainder-=this.hour*36e5;this.minute=Math.floor(remainder/6e4);remainder-=this.minute*6e4;this.second=Math.floor(remainder/1e3);remainder-=this.second*1e3;this.millisecond=remainder};PersianAlgoDate.prototype.getDayOfWeek=function(){var rd=Math.floor(this.getRataDie());return MathUtils.mod(rd-3,7)};PersianAlgoDate.prototype.getDayOfYear=function(){return PersAlgoRataDie.cumMonthLengths[this.month-1]+this.day};PersianAlgoDate.prototype.getEra=function(){return this.year<1?-1:1};PersianAlgoDate.prototype.getCalendar=function(){return"persian-algo"};IDate._constructors["persian-algo"]=PersianAlgoDate;module.exports=PersianAlgoDate;