// Efeito de digitação e apagamento na primeira seção
document.addEventListener('DOMContentLoaded', () => {
    const typedTextElement = document.getElementById('typed-text');
    const words = ["Desenvolvedor Front-End", "Especialista WordPress", "UX and UI Designer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Velocidade de digitação (ms)
    let deletingSpeed = 50; // Velocidade de apagamento (ms)
    let delayBetweenWords = 1500; // Atraso antes de apagar/digitar a próxima palavra (ms)

    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            currentSpeed = delayBetweenWords;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            currentSpeed = typingSpeed;
        }

        setTimeout(typeEffect, currentSpeed);
    }

    typeEffect();

    // Lógica para a caixa de descrição das ferramentas
    const skillItems = document.querySelectorAll('.skill-item');
    const skillDescriptionBox = document.getElementById('skill-description-box');

    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const description = item.dataset.description;
            skillDescriptionBox.textContent = description;
            skillDescriptionBox.classList.add('show'); // Adiciona a classe para exibir
        });
    });

    // Fechar a caixa de descrição ao clicar fora dela ou em outro item
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.skill-item') && !event.target.closest('#skill-description-box')) {
            skillDescriptionBox.classList.remove('show');
            skillDescriptionBox.textContent = ''; // Limpa o texto
        }
    });

    // Lógica para abrir links de projetos ao clicar
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectLink = item.dataset.link;
            if (projectLink) {
                window.open(projectLink, '_blank');
            }
        });
    });

    // Animação de fundo de pontos e linhas
    const canvas = document.createElement('canvas');
    const backgroundAnimationDiv = document.getElementById('background-animation');
    backgroundAnimationDiv.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 100; // Número máximo de pontos
    // Usando a cor de destaque para pontos e linhas
    const highlightColor = '#C242FF'; // Definida no CSS, redefinida aqui para uso no JS
    const particleColor = highlightColor;
    const lineColor = highlightColor; // Cor dos pontos e traços

    function resizeCanvas() {
        canvas.width = backgroundAnimationDiv.clientWidth;
        canvas.height = backgroundAnimationDiv.clientHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 1; // Tamanho do ponto
            this.dx = (Math.random() - 0.5) * 0.8; // Velocidade em X
            this.dy = (Math.random() - 0.5) * 0.8; // Velocidade em Y
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;

            // Inverter direção ao atingir as bordas
            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
                this.dx *= -1;
            }
            if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
                this.dy *= -1;
            }
        }
    }

    function createParticles(count) {
        for (let i = 0; i < count; i++) {
            if (particles.length < maxParticles) {
                particles.push(new Particle());
            }
        }
    }

    createParticles(maxParticles); // Cria os pontos iniciais

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                if (distance < 100) { // Distância para conectar
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1; // Traço mais visível
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animateParticles); // Chama a função novamente para animar
    }

    animateParticles(); // Inicia a animação

    // Gerar pontos ao clicar no fundo
    backgroundAnimationDiv.addEventListener('click', (event) => {
        if (particles.length < maxParticles) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            particles.push(new Particle(x, y));
        }
    });
});