var ilib=require("./ilib.js");var Utils=require("./Utils.js");var MathUtils=require("./MathUtils.js");var SearchUtils=require("./SearchUtils.js");var GregorianDate=require("./GregorianDate.js");var RataDie=require("./RataDie.js");var GregRataDie=require("./GregRataDie.js");var Astro={};Astro.initAstro=function(sync,loadParams,callback){if(!ilib.data.astro){Utils.loadData({name:"astro.json",locale:"-",nonLocale:true,sync:sync,loadParams:loadParams,callback:ilib.bind(this,function(astroData){ilib.data.astro=astroData;if(callback&&typeof callback==="function"){callback(astroData)}})})}else{if(callback&&typeof callback==="function"){callback(ilib.data.astro)}}};Astro._dtr=function(d){return d*Math.PI/180};Astro._rtd=function(r){return r*180/Math.PI};Astro._dcos=function(d){return Math.cos(Astro._dtr(d))};Astro._dsin=function(d){return Math.sin(Astro._dtr(d))};Astro._dtan=function(d){return Math.tan(Astro._dtr(d))};Astro._fixangle=function(a){return a-360*Math.floor(a/360)};Astro._fixangr=function(a){return a-2*Math.PI*Math.floor(a/(2*Math.PI))};Astro._equinox=function(year,which){var deltaL,i,j,JDE0,JDE,JDE0tab,S,T,W,Y;if(year<1e3){JDE0tab=ilib.data.astro._JDE0tab1000;Y=year/1e3}else{JDE0tab=ilib.data.astro._JDE0tab2000;Y=(year-2e3)/1e3}JDE0=JDE0tab[which][0]+JDE0tab[which][1]*Y+JDE0tab[which][2]*Y*Y+JDE0tab[which][3]*Y*Y*Y+JDE0tab[which][4]*Y*Y*Y*Y;T=(JDE0-2451545)/36525;W=35999.373*T-2.47;deltaL=1+.0334*Astro._dcos(W)+7e-4*Astro._dcos(2*W);S=0;j=0;for(i=0;i<24;i++){S+=ilib.data.astro._EquinoxpTerms[j]*Astro._dcos(ilib.data.astro._EquinoxpTerms[j+1]+ilib.data.astro._EquinoxpTerms[j+2]*T);j+=3}JDE=JDE0+S*1e-5/deltaL;return JDE};Astro._deltat=function(year){var dt,f,i,t;if(year>=1620&&year<=2014){i=Math.floor(year-1620);f=year-1620-i;dt=ilib.data.astro._deltaTtab[i]+(ilib.data.astro._deltaTtab[i+1]-ilib.data.astro._deltaTtab[i])*f}else{t=(year-2e3)/100;if(year<948){dt=2177+497*t+44.1*t*t}else{dt=102+102*t+25.3*t*t;if(year>2e3&&year<2100){dt+=.37*(year-2100)}}}return dt};Astro._obliqeq=function(jd){var eps,u,v,i;v=u=(jd-2451545)/3652500;eps=23+26/60+21.448/3600;if(Math.abs(u)<1){for(i=0;i<10;i++){eps+=ilib.data.astro._oterms[i]/3600*v;v*=u}}return eps};Astro._sunpos=function(jd){var ret={},T,T2,T3,Omega,epsilon,epsilon0;T=(jd-2451545)/36525;T2=T*T;T3=T*T2;ret.meanLongitude=Astro._fixangle(280.46646+36000.76983*T+3032e-7*T2);ret.meanAnomaly=Astro._fixangle(357.52911+35999.05029*T-1537e-7*T2-4.8e-7*T3);ret.eccentricity=.016708634-42037e-9*T-1.267e-7*T2;ret.equationOfCenter=(1.914602-.004817*T-14e-6*T2)*Astro._dsin(ret.meanAnomaly)+(.019993-101e-6*T)*Astro._dsin(2*ret.meanAnomaly)+289e-6*Astro._dsin(3*ret.meanAnomaly);ret.sunLongitude=ret.meanLongitude+ret.equationOfCenter;Omega=125.04-1934.136*T;ret.apparentLong=ret.sunLongitude+-.00569+-.00478*Astro._dsin(Omega);epsilon0=Astro._obliqeq(jd);epsilon=epsilon0+.00256*Astro._dcos(Omega);ret.inclination=Astro._fixangle(23.4392911-.013004167*T-1.6389e-7*T2+5.036e-7*T3);ret.apparentRightAscension=Astro._fixangle(Astro._rtd(Math.atan2(Astro._dcos(epsilon)*Astro._dsin(ret.apparentLong),Astro._dcos(ret.apparentLong))));return ret};Astro._nutation=function(jd){var i,j,t=(jd-2451545)/36525,t2,t3,to10,ta=[],dp=0,de=0,ang,ret={};t3=t*(t2=t*t);ta[0]=Astro._dtr(297.850363+445267.11148*t-.0019142*t2+t3/189474);ta[1]=Astro._dtr(357.52772+35999.05034*t-1603e-7*t2-t3/3e5);ta[2]=Astro._dtr(134.96298+477198.867398*t+.0086972*t2+t3/56250);ta[3]=Astro._dtr(93.27191+483202.017538*t-.0036825*t2+t3/327270);ta[4]=Astro._dtr(125.04452-1934.136261*t+.0020708*t2+t3/45e4);for(i=0;i<5;i++){ta[i]=Astro._fixangr(ta[i])}to10=t/10;for(i=0;i<63;i++){ang=0;for(j=0;j<5;j++){if(ilib.data.astro._nutArgMult[i*5+j]!=0){ang+=ilib.data.astro._nutArgMult[i*5+j]*ta[j]}}dp+=(ilib.data.astro._nutArgCoeff[i*4+0]+ilib.data.astro._nutArgCoeff[i*4+1]*to10)*Math.sin(ang);de+=(ilib.data.astro._nutArgCoeff[i*4+2]+ilib.data.astro._nutArgCoeff[i*4+3]*to10)*Math.cos(ang)}ret.deltaPsi=dp/(3600*1e4);ret.deltaEpsilon=de/(3600*1e4);return ret};Astro._equationOfTime=function(jd){var alpha,deltaPsi,E,epsilon,L0,tau,pos;tau=(jd-2451545)/365250;L0=280.4664567+360007.6982779*tau+.03032028*tau*tau+tau*tau*tau/49931+-(tau*tau*tau*tau/15300)+-(tau*tau*tau*tau*tau/2e6);L0=Astro._fixangle(L0);pos=Astro._sunpos(jd);alpha=pos.apparentRightAscension;var nut=Astro._nutation(jd);deltaPsi=nut.deltaPsi;epsilon=Astro._obliqeq(jd)+nut.deltaEpsilon;E=L0-.0057183-alpha+deltaPsi*Astro._dcos(epsilon);if(E>180){E-=360}E=E*4;E=E/(24*60);return E};Astro._poly=function(x,coefficients){var result=coefficients[0];var xpow=x;for(var i=1;i<coefficients.length;i++){result+=coefficients[i]*xpow;xpow*=x}return result};Astro._universalFromLocal=function(local,zone){return local-zone/1440};Astro._localFromUniversal=function(local,zone){return local+zone/1440};Astro._aberration=function(c){return 974e-7*Astro._dcos(177.63+35999.01847999999*c)-.005575};Astro._nutation2=function(c){var a=Astro._poly(c,ilib.data.astro._nutCoeffA);var b=Astro._poly(c,ilib.data.astro._nutCoeffB);return-.004778*Astro._dsin(a)-3667e-7*Astro._dsin(b)};Astro._ephemerisCorrection=function(jd){var year=GregorianDate._calcYear(jd-1721424.5);if(1988<=year&&year<=2019){return(year-1933)/86400}if(1800<=year&&year<=1987){var jul1=new GregRataDie({year:year,month:7,day:1,hour:0,minute:0,second:0});var theta=(jul1.getRataDie()-693596)/36525;return Astro._poly(theta,1900<=year?ilib.data.astro._coeff19th:ilib.data.astro._coeff18th)}if(1620<=year&&year<=1799){year-=1600;return(196.58333-4.0675*year+.0219167*year*year)/86400}var jan1=new GregRataDie({year:year,month:1,day:1,hour:0,minute:0,second:0});var x=.5+(jan1.getRataDie()-660724);return(x*x/41048480-15)/86400};Astro._ephemerisFromUniversal=function(jd){return jd+Astro._ephemerisCorrection(jd)};Astro._universalFromEphemeris=function(jd){return jd-Astro._ephemerisCorrection(jd)};Astro._julianCenturies=function(jd){return(Astro._ephemerisFromUniversal(jd)-2451545)/36525};Astro._solarLongitude=function(jd){var c=Astro._julianCenturies(jd),longitude=0,len=ilib.data.astro._solarLongCoeff.length,row;for(var i=0;i<len;i++){longitude+=ilib.data.astro._solarLongCoeff[i]*Astro._dsin(ilib.data.astro._solarLongAddends[i]+ilib.data.astro._solarLongMultipliers[i]*c)}longitude*=5729577951308232e-21;longitude+=282.7771834+36000.76953744*c;longitude+=Astro._aberration(c)+Astro._nutation2(c);return Astro._fixangle(longitude)};Astro._lunarLongitude=function(jd){var c=Astro._julianCenturies(jd),meanMoon=Astro._fixangle(Astro._poly(c,ilib.data.astro._meanMoonCoeff)),elongation=Astro._fixangle(Astro._poly(c,ilib.data.astro._elongationCoeff)),solarAnomaly=Astro._fixangle(Astro._poly(c,ilib.data.astro._solarAnomalyCoeff)),lunarAnomaly=Astro._fixangle(Astro._poly(c,ilib.data.astro._lunarAnomalyCoeff)),moonNode=Astro._fixangle(Astro._poly(c,ilib.data.astro._moonFromNodeCoeff)),e=Astro._poly(c,ilib.data.astro._eCoeff);var sum=0;for(var i=0;i<ilib.data.astro._lunarElongationLongCoeff.length;i++){var x=ilib.data.astro._solarAnomalyLongCoeff[i];sum+=ilib.data.astro._sineCoeff[i]*Math.pow(e,Math.abs(x))*Astro._dsin(ilib.data.astro._lunarElongationLongCoeff[i]*elongation+x*solarAnomaly+ilib.data.astro._lunarAnomalyLongCoeff[i]*lunarAnomaly+ilib.data.astro._moonFromNodeLongCoeff[i]*moonNode)}var longitude=sum/1e6;var venus=3958/1e6*Astro._dsin(119.75+c*131.849);var jupiter=318/1e6*Astro._dsin(53.09+c*479264.29);var flatEarth=1962/1e6*Astro._dsin(meanMoon-moonNode);return Astro._fixangle(meanMoon+longitude+venus+jupiter+flatEarth+Astro._nutation2(c))};Astro._newMoonTime=function(n){var k=n-24724;var c=k/1236.85;var approx=Astro._poly(c,ilib.data.astro._nmApproxCoeff);var capE=Astro._poly(c,ilib.data.astro._nmCapECoeff);var solarAnomaly=Astro._poly(c,ilib.data.astro._nmSolarAnomalyCoeff);var lunarAnomaly=Astro._poly(c,ilib.data.astro._nmLunarAnomalyCoeff);var moonArgument=Astro._poly(c,ilib.data.astro._nmMoonArgumentCoeff);var capOmega=Astro._poly(c,ilib.data.astro._nmCapOmegaCoeff);var correction=-17e-5*Astro._dsin(capOmega);for(var i=0;i<ilib.data.astro._nmSineCoeff.length;i++){correction=correction+ilib.data.astro._nmSineCoeff[i]*Math.pow(capE,ilib.data.astro._nmEFactor[i])*Astro._dsin(ilib.data.astro._nmSolarCoeff[i]*solarAnomaly+ilib.data.astro._nmLunarCoeff[i]*lunarAnomaly+ilib.data.astro._nmMoonCoeff[i]*moonArgument)}var additional=0;for(var i=0;i<ilib.data.astro._nmAddConst.length;i++){additional=additional+ilib.data.astro._nmAddFactor[i]*Astro._dsin(ilib.data.astro._nmAddConst[i]+ilib.data.astro._nmAddCoeff[i]*k)}var extra=325e-6*Astro._dsin(Astro._poly(c,ilib.data.astro._nmExtra));return Astro._universalFromEphemeris(approx+correction+extra+additional+RataDie.gregorianEpoch)};Astro._lunarSolarAngle=function(jd){var lunar=Astro._lunarLongitude(jd);var solar=Astro._solarLongitude(jd);return Astro._fixangle(lunar-solar)};Astro._newMoonBefore=function(jd){var phase=Astro._lunarSolarAngle(jd);var guess=Math.round((jd-11.450086114414322-RataDie.gregorianEpoch)/29.530588853-phase/360)-1;var current,last;current=last=Astro._newMoonTime(guess);while(current<jd){guess++;last=current;current=Astro._newMoonTime(guess)}return last};Astro._newMoonAtOrAfter=function(jd){var phase=Astro._lunarSolarAngle(jd);var guess=Math.round((jd-11.450086114414322-RataDie.gregorianEpoch)/29.530588853-phase/360);var current;while((current=Astro._newMoonTime(guess))<jd){guess++}return current};Astro._nextSolarLongitude=function(jd,longitude){var rate=365.242189/360;var tau=jd+rate*Astro._fixangle(longitude-Astro._solarLongitude(jd));var start=Math.max(jd,tau-5);var end=tau+5;return SearchUtils.bisectionSearch(0,start,end,1e-6,function(l){return 180-Astro._fixangle(Astro._solarLongitude(l)-longitude)})};Astro._floorToJD=function(jd){return Math.floor(jd-.5)+.5};Astro._ceilToJD=function(jd){return Math.ceil(jd+.5)-.5};module.exports=Astro;