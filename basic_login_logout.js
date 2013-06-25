var wd = require('wd')
  , _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , uuid = require('uuid-js');
var VARS = {};

var b = wd.promiseRemote();
var assert = require('assert');

b.on('status', function(info){console.log('[36m%s[0m', info);});b.on('command', function(meth, path, data){  console.log(' > [33m%s[0m: %s', meth, path, data || '');});
b.init({
  browserName:'firefox'
})
//load page
.then(function () { return b.get("http://www.last.fm/"); })
//login
.then(function () { return b.elementByLinkText("Login"); })
.then(function(el) { return b.clickElement(el); })
.then(function () {return b.waitForVisibleByName("username", 5000); })
.then(function () { return b.elementById("username"); })
.then(function (el) { return b.type(el, "username"); }) //add your username
.then(function () { return b.elementById("password"); })
.then(function (el) { return b.type(el, "passwprd"); })//add your password
.then(function () { return b.elementByName("login"); })
.then(function (el) { return b.clickElement(el); })
.then(function (){ return b.waitForVisibleByXPath("//*[@id='homeHead']/h1/a", 5000); })
.then(function(){ return b.title; })
.then(function(title) { 
	 assert.ok(title, 'Home - Last.fm');
})
//search
.then(function(){ return b.elementById("siteSearchBox"); })
.then(function(el){ return b.type(el, "The Weeknd"); })
.then(function(){return b.elementById("siteSearchSubmit");})
.then(function(el){return b.clickElement(el); })
.then(function(){ return b.waitForElementByXPath("//*[@id='topResult']/div/h3/a", 3000); })
.then(function(){ return b.elementByXPath("//*[@id='topResult']/div/h3/a"); })
.then(function () { return b.eval("window.location.href"); })
.then(function (href) { 
	assert.ok(~href.indexOf("The+Weeknd")); 
})
//play radio
.then(function(){ return b.elementByXPath("//*[@id='topResult']/div/h3/a"); })
.then(function(el){return b.clickElement(el); })
.then(function (){ return b.waitForVisibleByLinkText("Play radio", 5000); })
.then(function(){ return b.elementByLinkText("Play radio"); })
.then(function(el){return b.clickElement(el); })
.then(function(){ assert(b.hasElementById("webRadioPlayer"))===true;})

//logout
 .then(function () { return b.elementByLinkText("Logout"); })
 .then(function (el) { return b.clickElement(el); })
.fin(function () {
b.quit();
}).done();
