// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   sendResponse({message: 'Thanks for sending message.'})
//   console.log(request)
//   if( request.action == 'CUR_URL'){
//     var url = new URL(request.url)
//     var name  = url.hostname.split(".").slice(-2)[0]
//     window.alert("Cannot open in this website " + name)
//     localStorage.setItem('host', request.name)
//   }
//
//   return
// })

function readImages(images){
  var imgList = []
  images.forEach((item, i) => {
    var img = new Image()
    img.src = item.src
    img.alt = item.alt
    if(img.alt != "" && (img.width > 100 || img.height > 100)){
      imgList.push(img.src)
    }
  })
  return imgList
}

chrome.runtime.sendMessage({ action: "CONTENT_SCRIPT_ACTIVE" }, function(response){
  console.log(response)
  var waitForImg = setInterval(function(){
    var div = document.querySelectorAll('.vbI.XiG')
    console.log(div)
    if( div.length > 1){
       var images = div[0].querySelectorAll('img')
       if( images.length > 2 ) {
         clearInterval(waitForImg)
         console.log("Timer stopped.")
       }
       var img_all = readImages(images)
       chrome.runtime.sendMessage({ action: "IMAGE_RECEIVED", images: JSON.stringify(img_all) }, function(response){
         console.log(response)
         window.onscroll = function(){
           var div = document.querySelectorAll('.vbI.XiG')
           var images = div[0].querySelectorAll('img')
           var img_all = readImages(images)
           chrome.runtime.sendMessage({ action: "IMAGE_RECEIVED_NEW", images: JSON.stringify(img_all), scroll: true }, function(response){
             console.log(response)
           })
         }
       })
    }
  }, 3000)
})
