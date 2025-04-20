document.addEventListener('DOMContentLoaded', () => {
    // Duck animation toggle
    const duck = document.getElementById('duckAnimation');
    duck.addEventListener('click', () => {
        duck.style.animationPlayState = 
            duck.style.animationPlayState === 'paused' ? 'running' : 'paused';
    });

    // Interactive demo form handling
    const quackForm = document.getElementById('quackForm');
    const resetButton = document.getElementById('resetForm');
    const previewContent = document.getElementById('previewContent');
    const addQuackButton = document.getElementById('addQuackButton');
    const quacksList = document.getElementById('quacksList');
    let savedQuacks = []; // Store quacks in memory (client-side)

    // Canvas setup
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const drawTool = document.getElementById('drawTool');
    const eraseTool = document.getElementById('eraseTool');
    const clearCanvasButton = document.getElementById('clearCanvas');
    let isDrawing = false;
    let isErasing = false;

    // Canvas drawing functionality
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    drawTool.addEventListener('click', () => {
        isErasing = false;
        ctx.strokeStyle = '#1f2937';
        ctx.globalCompositeOperation = 'source-over';
        drawTool.classList.add('active');
        eraseTool.classList.remove('active');
    });

    eraseTool.addEventListener('click', () => {
        isErasing = true;
        ctx.strokeStyle = '#fff';
        ctx.globalCompositeOperation = 'destination-out';
        eraseTool.classList.add('active');
        drawTool.classList.remove('active');
    });

    clearCanvasButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Form handling
    quackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const quandary = document.getElementById('quandary').value;
        const uncover = document.getElementById('uncover').value;
        const actions = document.getElementById('actions').value;
        const conclusions = document.getElementById('conclusions').value;
        const keytakeaway = document.getElementById('keytakeaway').value;

        // Generate preview
        previewContent.innerHTML = `
            <p><strong>Quandary:</strong> ${quandary}</p>
            <p><strong>Uncover:</strong> ${uncover}</p>
            <p><strong>Actions:</strong> ${actions}</p>
            <p><strong>Conclusions:</strong> ${conclusions}</p>
            <p><strong>Key Takeaway:</strong> ${keytakeaway}</p>
        `;

        // Show the "Add Quack" button
        addQuackButton.style.display = 'block';

        // Add a quack animation to the preview
        previewContent.classList.add('quack-effect');

        // Store the current quack and canvas state
        currentQuack = { 
            quandary, 
            uncover, 
            actions, 
            conclusions, 
            keytakeaway, 
            canvasData: canvas.toDataURL() 
        };
    });

    // Add quack to saved list
    let currentQuack = null;
    addQuackButton.addEventListener('click', () => {
        if (currentQuack) {
            savedQuacks.push(currentQuack);
            renderSavedQuacks();
            quackForm.reset();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            previewContent.innerHTML = '<p>Fill out the form to preview your quack.</p>';
            addQuackButton.style.display = 'none';
        }
    });

    // Reset form and canvas
    resetButton.addEventListener('click', () => {
        quackForm.reset();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        previewContent.innerHTML = '<p>Fill out the form to preview your quack.</p>';
        addQuackButton.style.display = 'none';
    });

    // Render saved quacks as post-it notes
    function renderSavedQuacks() {
        quacksList.innerHTML = '';
        savedQuacks.forEach((quack, index) => {
            const postIt = document.createElement('div');
            postIt.classList.add('quack-post-it');
            postIt.innerHTML = `
                <p><strong>Quandary:</strong> ${quack.quandary}</p>
                <p><strong>Uncover:</strong> ${quack.uncover}</p>
                <p><strong>Actions:</strong> ${quack.actions}</p>
                <p><strong>Conclusions:</strong> ${quack.conclusions}</p>
                <p><strong>Key Takeaway:</strong> ${quack.keytakeaway}</p>
                <img src="${quack.canvasData}" alt="Quack Drawing">
            `;
            postIt.addEventListener('click', () => loadQuack(index));
            quacksList.appendChild(postIt);
        });
    }

    // Load a quack back into the form and canvas
    function loadQuack(index) {
        const quack = savedQuacks[index];
        document.getElementById('quandary').value = quack.quandary;
        document.getElementById('uncover').value = quack.uncover;
        document.getElementById('actions').value = quack.actions;
        document.getElementById('conclusions').value = quack.conclusions;
        document.getElementById('keytakeaway').value = quack.keytakeaway;

        // Load the canvas drawing
        const img = new Image();
        img.src = quack.canvasData;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };

        // Update preview
        previewContent.innerHTML = `
            <p><strong>Quandary:</strong> ${quack.quandary}</p>
            <p><strong>Uncover:</strong> ${quack.uncover}</p>
            <p><strong>Actions:</strong> ${quack.actions}</p>
            <p><strong>Conclusions:</strong> ${quack.conclusions}</p>
            <p><strong>Key Takeaway:</strong> ${quack.keytakeaway}</p>
        `;
        addQuackButton.style.display = 'block';
        currentQuack = quack;
    }

    console.log('RubberDucky.gg loaded! Ready to quack some problems.');
});