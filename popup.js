// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getAllTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var urlList = []
    tabs.forEach(function(element) {
      urlList.push(encodeURIComponent(element.url))  
    })

    callback(urlList);
  });
}

function $ (query) {
  return document.querySelector(query)
}
var saveButton = $('#save')
var getButton = $('#get')
var flag = $('#flag')
saveButton.addEventListener('click', function () {
  getAllTabUrl((urlList) => {
    ajax('http://115.159.213.177:30002/save','POST', `content=${JSON.stringify(urlList)}`, (data) => {
      if(JSON.parse(data).status === 1) flag.style.display = 'inline'
    })
  })
})

getButton.addEventListener('click', function () {
  ajax('http://115.159.213.177:30002/get','GET', null, (data) => {
    // console.log(data)
      JSON.parse(data).forEach((ele) => {
        console.log(typeof ele)
        chrome.tabs.create({url: decodeURIComponent(ele)})
      })
  })
})



function ajax(url,methon,send,fn){
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4&&xhr.status==200){
				fn(xhr.responseText);
				console.log(this.HEADERS_RECEIVED)
			}
			if(this.readyState == this.HEADERS_RECEIVED) {
    		// console.log(xhr.getAllResponseHeaders());
  }
		}
		xhr.open(methon||'GET', url, true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')

		xhr.send(send||null);
}
