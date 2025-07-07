const imagePreview = document.getElementById('imagePreview');
const outputText = document.getElementById('outputText');

document.addEventListener('paste', (event) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items;

  for (let index in items) {
    const item = items[index];
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const blob = item.getAsFile();
      const reader = new FileReader();

      reader.onload = function (event) {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
        outputText.textContent = '⏳ Matn aniqlanmoqda...';

        Tesseract.recognize(
          event.target.result,
          'eng',
          { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
          outputText.textContent = text.trim() || '⚠️ Hech qanday matn topilmadi.';
        }).catch(err => {
          outputText.textContent = '❌ Xatolik: ' + err.message;
        });
      };

      reader.readAsDataURL(blob);
    }
  }
});
