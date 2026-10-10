/**
 * PMIC REPARACIONES - Interactive Engine
 * Santa Rosa, La Pampa | WhatsApp: 2954274960
 */

document.addEventListener('DOMContentLoaded', () => {
  initCircuitBackground();
  initHeaderScroll();
  initMobileMenu();
  initQuoteCalculator();
  initFloatingWhatsApp();
  initFaqAccordion();
  init3DCardTilt();
});

/* ==========================================================================
   1. HIGH-TECH PCB CANVAS BACKGROUND ANIMATION
   ========================================================================== */
function initCircuitBackground() {
  const canvas = document.getElementById('circuit-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initNodes();
  });

  // Circuit trace nodes
  let nodes = [];
  const nodeCount = Math.floor((width * height) / 45000);

  function initNodes() {
    nodes = [];
    for (let i = 0; i < Math.max(30, nodeCount); i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI,
        color: Math.random() > 0.85 ? '#00e5ff' : '#ff6a00'
      });
    }
  }
  initNodes();

  let pulses = [];
  function addPulse() {
    if (nodes.length < 2) return;
    const n1 = nodes[Math.floor(Math.random() * nodes.length)];
    const n2 = nodes[Math.floor(Math.random() * nodes.length)];
    const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
    if (dist < 180 && dist > 20) {
      pulses.push({
        x1: n1.x, y1: n1.y,
        x2: n2.x, y2: n2.y,
        progress: 0,
        speed: 0.02 + Math.random() * 0.02,
        color: '#ff9d3b'
      });
    }
  }

  setInterval(addPulse, 350);

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw static connection lines
    ctx.lineWidth = 0.6;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = 1 - dist / 140;
          ctx.strokeStyle = `rgba(255, 106, 0, ${alpha * 0.18})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Render & update pulses
    for (let p = pulses.length - 1; p >= 0; p--) {
      const pulse = pulses[p];
      pulse.progress += pulse.speed;
      if (pulse.progress >= 1) {
        pulses.splice(p, 1);
        continue;
      }
      const curX = pulse.x1 + (pulse.x2 - pulse.x1) * pulse.progress;
      const curY = pulse.y1 + (pulse.y2 - pulse.y1) * pulse.progress;

      ctx.fillStyle = pulse.color;
      ctx.shadowColor = '#ff6a00';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Render nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      n.pulse += 0.03;
      const alpha = 0.3 + Math.sin(n.pulse) * 0.2;

      ctx.fillStyle = n.color === '#00e5ff' ? `rgba(0, 229, 255, ${alpha})` : `rgba(255, 106, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. HEADER SCROLL & MOBILE MENU
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  // Close when clicking any nav link
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ==========================================================================
   3. SMART WHATSAPP QUOTE CALCULATOR (COTIZADOR INTERACTIVO)
   ========================================================================== */
const SUGGESTED_MODELS = {
  android: ['Samsung S24 / S23 / A54', 'Motorola Edge / G84', 'Xiaomi Redmi Note 13', 'Samsung A34 / A14', 'Motorola Moto G53', 'Otro Android'],
  iphone: ['iPhone 15 / 15 Pro', 'iPhone 14 / 14 Pro Max', 'iPhone 13 / 13 Pro', 'iPhone 12 / 12 mini', 'iPhone 11 / 11 Pro', 'iPhone X / XR / XS', 'Otro iPhone'],
  notebook: ['Lenovo IdeaPad / ThinkPad', 'HP Pavilion / 250 G8', 'Dell Inspiron / Vostro', 'Asus TUF / ZenBook', 'MacBook Air / Pro (M1/M2/Intel)', 'Acer Nitro / Aspire', 'Otra Notebook / PC'],
  console: ['PlayStation 5 (Disco / Digital)', 'PlayStation 4 Pro / Slim / Fat', 'Xbox Series X / Series S', 'Nintendo Switch / OLED', 'Joystick PS5 / PS4 (Drift)', 'Otra Consola']
};

function initQuoteCalculator() {
  const deviceButtons = document.querySelectorAll('.device-btn');
  const modelInput = document.getElementById('quote-model');
  const chipsContainer = document.getElementById('quick-models-container');
  const issueSelect = document.getElementById('quote-issue');
  const detailsInput = document.getElementById('quote-details');
  const urgencyRadios = document.querySelectorAll('input[name="quote-urgency"]');
  const ticketPreview = document.getElementById('ticket-preview-content');
  const sendWhatsAppBtn = document.getElementById('btn-send-quote-wa');
  const copyQuoteBtn = document.getElementById('btn-copy-quote');

  let selectedDevice = 'android';
  let deviceName = 'Celular Android';

  // Device Button Click Handler
  deviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDevice = btn.dataset.device;
      deviceName = btn.querySelector('span').innerText;
      updateModelSuggestions();
      updateTicket();
    });
  });

  // Model suggestions updater
  function updateModelSuggestions() {
    if (!chipsContainer) return;
    chipsContainer.innerHTML = '';
    const models = SUGGESTED_MODELS[selectedDevice] || [];
    models.forEach(model => {
      const chip = document.createElement('span');
      chip.className = 'model-chip';
      chip.innerText = model;
      chip.addEventListener('click', () => {
        modelInput.value = model;
        updateTicket();
      });
      chipsContainer.appendChild(chip);
    });
  }

  // Live input change listeners
  if (modelInput) modelInput.addEventListener('input', updateTicket);
  if (issueSelect) issueSelect.addEventListener('change', updateTicket);
  if (detailsInput) detailsInput.addEventListener('input', updateTicket);
  urgencyRadios.forEach(r => r.addEventListener('change', () => {
    document.querySelectorAll('.urgency-option').forEach(opt => opt.classList.remove('active'));
    r.closest('.urgency-option').classList.add('active');
    updateTicket();
  }));

  // Construct message & update preview
  function generateQuoteData() {
    const model = modelInput.value.trim() || 'No especificado (Consultar)';
    const issue = issueSelect.options[issueSelect.selectedIndex].text;
    const details = detailsInput.value.trim() || 'Sin detalles extra';
    const urgency = document.querySelector('input[name="quote-urgency"]:checked')?.value === 'express' 
      ? '⚡ EXPRESS EN EL DÍA' 
      : '🕒 NORMAL (Diagnóstico estándar)';

    const previewText = `⚡ PMIC REPARACIONES - TICKET DIGITAL ⚡
--------------------------------------
📱 DISPOSITIVO : ${deviceName}
🏷️ MODELO      : ${model}
⚠️ FALLA       : ${issue}
⏱️ PRIORIDAD   : ${urgency}
📝 DETALLES    : ${details}
📍 UBICACIÓN   : Santa Rosa, La Pampa
💳 PAGOS       : Todos los medios (Tarjetas/MP/Transf)
🛡️ GARANTÍA    : 30 Días (Ley 24.240 Defensa Consumidor)
--------------------------------------
Sujeto a términos y condiciones legales.`;

    const whatsappMessage = `👋 ¡Hola PMIC Reparaciones! Vengo desde su página web y quiero solicitar presupuesto para mi equipo:

🛠️ *DISPOSITIVO:* ${deviceName}
📲 *MODELO:* ${model}
⚠️ *PROBLEMA:* ${issue}
⏱️ *URGENCIA:* ${urgency}
💬 *DETALLE:* ${details}
🛡️ *GARANTÍA:* 30 Días (Ley 24.240)

📍 *Localidad:* Santa Rosa, La Pampa
¿Podrían confirmarme disponibilidad y costo estimado? ¡Muchas gracias!`;

    return { previewText, whatsappMessage };
  }

  function updateTicket() {
    const { previewText } = generateQuoteData();
    if (ticketPreview) {
      ticketPreview.innerText = previewText;
    }
  }

  // Send WhatsApp Button Action
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { whatsappMessage } = generateQuoteData();
      const targetPhone = '5492954274960';
      const encodedMsg = encodeURIComponent(whatsappMessage);
      const url = `https://wa.me/${targetPhone}?text=${encodedMsg}`;
      window.open(url, '_blank');
      showToast('¡Redirigiendo a WhatsApp con tu cotización!');
    });
  }

  // Copy Ticket Button Action
  if (copyQuoteBtn) {
    copyQuoteBtn.addEventListener('click', () => {
      const { previewText } = generateQuoteData();
      navigator.clipboard.writeText(previewText).then(() => {
        showToast('¡Ticket copiado al portapapeles!');
      }).catch(() => {
        showToast('Presupuesto listo para enviar');
      });
    });
  }

  // Initialize defaults
  updateModelSuggestions();
  updateTicket();
}

/* ==========================================================================
   4. FLOATING WHATSAPP RADAR & QUICK POPUP
   ========================================================================== */
function initFloatingWhatsApp() {
  const radarBtn = document.getElementById('whatsapp-radar-btn');
  const popup = document.getElementById('whatsapp-quick-popup');
  const closePopupBtn = document.getElementById('whatsapp-popup-close');
  const quickSendBtn = document.getElementById('whatsapp-popup-send');
  const quickInput = document.getElementById('whatsapp-quick-input');

  if (!radarBtn || !popup) return;

  radarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.toggle('active');
  });

  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.classList.remove('active');
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && !radarBtn.contains(e.target)) {
      popup.classList.remove('active');
    }
  });

  if (quickSendBtn) {
    quickSendBtn.addEventListener('click', () => {
      const userMsg = quickInput ? quickInput.value.trim() : '';
      const text = userMsg 
        ? `Hola PMIC Reparaciones! Consulta: ${userMsg}`
        : `Hola PMIC Reparaciones! Me comunico desde su sitio web, ¿podrían asesorarme sobre una reparación?`;
      const url = `https://wa.me/5492954274960?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      popup.classList.remove('active');
    });
  }
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. 3D CARD TILT EFFECT (DESKTOP)
   ========================================================================== */
function init3DCardTilt() {
  const card = document.querySelector('.tech-card-3d');
  if (!card || window.innerWidth < 1024) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 14;
    const rotY = (x / rect.width) * 14;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* ==========================================================================
   7. UTILITY: TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #ff6a00;"></i> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
