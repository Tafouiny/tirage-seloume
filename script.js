let entries = [];


const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#33FFF8', '#F833FF'];
let currentRotation = 0;

function addEntry() {
    const name = document.getElementById('name').value;
    const weight = parseInt(document.getElementById('weight').value);
    if (name && weight) {
        entries.push({ name, weight });
        document.getElementById('name').value = '';
        document.getElementById('weight').value = '';
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}


function displayWheel() {
    document.getElementById('entryForm').style.display = 'none';
    document.querySelector('.wheel-container').style.display = 'flex';
    drawWheel();
}

function drawWheel() {
    const totalWeight = entries.reduce((total, entry) => total + entry.weight, 0);
    let startAngle = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    entries.forEach((entry, index) => {
        const sliceAngle = (entry.weight / totalWeight) * 2 * Math.PI;
        ctx.beginPath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, 250, startAngle, startAngle + sliceAngle);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fill();

        // Calculate text position and rotation
        const textAngle = startAngle + sliceAngle / 2;
        const textRadius = 180; // Adjust radius for better placement
        const textX = canvas.width / 2 + Math.cos(textAngle) * textRadius;
        const textY = canvas.height / 2 + Math.sin(textAngle) * textRadius;

        // Draw vertical text letter by letter
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle - Math.PI / 2); // Align text along the radius
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        const name = entry.name;
        // Position each letter to be vertically aligned
        for (let i = 0; i < name.length; i++) {
            ctx.fillText(name[i], 0, i * 22 - (name.length - 1) * 11); // Offset each letter vertically
        }
        ctx.restore();

        startAngle += sliceAngle;
    });
}


function drawArrow() {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 25);
    ctx.lineTo(canvas.width / 2 + 10, 0);
    ctx.lineTo(canvas.width / 2 - 10, 0);
    ctx.closePath();
    ctx.fill();
}

function spinWheel() {
    const initialRotationDegrees = 3600; // Nombre de base de degrés pour plusieurs tours complets.
    const randomExtraDegrees = Math.floor(Math.random() * 360); // Ajoute un nombre aléatoire de degrés pour finir à un point différent.
    const totalDegrees = initialRotationDegrees + randomExtraDegrees; // Total des degrés incluant la part aléatoire.
    const duration = 10000; // Durée plus longue pour permettre une décélération lente.
    const start = Date.now();

    function animate() {
        const timePassed = Date.now() - start;
        const progress = timePassed / duration;
        const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Fonction ease-out cubique pour la décélération.

        const frameRotation = totalDegrees * easeOutProgress; // Calcule la rotation actuelle basée sur le progrès décéléré.
        const currentAngle = (currentRotation + frameRotation) % 360; // Calcule l'angle actuel pour la roue.

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(currentAngle * Math.PI / 180); // Rotation basée sur l'angle actuel.
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        drawWheel();
        ctx.restore();

        drawArrow();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentRotation = currentAngle; // Met à jour la rotation actuelle pour les prochains spins.
            displayWinner(currentAngle); // Appelle la fonction pour déterminer et afficher le gagnant.
        }
    }

    requestAnimationFrame(animate);
}



document.getElementById('spin').addEventListener('click', spinWheel);
