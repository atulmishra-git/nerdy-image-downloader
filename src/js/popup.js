function getImage() {
  var imgStore = localStorage.getItem('images')
  var images = []
  if( imgStore != null ){
    var images = JSON.parse(imgStore)
  }
  return images
}

function selectImages() {
  var images = getImage()
  var option = ''
  images.forEach((item, i) => {
    option += '<li class="list-group-item"><input checked type="checkbox" name="image" value="'+item+'" class="images form-check-input me-1" /> <img src="'+item+'" width="120" height="80" /></li>'
  });
  document.querySelector('#images').innerHTML = option
  document.querySelector('.total_img').innerText = images.length
  document.getElementById('number_img').value = images.length
}

selectImages();

function showChoosenExt() {
  var items = document.querySelectorAll('[name=img_type]')
  items.forEach((item, i) => {
    item.addEventListener('click', function(e){
      if(e.target.checked === true) {
        document.querySelectorAll('.images').forEach((it, i) => {
          var img = new Image()
          img.src = it.value
          var ext = img.src.split('.').pop()
          if(ext != e.target.value){
            it.disabled = true
            it.parentElement.style.display = "none"
          }else{
            it.disabled = false
            it.parentElement.style.display = "block"
          }
        })
      }else {
      }
    })
  });
}

showChoosenExt();

function getFiles() {
  var files = []
  document.querySelectorAll('.images:checked').forEach((it, i) => {
     var blob = fetch(it.value).then(res => {
       return res.blob()
     })
     const fileName = it.value.split("/").pop()
     files.push({
       fileName: fileName,
       blob: blob
     })
  })
  return files
}

function saveFolder(mainFolder) {
  mainFolder.generateAsync({type:"blob"}).then(function(content) {
    saveAs(content, "nerdy_images.zip")
  })
}

function prepareFolder(filesToDownload) {
  var zip         = new JSZip()
  var mainFolder  = zip.folder("images")
  var numImages   = 0

  document.querySelector('.progress-bar').style.width = "0%"

  var progress = setInterval(function(){

    filesToDownload.forEach((item, i) => {
      mainFolder.file(item.fileName, item.blob, { binary: true })
      numImages++
      var percentage = Math.floor(numImages/filesToDownload.length*100)
      document.querySelector('.progress-bar').style.width = percentage + "%"
      if( percentage >= 100) {
        clearInterval(progress)
        if(numImages > 0) {
          console.log("Foler Downloaded.")
          saveFolder(mainFolder)
        }else{
          console.log("Nothing to Download.")
        }
      }
    })
  }, 1000)
}

function download(){
  document.getElementById("download_btn").addEventListener('click', function(e){
    var files           = getFiles()
    var breakUp         = parseInt(document.querySelector('#number_img').value)
    var total_files     = files.length
    var startIdx        = 0
    var endIdx          = breakUp
    var left            = total_files

    var folderProgress   = setInterval(function(){
      console.log("Files left : " + left)
      var filesToDownload = files.slice(startIdx, endIdx)

      if( left < 1 ){
        clearInterval(folderProgress)
      }
      prepareFolder(filesToDownload)
      left = left - filesToDownload.length
      startIdx = endIdx
      endIdx   = endIdx*2
    }, 3000)
  })
}

download()

// function detectValidHost() {
//   var name  = localStorage.getItem('host')
//   if( name != "pinterest") {
//     localStorage.removeItem('images')
//     window.close()
//     return
//   }
// }
//
// detectValidHost()
