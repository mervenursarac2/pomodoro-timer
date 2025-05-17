document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('circular-slider');
    const progress = document.getElementById('circular-slider-progress');
    const thumb = document.getElementById('circular-slider-thumb');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start');
    
    const centerX = 150;
    const centerY = 150;
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    let isDragging = false;
    let isTimerRunning = false;
    let interval;
    
    // Başlangıç değeri
    let currentValue = 25;
    let timeLeft = currentValue * 60;
    
    updateSlider(currentValue);
    updateTimer();
    
    function snapToNearest5(minutes) {
        minutes = Math.max(0, Math.min(120, minutes));
        return Math.round(minutes / 5) * 5;
    }

    function updateSlider(minutes) {
        minutes = snapToNearest5(minutes);
        currentValue = minutes;
        
        const percentage = minutes / 120;
        const offset = circumference - (percentage * circumference);
        progress.style.strokeDashoffset = offset;
        
        const angle = percentage * 360 - 90;
        const thumbX = centerX + radius * Math.cos(angle * Math.PI / 180);
        const thumbY = centerY + radius * Math.sin(angle * Math.PI / 180);
        thumb.setAttribute('cx', thumbX);
        thumb.setAttribute('cy', thumbY);
        
        updateTimer();
        return minutes;
    }
    
    function getAngleFromMouse(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - centerX;
        const y = event.clientY - rect.top - centerY;
        let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
        if (angle < 0) angle += 360;
        return angle;
    }
    
    // Thumb sürükleme işlemleri
    thumb.addEventListener('mousedown', function(e) {
        if (isTimerRunning) return;
        isDragging = true;
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    function handleMouseMove(e) {
        if (!isDragging || isTimerRunning) return;
        
        const angle = getAngleFromMouse(e, slider);
        const rawValue = (angle / 360) * 120; // 0-120 aralığında değer
        currentValue = updateSlider(rawValue);
    }

    function handleMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    
    // Slider'a tıklama
    slider.addEventListener('mousedown', function(e) {
        if (isTimerRunning || e.target === thumb) return;
        if (e.target === slider || e.target === progress || e.target.id === 'circular-slider-track') {
            const angle = getAngleFromMouse(e, slider);
            const rawValue = (angle / 360) * 120;
            currentValue = updateSlider(rawValue);
        }
    });
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (isTimerRunning) return;
        
        isTimerRunning = true;
        timeLeft = currentValue * 60;
        updateTimer();
        
        interval = setInterval(() => {
            timeLeft--;
            updateTimer();
            
            if (timeLeft <= 0) {
                clearInterval(interval);
                isTimerRunning = false;
            }
        }, 1000);
    }

    startButton.addEventListener("click", startTimer);
});