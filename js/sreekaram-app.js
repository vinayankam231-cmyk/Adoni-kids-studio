/**
 * ADONI KIDS STUDIO — SREEKARAM-INSPIRED LUXURY JAVASCRIPT ENGINE
 * Handles:
 *  1. Fullscreen Cinematic Hero Slider with Ken Burns & Progress Indicators
 *  2. Ambient Procedural Music & Audio Player (Web Audio API + Audio fallback)
 *  3. Interactive Package Estimator & Real-Time Price Engine
 *  4. Client-Side Official PDF Quotation Generator (via jsPDF)
 *  5. Instant WhatsApp Proposal Dispatch
 *  6. Filterable 38-Photo Stories Gallery & Fullscreen Lightbox
 *  7. Smooth Scrolling & Header Glass Transitions
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA DEFINITIONS
  // =========================================================================

  const PACKAGE_PRESETS = {
    royal: {
      id: 'royal',
      title: 'Royal Heirloom Collection',
      price: 25000,
      badge: 'Most Popular',
      desc: 'Complete newborn heirloom experience featuring 3 theme sets, handcrafted 3D baby hand & foot casting frame, silk album, and parents inclusion.',
      includedServices: ['nb_base', 'nb_harry_potter', 'nb_sunflower', 'cast_standard', 'album_silk', 'fam_parents']
    },
    journey: {
      id: 'journey',
      title: 'Maternity to First Steps',
      price: 32000,
      badge: 'Best Value',
      desc: 'The complete maternity-through-milestone chapter: Designer maternity gown session, newborn theme sanctuary, and 1st birthday cake smash.',
      includedServices: ['mat_gown_rental', 'nb_base', 'nb_boss_baby', 'bday_grand_piano', 'album_silk']
    },
    milestone: {
      id: 'milestone',
      title: 'Grand Birthday Celebration',
      price: 18000,
      badge: 'Celebration',
      desc: 'High-energy milestone celebration featuring 2 bespoke setups (Grand Piano, Bullock Cart or BMW), cake smash, and family portraits.',
      includedServices: ['bday_grand_piano', 'bday_bullock_cart', 'fam_parents', 'album_silk']
    },
    bespoke: {
      id: 'bespoke',
      title: 'Bespoke Custom Session',
      price: 8000,
      badge: 'Flexible',
      desc: 'Design your own tailored studio session from scratch. Select exactly the themes, 3D castings, wardrobe styling, and keepsakes you desire.',
      includedServices: ['nb_base']
    }
  };

  const SERVICES_CATALOG = {
    // Newborn Category
    nb_base: { id: 'nb_base', category: 'newborn', title: 'Newborn Sanctuary Base Session', price: 8000, desc: '3-hour temperature regulated shoot, beanbag poses, swaddles & wraps' },
    nb_harry_potter: { id: 'nb_harry_potter', category: 'newborn', title: 'Harry Potter Wizard Theme', price: 2500, desc: 'Authentic wand, vintage spell books, Gryffindor scarf & glasses' },
    nb_boss_baby: { id: 'nb_boss_baby', category: 'newborn', title: 'Boss Baby Executive Theme', price: 2500, desc: 'Mini business suit, aviator shades, silver briefcase & tie' },
    nb_sunflower: { id: 'nb_sunflower', category: 'newborn', title: 'Sunflower Heart Floral Theme', price: 2500, desc: 'Handcrafted floral heart wreath with blooming sunflowers' },
    nb_twin_heart: { id: 'nb_twin_heart', category: 'newborn', title: 'Twin Heart Wooden Bowl Theme', price: 2500, desc: 'Handmade rustic cedar heart bowl with faux sheepskin cushions' },
    nb_hammock: { id: 'nb_hammock', category: 'newborn', title: 'Rustic Ivy Hammock Swing', price: 2000, desc: 'Suspended floral swing with gentle ivy vines and soft wraps' },

    // Family Category
    fam_parents: { id: 'fam_parents', category: 'family', title: 'Parents & Baby Intimate Tribute', price: 3000, desc: 'Classic black-and-white silhouettes and warm tender embraces' },
    fam_sibling: { id: 'fam_sibling', category: 'family', title: 'Sibling Bond Experience', price: 2000, desc: 'Tender older brother/sister bonding moments with newborn' },
    fam_generations: { id: 'fam_generations', category: 'family', title: 'Multi-Generational Heritage', price: 3500, desc: 'Grandparents, parents and child profile lineage tribute' },

    // Maternity Category
    mat_gown_rental: { id: 'mat_gown_rental', category: 'maternity', title: 'Designer Fairytale Gown Styling', price: 3000, desc: 'Imported lavender tiered tulle & vibrant yellow ruffle gowns' },
    mat_saree_heritage: { id: 'mat_saree_heritage', category: 'maternity', title: 'Royal Kanchipuram Silk & Temple Shoot', price: 4000, desc: 'Outdoor heritage temple steps in royal red & green silks' },
    mat_editorial_bw: { id: 'mat_editorial_bw', category: 'maternity', title: 'Editorial Fedora B&W Silhouette', price: 2500, desc: 'High-fashion editorial lighting in studio with dramatic fedora hat' },

    // Pre-Birthday Category
    bday_grand_piano: { id: 'bday_grand_piano', category: 'pre-birthday', title: 'Vintage White Grand Piano Theme', price: 2500, desc: 'Miniature white grand piano with floral garland & score sheet' },
    bday_bullock_cart: { id: 'bday_bullock_cart', category: 'pre-birthday', title: 'Traditional Village Bullock Cart', price: 2500, desc: 'Authentic rustic wooden cart, brass lanterns & village backdrop' },
    bday_bmw: { id: 'bday_bmw', category: 'pre-birthday', title: 'Red Electric BMW Sports Car', price: 2500, desc: 'Ride-on miniature BMW sports car with headlight effects' },
    bday_moon: { id: 'bday_moon', category: 'pre-birthday', title: 'Sunlit Crescent Moon Prop', price: 2000, desc: 'Yellow crescent moon with starry clouds and floral embellishments' },

    // 3D Hand & Foot Castings Category
    cast_basic: { id: 'cast_basic', category: 'castings', title: 'Basic 3D Casting (Bowl or Frame)', price: 6000, desc: 'Couple 2 hands in glass bowl OR baby 1 hand & 1 foot basic frame' },
    cast_standard: { id: 'cast_standard', category: 'castings', title: 'Standard 4 Castings (2 Hands + 2 Feet)', price: 11000, desc: 'Complete baby 2 hands + 2 feet with birth details in custom frame' },
    cast_premium: { id: 'cast_premium', category: 'castings', title: 'Premium Family Frame (4 Castings)', price: 15000, desc: 'Baby 2 hands + 2 feet + 1 mother & 1 father holding hand casting' },
    cast_siblings: { id: 'cast_siblings', category: 'castings', title: 'Siblings 3D Keepsake Frame', price: 15000, desc: 'Baby 1 (2H+2F) and Baby 2 (2H+2F) united in grand keepsake frame' },
    cast_extra_hand: { id: 'cast_extra_hand', category: 'castings', title: 'Extra Single Hand / Foot Add-on', price: 2000, desc: 'Individual metallic gold or silver casting addition' },

    // Keepsakes & Digital
    album_silk: { id: 'album_silk', category: 'keepsakes', title: 'Handcrafted Silk Linen Photo Album', price: 4500, desc: '20-page seamless flush-mount album with foil embossed cover' },
    video_4k_teaser: { id: 'video_4k_teaser', category: 'keepsakes', title: '4K Cinematic Teaser Film (3-5 mins)', price: 5000, desc: 'Color-graded emotional family teaser set to acoustic music' },
    video_raw: { id: 'video_raw', category: 'keepsakes', title: 'Complete Uncut 4K Raw Video Footage', price: 3000, desc: 'Full digital raw master archives on USB or high-speed cloud drive' }
  };

  // State
  let currentPresetId = 'royal';
  let activeSelectedServices = new Set(PACKAGE_PRESETS.royal.includedServices);
  let activeServiceTab = 'newborn';

  // =========================================================================
  // 2. HERO SLIDESHOW LOGIC
  // =========================================================================
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const pagBtns = document.querySelectorAll('.hero-pag-btn');
    if (!slides.length) return;

    let currentIndex = 0;
    let slideInterval = null;
    const intervalTime = 6000;

    function goToSlide(index) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });
      pagBtns.forEach((b, i) => {
        b.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }

    function startTimer() {
      stopTimer();
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopTimer() {
      if (slideInterval) clearInterval(slideInterval);
    }

    pagBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        goToSlide(idx);
        startTimer();
      });
    });

    const heroWrap = document.querySelector('.cinematic-hero-section');
    if (heroWrap) {
      heroWrap.addEventListener('mouseenter', stopTimer);
      heroWrap.addEventListener('mouseleave', startTimer);

      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      heroWrap.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroWrap.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          nextSlide();
          startTimer();
        } else if (touchEndX - touchStartX > 50) {
          const prev = (currentIndex - 1 + slides.length) % slides.length;
          goToSlide(prev);
          startTimer();
        }
      }, { passive: true });
    }

    startTimer();
  }

  // =========================================================================
  // 3. AMBIENT AUDIO PLAYER (Web Audio API Synthesizer + Audio Fallback)
  // =========================================================================
  function initAmbientAudio() {
    const musicBtn = document.getElementById('musicToggleBtn');
    if (!musicBtn) return;

    let isPlaying = false;
    let audioCtx = null;
    let synthInterval = null;

    // Gentle relaxing pentatonic lullaby notes: C4, D4, E4, G4, A4, C5, E5
    const noteFrequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];

    function playLullabyChime() {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Random harmonic selection
        const freq = noteFrequencies[Math.floor(Math.random() * noteFrequencies.length)];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Soft bell-like envelope
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);
      } catch (err) {
        console.warn('Audio synthesis issue:', err);
      }
    }

    function startAmbientSynth() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playLullabyChime();
      synthInterval = setInterval(playLullabyChime, 1800);
    }

    function stopAmbientSynth() {
      if (synthInterval) clearInterval(synthInterval);
      if (audioCtx && audioCtx.state === 'running') {
        audioCtx.suspend();
      }
    }

    musicBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      musicBtn.classList.toggle('playing', isPlaying);
      const label = musicBtn.querySelector('.music-btn-text');

      if (isPlaying) {
        startAmbientSynth();
        if (label) label.textContent = 'Audio On';
      } else {
        stopAmbientSynth();
        if (label) label.textContent = 'Ambient Music';
      }
    });
  }

  // =========================================================================
  // 4. INTERACTIVE PACKAGE ESTIMATOR & PROPOSAL ENGINE
  // =========================================================================
  function calculateTotal() {
    let total = 0;
    activeSelectedServices.forEach(id => {
      if (SERVICES_CATALOG[id]) {
        total += SERVICES_CATALOG[id].price;
      }
    });
    return total;
  }

  function updateEstimatorUI() {
    const total = calculateTotal();
    const formatted = '₹' + total.toLocaleString('en-IN');

    // Update live total badges
    const liveDisplays = document.querySelectorAll('.estimator-live-value, #estimatorGrandTotal');
    liveDisplays.forEach(el => {
      el.textContent = formatted;
    });

    const countDisplays = document.querySelectorAll('.selected-count-badge');
    countDisplays.forEach(el => {
      el.textContent = `${activeSelectedServices.size} Services & Options Selected`;
    });

    // Update preset cards
    document.querySelectorAll('.preset-card').forEach(card => {
      const pId = card.getAttribute('data-preset');
      card.classList.toggle('active', pId === currentPresetId);
    });

    // Update service toggle cards
    document.querySelectorAll('.toggle-card').forEach(card => {
      const sId = card.getAttribute('data-service-id');
      card.classList.toggle('selected', activeSelectedServices.has(sId));
    });
  }

  function applyPreset(presetId) {
    if (!PACKAGE_PRESETS[presetId]) return;
    currentPresetId = presetId;
    activeSelectedServices = new Set(PACKAGE_PRESETS[presetId].includedServices);
    updateEstimatorUI();
  }

  function renderServiceToggles(category) {
    const container = document.getElementById('serviceToggleGrid');
    if (!container) return;

    activeServiceTab = category;
    container.innerHTML = '';

    const items = Object.values(SERVICES_CATALOG).filter(s => s.category === category);

    items.forEach(service => {
      const isSelected = activeSelectedServices.has(service.id);
      const card = document.createElement('div');
      card.className = `toggle-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('data-service-id', service.id);

      card.innerHTML = `
        <div class="toggle-checkbox">
          <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div class="toggle-card-info">
          <h4 class="toggle-card-title">${service.title}</h4>
          <p class="toggle-card-desc">${service.desc}</p>
          <span class="toggle-card-price">+₹${service.price.toLocaleString('en-IN')}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (activeSelectedServices.has(service.id)) {
          activeSelectedServices.delete(service.id);
        } else {
          activeSelectedServices.add(service.id);
        }
        // If modified, mark preset as custom/bespoke
        if (currentPresetId !== 'bespoke') {
          currentPresetId = 'bespoke';
        }
        updateEstimatorUI();
      });

      container.appendChild(card);
    });
  }

  function initEstimator() {
    // Presets click
    document.querySelectorAll('.preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.getAttribute('data-preset');
        applyPreset(pId);
      });
    });

    // Category Tabs click
    document.querySelectorAll('.service-cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.service-cat-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-cat');
        renderServiceToggles(cat);
      });
    });

    // Initial render
    renderServiceToggles('newborn');
    updateEstimatorUI();

    // "Configure In Package" buttons from Discipline Cards
    document.querySelectorAll('.btn-configure-package').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetCat = btn.getAttribute('data-category');
        const estimatorSection = document.getElementById('estimator');
        if (estimatorSection) {
          estimatorSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (targetCat) {
          const tab = document.querySelector(`.service-cat-tab[data-cat="${targetCat}"]`);
          if (tab) {
            document.querySelectorAll('.service-cat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderServiceToggles(targetCat);
          }
        }
      });
    });

    // Generate Proposal Modal Trigger
    const generateBtn = document.getElementById('btnGenerateProposal');
    const modalBackdrop = document.getElementById('proposalModal');
    const closeBtn = document.getElementById('modalCloseBtn');

    if (generateBtn && modalBackdrop) {
      generateBtn.addEventListener('click', () => {
        openProposalModal();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modalBackdrop.classList.remove('open');
        });
      }

      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          modalBackdrop.classList.remove('open');
        }
      });
    }

    // Modal Download PDF Button
    const downloadPdfBtn = document.getElementById('btnDownloadPdf');
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', generatePdfQuotation);
    }

    // WhatsApp Proposal Button
    const whatsappBtn = document.getElementById('btnWhatsAppProposal');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', dispatchWhatsAppProposal);
    }
  }

  // =========================================================================
  // 5. PROPOSAL MODAL & INVOICE BREAKDOWN
  // =========================================================================
  function getClientFormData() {
    return {
      name: document.getElementById('clientName')?.value.trim() || 'Valued Parent',
      phone: document.getElementById('clientPhone')?.value.trim() || '',
      date: document.getElementById('clientDate')?.value || 'Preferred Date',
      notes: document.getElementById('clientNotes')?.value.trim() || ''
    };
  }

  function openProposalModal() {
    const modal = document.getElementById('proposalModal');
    const itemsContainer = document.getElementById('modalInvoiceItems');
    const totalEl = document.getElementById('modalInvoiceTotal');
    const clientSummaryEl = document.getElementById('modalClientDetails');
    if (!modal || !itemsContainer) return;

    const client = getClientFormData();
    if (clientSummaryEl) {
      clientSummaryEl.textContent = `Prepared for: ${client.name} ${client.phone ? `(${client.phone})` : ''} • Date: ${client.date}`;
    }

    itemsContainer.innerHTML = '';
    let grandTotal = 0;

    activeSelectedServices.forEach(sId => {
      const item = SERVICES_CATALOG[sId];
      if (item) {
        grandTotal += item.price;
        const row = document.createElement('div');
        row.className = 'invoice-item-row';
        row.innerHTML = `
          <span>${item.title}</span>
          <span style="font-weight: 700; color: var(--text-dark);">₹${item.price.toLocaleString('en-IN')}</span>
        `;
        itemsContainer.appendChild(row);
      }
    });

    if (totalEl) {
      totalEl.textContent = '₹' + grandTotal.toLocaleString('en-IN');
    }

    modal.classList.add('open');
  }

  // =========================================================================
  // 6. CLIENT-SIDE PDF GENERATION (via jsPDF)
  // =========================================================================
  function generatePdfQuotation() {
    const client = getClientFormData();
    const grandTotal = calculateTotal();

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('Generating proposal... (jsPDF is loading, please try in 2 seconds)');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Dark header bar
    doc.setFillColor(27, 16, 15);
    doc.rect(0, 0, 210, 38, 'F');

    // Gold accent hairline
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 38, 210, 2, 'F');

    // Title & Studio Info
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('ADONI KIDS STUDIO', 15, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(212, 175, 55);
    doc.text('LUXURY NEWBORN, MATERNITY & 3D CASTINGS SANCTUARY', 15, 25);

    doc.setFontSize(8);
    doc.text('Shanti Estate, Vimala Regency, New Five Star to Hotel Road, Near Mahima Church, Adoni, AP 518301 | +91 94410 05963', 15, 31);

    // Date & Quotation ID
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const quoteNum = 'AKS-' + Math.floor(100000 + Math.random() * 900000);

    doc.setTextColor(50, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('OFFICIAL SESSION ESTIMATE & PROPOSAL', 15, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 90, 88);
    doc.text(`Quote Reference: ${quoteNum}`, 145, 50);
    doc.text(`Issue Date: ${today}`, 145, 55);

    // Client Details Box
    doc.setFillColor(250, 247, 242);
    doc.roundedRect(15, 58, 180, 22, 2, 2, 'F');

    doc.setTextColor(27, 16, 15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CLIENT DETAILS:', 20, 66);

    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${client.name}`, 20, 73);
    doc.text(`Contact: ${client.phone || 'Provided via WhatsApp'}`, 90, 73);
    doc.text(`Target Shoot Date: ${client.date}`, 140, 73);

    // Itemized Table Header
    let y = 90;
    doc.setFillColor(40, 25, 22);
    doc.rect(15, y, 180, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('NO.', 18, y + 5.5);
    doc.text('SERVICE / DELIVERABLE DESCRIPTION', 32, y + 5.5);
    doc.text('CATEGORY', 125, y + 5.5);
    doc.text('INVESTMENT (INR)', 160, y + 5.5);

    y += 8;
    let itemIdx = 1;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    activeSelectedServices.forEach(sId => {
      const item = SERVICES_CATALOG[sId];
      if (item) {
        // Zebra striping
        if (itemIdx % 2 === 0) {
          doc.setFillColor(252, 250, 246);
          doc.rect(15, y, 180, 7.5, 'F');
        }

        doc.setTextColor(40, 30, 28);
        doc.text(String(itemIdx), 18, y + 5);
        doc.text(item.title, 32, y + 5);
        doc.text(item.category.toUpperCase(), 125, y + 5);
        doc.setFont('helvetica', 'bold');
        doc.text('INR ' + item.price.toLocaleString('en-IN'), 165, y + 5);
        doc.setFont('helvetica', 'normal');

        y += 7.5;
        itemIdx++;
      }
    });

    // Grand Total Box
    y += 5;
    doc.setFillColor(245, 236, 225);
    doc.rect(15, y, 180, 12, 'F');
    doc.setFillColor(212, 175, 55);
    doc.rect(15, y + 12, 180, 1.5, 'F');

    doc.setTextColor(27, 16, 15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('ESTIMATED TOTAL INVESTMENT:', 22, y + 8);
    doc.setFontSize(13);
    doc.setTextColor(189, 67, 39);
    doc.text('INR ' + grandTotal.toLocaleString('en-IN'), 155, y + 8);

    // Studio Terms & Sanitary Guarantee
    y += 24;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(27, 16, 15);
    doc.text('STUDIO SANCTUARY TERMS & GUARANTEE:', 15, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 90, 88);
    const terms = [
      '1. 100% Medical-grade hygiene: All wraps, props, and surfaces are steam-sanitized before every newborn session.',
      '2. Baby Safety Certified: Our photographers follow strict newborn safety handling and temperature regulation protocols.',
      '3. 3D Castings are handcrafted with hypoallergenic dental-grade organic molding powder, 100% gentle on infant skin.',
      '4. Slot confirmation requires 20% advance booking deposit; balance settled on session day.',
      '5. Retouched master digital photographs and private cloud portal delivered within 10-14 working days.'
    ];

    terms.forEach(t => {
      doc.text(t, 15, y);
      y += 4.5;
    });

    // Signature stamp
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(27, 16, 15);
    doc.text('Authorized Studio Signature', 145, y);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(212, 175, 55);
    doc.text('Adoni Kids Studio Management', 145, y + 4.5);

    // Save PDF
    const cleanFileName = `Adoni_Kids_Studio_Proposal_${client.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(cleanFileName);
  }

  // =========================================================================
  // 7. INSTANT WHATSAPP PROPOSAL DISPATCH
  // =========================================================================
  function dispatchWhatsAppProposal() {
    const client = getClientFormData();
    const grandTotal = calculateTotal();

    let text = `*ADONI KIDS STUDIO — SESSION BOOKING INQUIRY*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *Client Name:* ${client.name}\n`;
    if (client.phone) text += `📞 *Phone:* ${client.phone}\n`;
    text += `📅 *Preferred Date:* ${client.date}\n`;
    text += `✨ *Curated Preset:* ${PACKAGE_PRESETS[currentPresetId]?.title || 'Bespoke Package'}\n\n`;
    text += `*Selected Services & Deliverables:*\n`;

    let idx = 1;
    activeSelectedServices.forEach(sId => {
      const item = SERVICES_CATALOG[sId];
      if (item) {
        text += `${idx}. ${item.title} — ₹${item.price.toLocaleString('en-IN')}\n`;
        idx++;
      }
    });

    text += `\n💰 *Estimated Total Investment:* ₹${grandTotal.toLocaleString('en-IN')}\n`;
    if (client.notes) text += `📝 *Notes:* ${client.notes}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Hello team, I configured this proposal on your website and would like to confirm studio availability for our shoot!`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/919110755917?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  }

  // =========================================================================
  // 8. STORIES GALLERY FILTERING & FULLSCREEN LIGHTBOX
  // =========================================================================
  function initGalleryAndLightbox() {
    const filterTabs = document.querySelectorAll('.story-filter-tab');
    const storyCards = document.querySelectorAll('.story-card');
    const lightbox = document.getElementById('sreekaramLightbox');
    if (!filterTabs.length) return;

    // Filtering logic
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');

        storyCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (filter === 'all' || cardCat === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Lightbox Logic
    if (!lightbox) return;
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxSubtitle = lightbox.querySelector('.lightbox-subtitle');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    let currentCardIndex = 0;
    const visibleCards = () => Array.from(storyCards).filter(c => c.style.display !== 'none');

    function openLightboxForIndex(idx) {
      const cards = visibleCards();
      if (!cards[idx]) return;
      currentCardIndex = idx;
      const card = cards[idx];
      const img = card.querySelector('img');
      const title = card.querySelector('.story-title')?.textContent || 'Studio Moment';
      const sub = card.querySelector('.story-subtitle')?.textContent || 'Adoni Kids Studio';

      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxSubtitle) lightboxSubtitle.textContent = sub;
      lightbox.classList.add('open');
    }

    storyCards.forEach(card => {
      card.addEventListener('click', () => {
        const cards = visibleCards();
        const idx = cards.indexOf(card);
        if (idx !== -1) openLightboxForIndex(idx);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cards = visibleCards();
        currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        openLightboxForIndex(currentCardIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cards = visibleCards();
        currentCardIndex = (currentCardIndex + 1) % cards.length;
        openLightboxForIndex(currentCardIndex);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('open');
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

  // =========================================================================
  // 9. HEADER SCROLL & MOBILE DRAWER
  // =========================================================================
  function initHeaderAndMobileDrawer() {
    const header = document.querySelector('.sreekaram-header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }, { passive: true });
    }

    const toggle = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const closeBtn = document.querySelector('.mobile-drawer-close');

    function openDrawer() {
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
    }

    function closeDrawer() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    }

    if (toggle) toggle.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.querySelectorAll('.mobile-nav-list a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // =========================================================================
  // INITIALIZATION ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initAmbientAudio();
    initEstimator();
    initGalleryAndLightbox();
    initHeaderAndMobileDrawer();
  });

})();
