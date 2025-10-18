// ======================
// URL de Google Script
// ======================
const url = "https://script.google.com/macros/s/AKfycbz_PFtlBxVwqMFdFEbkTfxV8pWVcSyA3LQ3aWVdMQKhuvMkBTYm3The2TeHPFjGXP5nkg/exec";

document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // Fondo de partículas
  // ======================
  const canvas = document.createElement("canvas");
  canvas.id = "particles-bg";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  const numParticles = 70;
  const maxDistance = 150;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1
    });
  }

  const mouse = { x: null, y: null };
  window.addEventListener("mousemove", e => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      for (let q of particles) {
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          ctx.strokeStyle = `rgba(0,255,255,${1 - dist / maxDistance})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      if (mouse.x && mouse.y) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += dx / 2000;
          p.vy += dy / 2000;
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "-2";
  canvas.style.opacity = "0.4";

  // ======================
  // Pantalla de carga
  // ======================
  const loader = document.createElement("div");
  loader.id = "loading-screen";
  loader.innerHTML = `
    <div class="loader-box">
      <h2>🚀 Waspend Code</h2>
      <p>Enviando tus respuestas...</p>
      <div class="spinner"></div>
    </div>`;
  document.body.appendChild(loader);
  loader.style.display = "none";

  // ======================
  // Envío de formulario
  // ======================
  const form = document.getElementById("formEncuesta");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const boton = document.querySelector(".btn-enviar");
      boton.disabled = true;
      boton.textContent = "Enviando...";
      boton.classList.add("loading");

      loader.style.display = "flex";

      const datos = {
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value,
        pregunta1: document.querySelector('input[name="pregunta1"]:checked')?.value || "",
        pregunta2: document.getElementById("pregunta2").value,
        pregunta3: document.querySelector('input[name="pregunta3"]:checked')?.value || "",
        pregunta4: document.getElementById("pregunta4").value,
        pregunta5: document.querySelector('input[name="pregunta5"]:checked')?.value || "",
        pregunta6: document.getElementById("pregunta6").value
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify(datos)
        });

        if (res.ok) {
          boton.textContent = "✅ Enviado con éxito";
          boton.classList.remove("loading");
          boton.classList.add("success");

          e.target.reset();

          setTimeout(() => {
            loader.style.display = "none";
            window.location.href = "index.html";
          }, 2500);

        } else {
          throw new Error("Error en el envío");
        }

      } catch (error) {
        loader.style.display = "none";
        boton.textContent = "⚠️ Error, reintenta";
        boton.classList.remove("loading");
        boton.classList.add("error");

        setTimeout(() => {
          boton.disabled = false;
          boton.textContent = "Reintentar envío";
          boton.classList.remove("error");
        }, 3000);

        console.error(error);
      }
    });
  }
});
