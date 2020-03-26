const url = '../docs/pdf.pdf';

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5
  canvas = document.querySelector('#the-canvas'),
  ctx = canvas.getContext('2d');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

// Render the Page
const renderPage = num => {

}

// Get Document
pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;
  console.log(pdfDoc);
});
