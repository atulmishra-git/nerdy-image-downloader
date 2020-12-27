chrome.runtime.onInstalled.addListener(function (details) {
  // Once extension is installed
  localStorage.removeItem('images')
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.action == 'CONTENT_SCRIPT_ACTIVE'){
    sendResponse({message: 'Thanks for activating.'})
  }
  if(request.action == 'IMAGE_RECEIVED'){
    sendResponse({message: 'Got Images.'})
    localStorage.removeItem('images')
    localStorage.setItem('images', request.images)
  }
  else if(request.action == 'IMAGE_RECEIVED_NEW' && request.scroll === true) {
    sendResponse({message: 'Got New Images.'})
    localStorage.removeItem('images')
    localStorage.setItem('images', request.images)
  }
  if(request.action == 'POPUP_ACTIVE'){
    sendResponse({message: 'Thanks for activating popup.'})
  }
  // if(request.action == 'SET_HOST') {
  //     localStorage.setItem('host', request.name)
  //     sendResponse({message: 'Host name set ' + request.name})
  // }
})


// chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//   chrome.tabs.sendMessage(tabs[0].id, {action: "CUR_URL", url: tabs[0].url}, function(response) {
//     console.log(response)
//   });
// })
