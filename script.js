// Valores da roleta
const slices = [10, 15, 20, 25, 30];

// Cores das fatias
const colors = [
  '#ff5fa2',
  '#5ec8ff',
  '#ffe45c',
  '#7be495',
  '#b388ff'
];

// Número do WhatsApp (edite facilmente aqui)
const WHATSAPP_NUMBER = '5548999662043';

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultBox = document.getElementById('result');
const resultText = document.getElementById('resultText');
const whatsappBtn = document.getElementById('whatsappBtn');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 240;
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

// 🔥 TEXTO GRANDE DE VERDADE
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Baloo 2';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

// 🔥 POSIÇÃO PERFEITA (mais perto do centro = parece maior)
  ctx.fillText(`${slices[i]}%`, radius * 0.5, 0);

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
