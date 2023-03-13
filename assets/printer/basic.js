(function () {


  var opt_options = {
    filename: 'Example export',
    language: 'en',
    units: 'imperial',
    style: {
      paperMargin: 10
    },
    paperSizes: [
      { size: [594, 420], value: 'A2' },
      { size: [420, 297], value: 'A3' },
      { size: [297, 210], value: 'A4', selected: true },
      { size: [210, 148], value: 'A5' }
    ],
    dpi: [
      { value: 72 },
      { value: 96 },
      { value: 150, selected: true },
      { value: 200 },
      { value: 300 }
    ],
    scales: [10000, 5000, 1000, 500, 250, 100, 50, 25, 10],
    mimeTypeExports: [
      { value: 'pdf', selected: true  },
      { value: 'png' },
      { value: 'jpeg' },
      { value: 'webp' }
    ],
  }

  var pdfPrinter = new PdfPrinter(opt_options);

  map.addControl(pdfPrinter);

})();
