const questions = [
    {
        question: "Qual a capital da França?",
        answers: ["Paris", "Londres", "Berlim", "Madrid"],
        correct: 0
    },
    {
        question: "Qual a fórmula da água?",
        answers: ["H2O", "CO2", "O2", "NaCl"],
        correct: 0
    },
    {
        question: "Qual é o maior planeta do sistema solar?",
        answers: ["Terra", "Marte", "Júpiter", "Saturno"],
        correct: 2
    },
    {
        question: "Quantos continentes existem?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "Qual o elemento químico com símbolo O?",
        answers: ["Ouro", "Oxigênio", "Osmônio", "Ósmio"],
        correct: 1
    }
];

let score = 0;
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const restartButton = document.getElementById('restart');
const wheelContainer = document.getElementById('wheel');
const winningsContainer = document.getElementById('winnings');

function loadQuiz() {
    quizContainer.innerHTML = '';
    questions.forEach((q, index) => {
        quizContainer.innerHTML += `
            <div>
                <h3>${q.question}</h3>
                ${q.answers.map((answer, i) => `
                    <label>
                        <input type="radio" name="question${index}" value="${i}">${answer}
                    </label>
                `).join('')}
            </div>
        `;
    });
}

document.getElementById('submit').addEventListener('click', () => {
    score = 0;
    questions.forEach((q, index) => {
        const answer = document.querySelector(`input[name="question${index}"]:checked`);
        if (answer && parseInt(answer.value) === q.correct) {
            score += 5;
        }
    });
    showResult();
});

function showResult() {
    quizContainer.style.display = 'none';
    document.getElementById('submit').style.display = 'none';
    resultContainer.innerHTML = `Você fez ${score} pontos!`;
    
    if (score >= 10) {
        resultContainer.innerHTML += '<br><br>Voce atingiu + de 5 pontos, rode a roleta! (no max:5 vezes, no min:1)';
        wheelContainer.classList.remove('hidden');
    } else {
        resultContainer.innerHTML += '<br><br>Poxa, você não conseguiu!';
    }
    restartButton.classList.remove('hidden');
}

restartButton.addEventListener('click', () => {
    location.reload();
});

const prizes = ['200 reais', 'nada', 'nada', '100 reais', 'nada'];
let spinCount = 0;

document.getElementById('spin').addEventListener('click', () => {
    if (score < 5 * (spinCount + 1)) {
        alert("Você não tem pontos suficientes para rodar a roleta!");
        return;
    }

    spinCount++;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const segments = 360 / prizes.length;
    
   
    let rotation = Math.random() * 360 + 720; 
    const totalRotation = rotation + Math.floor(Math.random() * 360); 

    const spin = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation * Math.PI / 180);
        
        prizes.forEach((prize, index) => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, 100, (segments * index * Math.PI) / 180, (segments * (index + 1) * Math.PI) / 180);
            ctx.lineTo(0, 0);
            ctx.fillStyle = index % 2 === 0 ? '#ff69b4' : '#ff1493';
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'right';
            ctx.save();
            ctx.rotate((segments * (index + 0.5)) * Math.PI / 180);
            ctx.fillText(prize, 90, 10);
            ctx.restore();
        });

        ctx.restore();

        rotation -= 10; 
        if (rotation > 0) {
            requestAnimationFrame(spin);
        } else {
            const normalizedRotation = (totalRotation % 360 + 360) % 360; 
            const prizeIndex = Math.floor(normalizedRotation / segments); 
            
            const winningPrize = prizes[(prizeIndex + prizes.length) % prizes.length];
            winningsContainer.innerHTML = `Você ganhou: ${winningPrize}`;
            winningsContainer.classList.remove('hidden');
            alert("Rodada concluída! " + winningsContainer.innerHTML);
        }
    };

    spin();
});

loadQuiz();
