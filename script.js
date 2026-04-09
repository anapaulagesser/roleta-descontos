function resizeCanvas() {
  const size = canvas.offsetWidth;

  canvas.width = size;
  canvas.height = size;

  // recalcula centro e raio
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;

  radius = canvas.width * 0.42;

  drawWheel(currentRotation);
}

// Valores da roleta
const slices = [10, 15, 20, 25, 30];

// Cores das fatias
const colors = [
  '#ff4f93', // rosa mais forte
  '#4fb6e8', // azul mais vibrante
  '#ffd93d', // amarelo mais intenso
  '#5fd38c', // verde mais vivo
  '#9b6bff'  // roxo mais forte
];

// Número do WhatsApp (edite facilmente aqui)
const WHATSAPP_NUMBER = '5548999662043';

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultBox = document.getElementById('result');
const resultText = document.getElementById('resultText');
const whatsappBtn = document.getElementById('whatsappBtn');

let centerX;
let centerY;
let radius;
const sliceAngle = (2 * Math.PI) / slices.length;

let currentRotation = 0;
let spinning = false;

// Desenha a roleta
function drawWheel(rotation = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < slices.length; i++) {
    const startAngle = i * sliceAngle + rotation;
    const endAngle = startAngle + sliceAngle;

    // 🎨 Fatia
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = colors[i];
    ctx.fill();

    // 🔲 Borda
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // 🔢 TEXTO (CORRIGIDO)
  ctx.save();

ctx.translate(centerX, centerY);
ctx.rotate(startAngle + sliceAngle / 2);

const fontSize = canvas.width * 0.085;

ctx.font = `800 ${fontSize}px Baloo 2`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// 🔥 SOMBRA SUAVE (profissional)
ctx.shadowColor = 'rgba(0,0,0,0.25)';
ctx.shadowBlur = 4;

// 🔥 TEXTO BRANCO LIMPO (sem contorno feio)
ctx.fillStyle = '#ffffff';

// 🔥 POSIÇÃO PERFEITA
ctx.fillText(`${slices[i]}%`, radius * 0.58, 0);

ctx.restore();
  }

  // 🎯 Centro da roleta (IMPORTANTE — isso que sumiu antes)
  ctx.beginPath();
  ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#ff3d71';
  ctx.fill();
}
// Easing suave
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Calcula exatamente em qual fatia o ponteiro parou
function getResultIndex(finalRotation) {
  // O ponteiro está no topo (-90 graus)
  const pointerAngle = -Math.PI / 2;

  // Normaliza a rotação entre 0 e 2π
  let normalizedRotation = finalRotation % (2 * Math.PI);

  if (normalizedRotation < 0) {
    normalizedRotation += 2 * Math.PI;
  }

  // Corrige o offset do canvas e do ponteiro
  let adjustedAngle = (pointerAngle - normalizedRotation);

  while (adjustedAngle < 0) {
    adjustedAngle += 2 * Math.PI;
  }

  adjustedAngle = adjustedAngle % (2 * Math.PI);

  const index = Math.floor(adjustedAngle / sliceAngle);

  return index;
}

function spinWheel() {
  if (spinning) return;

  // Permite apenas 1 giro por usuário
  if (localStorage.getItem('wheelPlayed')) {
    alert('Você já girou a roleta! 🎁');
    return;
  }

  spinning = true;
  spinBtn.disabled = true;

  // Entre 6 e 10 voltas completas
  const extraSpins = 6 + Math.random() * 4;

  // Ângulo aleatório real
  const randomAngle = Math.random() * (2 * Math.PI);

  const startRotation = currentRotation;
  const finalRotation = currentRotation + (extraSpins * 2 * Math.PI) + randomAngle;

  const duration = 5000;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    currentRotation = startRotation + (finalRotation - startRotation) * eased;

    drawWheel(currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;

      const resultIndex = getResultIndex(currentRotation);
      const prize = slices[resultIndex];

      resultText.textContent = `🎉 Parabéns! Você ganhou ${prize}% OFF`;
      resultBox.classList.remove('hidden');

      const message = encodeURIComponent(
        `Oi! Ganhei ${prize}% de desconto na roleta 🎉`
      );

      whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      whatsappBtn.classList.remove('hidden');

      // Salva que já jogou
      localStorage.setItem('wheelPlayed', 'true');

      // Confete
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }

  requestAnimationFrame(animate);
}

// Desenho inicial
// Rotaciona inicialmente para que a primeira fatia fique alinhada corretamente
currentRotation = -Math.PI / 2;
drawWheel(currentRotation);

spinBtn.addEventListener('click', spinWheel);

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
