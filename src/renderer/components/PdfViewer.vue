<template>
  <div class="pdf-viewer-wrapper">
    
    <button class="button " style=" position:fixed; top:10;" @click.prevent="backLink()"><i class="nc-icon-mini  arrows-1_tail-left"></i></button>
    
    <button class="button " style=" position:fixed; top:10; left:360px" @click.prevent="downloadFile()">Download</button>

    <button class="button" style=" position:fixed; top:10; right:310px; z-index:999999" @click.prevent="backLink()"><i class="nc-icon-mini  ui-1_bold-remove"></i></button>

    <div class="pdf-loader" v-if="isLoading">
      <h1>Loading Preview</h1>
      <!-- <loader width="30px" height="30px"></loader> -->
    </div>
    <div id="pdf-viewer"></div>
  </div>
</template>

<style>

  table tr td, table tr th {
      page-break-inside: avoid !important;
      margin: 4px 0 4px 0;
  }
  .pdf-page-canvas {
    display: block;
    margin: 5px auto;
    border: 1px solid rgba(0, 0, 0, 0.8);
  }
  .pdf-viewer-wrapper {
    margin: 0 auto;
    margin-top: 30px;
    width: 900px;

    canvas {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
      margin-bottom: 15px;
      border:10px solid black!important;
    }
  }

  .pdf-pages {
    height: 100%;
    border:10px solid black!important;
    canvas {
      margin-bottom: 15px;
      border:10px solid black!important;
    }
  }

  .pdf-loader {
    height: 800px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    padding-top: 200px;
    text-align: center;
  }
</style>


<script>
  import PdfJs from 'pdfjs-dist/build/pdf.combined.js'
  // import PdfJs from 'pdfjs-dist'
  // import PdfJsWorker from 'pdfjs-dist/build/pdf.worker'
  // const remote = require ('electron').BrowserWindow;

  // const {download} = require('electron-dl');
  var fs = require('fs');
  const path = require('path')

  // PDFJS.workerSrc = PdfJsWorker

  // PDFJS.workerSrc = require('path').join(process.resourcesPath, '/app.asar/node_modules/pdfjs-dist/build/pdf.worker.js');
  // PDFJS.disableWorker = true;
  export default {
    props: {
      url: String
    },
    data: () => ({
      isLoading: true,
      backUrl: '',
      fileCount: 0
    }),
    methods: {
      backLink () {
        this.$router.push({ path: this.$route.query.backUrl })
      },
      downloadFile(){
        // console.log(this.$route.query.url)
        // var filepath = "file://" + path.resolve(this.$route.query.url)
        var filepath = "file://" + require('path').join(process.resourcesPath, this.$route.query.url)

        this.$electron.ipcRenderer.send('download-btn', filepath)

      },
      renderPdf (url, canvasContainer) {
        var self = this

        function renderPage (page) {
          var viewport = page.getViewport(1.5)
          var canvas = document.createElement('canvas')
          canvas.style.display = "block";
          var ctx = canvas.getContext('2d')
          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }

          canvas.height = viewport.height
          canvas.width = viewport.width
          canvasContainer.appendChild(canvas)

          page.render(renderContext)
        }

        function renderPages (pdfDoc) {
          for (var num = 1; num <= pdfDoc.numPages; num++) {
            pdfDoc.getPage(num).then(renderPage)
          }

          self.isLoading = false
        }

        // var data = new Uint8Array(fs.readFileSync( path.resolve(url) ))
        var data = new Uint8Array(fs.readFileSync( require('path').join(process.resourcesPath, url) ))
        PdfJs
          .getDocument(data)
          .then(renderPages)
      }
    },
    mounted () {
      setInterval(function () {
        if(this.fileCount == 0) {
          if( fs.existsSync( require('path').join(process.resourcesPath, this.$route.query.url)) ) {
            this.fileCount = 1
            var pdfViewer = document.getElementById('pdf-viewer')
            this.renderPdf(this.$route.query.url, pdfViewer)
          }
        }
      }.bind(this), 5000)
      this.backUrl = this.$route.query.backUrl
    }
  }
</script>
