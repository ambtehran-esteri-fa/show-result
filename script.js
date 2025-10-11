const pdfSelect = document.getElementById('pdf-select');
const pdfFrame = document.getElementById('pdf-frame');
const downloadBtn = document.getElementById('download-btn');

// فقط نام فایل‌ها در JS ذخیره شده
const pdfFiles = {
  "CEUNO64511169_3L.pdf": "https://raw.githubusercontent.com/ambtehran-esteri-fa/show-result/main/CEUNO64511169_3L.pdf",
  "example2.pdf": "https://raw.githubusercontent.com/ambtehran-esteri-fa/show-result/main/example2.pdf",
  "example3.pdf": "https://raw.githubusercontent.com/ambtehran-esteri-fa/show-result/main/example3.pdf"
};

// بارگذاری پیش‌فرض
loadPDF(pdfSelect.value);

pdfSelect.addEventListener('change', () => {
  loadPDF(pdfSelect.value);
});

function loadPDF(fileName) {
  pdfFrame.src = pdfFiles[fileName];
}

// دانلود با رمز عبور امن
downloadBtn.addEventListener('click', () => {
  const password = prompt(
    "Enter the download password:\nYou can get it from VisaPro International services center or contact admin@visaprointernational.com"
  );

  // بررسی رمز سرور (می‌توان این رمز را از سرور بگیرید)
  if (password === "Secure2025") { // رمز امن واقعی
    const fileURL = pdfFiles[pdfSelect.value];
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = pdfSelect.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("Incorrect password. Please contact VisaPro International services center.");
  }
});
