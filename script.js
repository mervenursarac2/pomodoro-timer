
        document.addEventListener('DOMContentLoaded', function() {
            const slider = document.getElementById('circular-slider');
            const progress = document.getElementById('circular-slider-progress');
            const thumb = document.getElementById('circular-slider-thumb');
            const timerDisplay = document.getElementById('timer');
            
            const centerX = 150;
            const centerY = 150;
            const radius = 140;
            const circumference = 2 * Math.PI * radius;
            let isDragging = false;
            
            // Başlangıç değeri (25 dakika)
            let currentValue = 25;
            updateSlider(currentValue);
            
            function snapToNearest5(minutes) {
                // 15-120 arasında ve 5'in katları olacak şekilde ayarla
                minutes = Math.max(15, Math.min(120, minutes));
                return Math.round(minutes / 5) * 5;
            }
            
            function updateSlider(minutes) {
                // Değeri 5'in katlarına yuvarla
                minutes = snapToNearest5(minutes);
                
                // 15-120 dakika arasını 0-1 arası değere çevir
                const percentage = (minutes - 15) / (120 - 15);
                const offset = circumference - (percentage * circumference);
                progress.style.strokeDashoffset = offset;
                
                // Thumb pozisyonunu güncelle (0 derece en üstte)
                const angle = percentage * 360 - 90; // -90 derece başlangıç pozisyonu için
                const thumbX = centerX + radius * Math.cos(angle * Math.PI / 180);
                const thumbY = centerY + radius * Math.sin(angle * Math.PI / 180);
                thumb.setAttribute('cx', thumbX);
                thumb.setAttribute('cy', thumbY);
                
                // Timer değerini güncelle
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:00`;
                return minutes; // Gerçek ayarlanan değeri döndür
            }
            
            function getAngleFromMouse(event, element) {
                const rect = element.getBoundingClientRect();
                const x = event.clientX - rect.left - centerX;
                const y = event.clientY - rect.top - centerY;
                let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
                if (angle < 0) angle += 360;
                return angle;
            }
            
            // Thumb'ı sürükleme olayları
            thumb.addEventListener('mousedown', function(e) {
                isDragging = true;
                e.stopPropagation();
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', function() {
                    isDragging = false;
                    document.removeEventListener('mousemove', onMouseMove);
                });
            });
            
            // Slider'ın herhangi bir yerine tıklama
            slider.addEventListener('mousedown', function(e) {
                if (e.target === slider || e.target === progress || e.target.id === 'circular-slider-track') {
                    const angle = getAngleFromMouse(e, slider);
                    const rawValue = (angle / 360) * (120 - 15) + 15;
                    currentValue = updateSlider(rawValue);
                }
            });
            
            function onMouseMove(e) {
                if (!isDragging) return;
                const angle = getAngleFromMouse(e, slider);
                const rawValue = (angle / 360) * (120 - 15) + 15;
                currentValue = updateSlider(rawValue);
            }
        });