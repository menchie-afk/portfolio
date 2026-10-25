const mediaCards = document.querySelectorAll('.media-card');
const mediaGallery = document.getElementById('mediaGallery');

function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderMedia(category, items) {
      if (!Array.isArray(items) || items.length === 0) {
        mediaGallery.innerHTML = '<div class="empty-state">No files found in this category.</div>';
        return;
      }

      const label = String(category || 'media').toUpperCase();
      const pdfItems = items.filter(item => {
        const fileType = String(item.file_type || '').toLowerCase();
        const fileName = String(item.file_name || item.file_path || '').toLowerCase();
        return fileType === 'pdf' || fileName.endsWith('.pdf');
      });
      const otherItems = items.filter(item => {
        const fileType = String(item.file_type || '').toLowerCase();
        const fileName = String(item.file_name || item.file_path || '').toLowerCase();
        return !(fileType === 'pdf' || fileName.endsWith('.pdf'));
      });

      const pdfHtml = pdfItems.length > 0
        ? `
          <div class="pdf-viewer">
            <iframe src="${escapeHtml(pdfItems[0].file_path)}" title="${escapeHtml(pdfItems[0].title || pdfItems[0].file_name || 'PDF preview')}" type="application/pdf"></iframe>
          </div>
        `
        : '';

      const galleryHtml = otherItems.length > 0 ? `
        <div class="media-grid">
          ${otherItems.map(item => {
            const filePath = escapeHtml(item.file_path || '');
            const title = escapeHtml(item.title || item.file_name || 'Media file');
            const isVideo = String(item.file_type).toLowerCase() === 'video';

            if (isVideo) {
              return `
                <div class="media-item">
                  <div class="media-preview">
                    <video controls preload="metadata">
                      <source src="${filePath}">
                    </video>
                  </div>
                  <div class="media-meta">${title}</div>
                </div>
              `;
            }

            if (item.file_type === 'audio') {
              return `<div class="media-item"><audio controls preload="metadata" src="${filePath}"></audio><div class="media-meta">${title}</div></div>`;
            }

            return `
              <div class="media-item">
                <div class="media-preview">
                  <a class="media-preview-link" href="${filePath}" target="_blank" rel="noopener">
                    <img src="${filePath}" alt="${title}" />
                  </a>
                </div>
                <div class="media-meta">
                  <div>${title}</div>
                  <div class="media-actions">
                    <a href="${filePath}" target="_blank" rel="noopener">Quick Look</a>
                    <a href="${filePath}" download>Download</a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : '';

      mediaGallery.innerHTML = `
        <div class="media-category-label">${label}</div>
        ${pdfHtml}
        ${galleryHtml}
      `;
    }

    let mediaRequest = 0;
    async function loadMedia(category) {
      const request = ++mediaRequest;
      try {
        const items = await portfolioStorage.load(category);
        if (request === mediaRequest) renderMedia(category, items);
      } catch (error) {
        console.error('Unable to load multimedia:', error);
        if (request === mediaRequest) mediaGallery.innerHTML = '<div class="empty-state">Unable to load files right now. Please try again later.</div>';
      }
    }

    function triggerMediaTransition(card) {
      const detailGrid = card.closest('.detail-grid');
      if (!detailGrid) return;

      detailGrid.classList.remove('is-transitioning');
      void detailGrid.offsetWidth;
      detailGrid.classList.add('is-transitioning');

      setTimeout(() => {
        detailGrid.classList.remove('is-transitioning');
      }, 300);
    }

    mediaCards.forEach(card => {
      card.addEventListener('click', () => {
        mediaCards.forEach(item => item.classList.toggle('is-active', item === card));
        triggerMediaTransition(card);

        const detailGrid = card.closest('.detail-grid');
        if (detailGrid) {
          detailGrid.classList.add('is-transitioning');
        }

        mediaGallery.classList.remove('is-visible');
        mediaGallery.innerHTML = '';

        loadMedia(card.dataset.category).then(() => {
          requestAnimationFrame(() => mediaGallery.classList.add('is-visible'));
        });
      });
    });

mediaCards[0].click();
