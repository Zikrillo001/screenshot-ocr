const imagePreview = document.getElementById('imagePreview');
const outputText = document.getElementById('outputText');
const copyBtn = document.getElementById('copyBtn');
const copyStatus = document.getElementById('copyStatus');

document.addEventListener('paste', (event) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items;

  for (let item of items) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const blob = item.getAsFile();
      const reader = new FileReader();

      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        outputText.textContent = '⏳ Matn aniqlanmoqda...';

        Tesseract.recognize(e.target.result, 'eng', {
          logger: m => console.log(m)
        })
        .then(({ data: { text } }) => {
          outputText.textContent = text.trim() || '⚠️ Matn topilmadi.';
        })
        .catch(err => {
          outputText.textContent = '❌ Xatolik: ' + err.message;
        });
      };

      reader.readAsDataURL(blob);
    }
  }
});

copyBtn.addEventListener('click', () => {
  const text = outputText.textContent;
  if (!text || text === 'Hech qanday rasm hali yuklanmagan.') {
    copyStatus.textContent = '❌ Matn mavjud emas.';
    copyStatus.style.color = 'red';
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => {
      copyStatus.textContent = '✅ Matn nusxalandi!';
      copyStatus.style.color = 'green';
      setTimeout(() => (copyStatus.textContent = ''), 2000);
    })
    .catch(err => {
      copyStatus.textContent = '❌ Nusxalashda xatolik.';
      copyStatus.style.color = 'red';
    });
});
