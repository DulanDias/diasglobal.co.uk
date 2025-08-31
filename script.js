// ===== THREE.JS UNIVERSE ANIMATION =====
class UniverseAnimation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.connections = [];
        this.particleSystem = null;
        this.connectionSystem = null;
        this.animationId = null;
        this.time = 0;
        this.init();
    }

    init() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        // Check if THREE is available
        if (typeof THREE === 'undefined') {
            console.warn('THREE.js not available, skipping hero animation');
            return;
        }

        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 8;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create universe
        this.createUniverse();
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createUniverse() {
        // Create connections (line waves)
        this.createConnections();
        
        // Create wavy background
        this.createWavyBackground();
    }

    createParticles() {
        const particleCount = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            // Random positions in a sphere
            const radius = 3 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Store particle data
            this.particles.push({
                position: new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                size: Math.random() * 0.1 + 0.05,
                pulse: Math.random() * Math.PI * 2
            });

            // Colors (orange gradient)
            const color = new THREE.Color();
            color.setHSL(0.08 + Math.random() * 0.05, 0.8, 0.6 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = this.particles[i].size;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createConnections() {
        const connectionGeometry = new THREE.BufferGeometry();
        const connectionPositions = [];
        const connectionColors = [];

        // Create wave-like connections
        const waveCount = 8;
        const pointsPerWave = 50;
        
        for (let wave = 0; wave < waveCount; wave++) {
            const waveRadius = 2 + wave * 0.5;
            const waveHeight = 0.3;
            
            for (let i = 0; i < pointsPerWave; i++) {
                const angle = (i / pointsPerWave) * Math.PI * 4;
                const nextAngle = ((i + 1) / pointsPerWave) * Math.PI * 4;
                
                // Current point
                const x1 = waveRadius * Math.cos(angle);
                const y1 = waveHeight * Math.sin(angle * 3);
                const z1 = waveRadius * Math.sin(angle);
                
                // Next point
                const x2 = waveRadius * Math.cos(nextAngle);
                const y2 = waveHeight * Math.sin(nextAngle * 3);
                const z2 = waveRadius * Math.sin(nextAngle);
                
                // Add connection line
                connectionPositions.push(x1, y1, z1, x2, y2, z2);

                // Connection color (orange gradient)
                const color = new THREE.Color();
                color.setHSL(0.08 + wave * 0.02, 0.8, 0.6 + wave * 0.1);
                connectionColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
            }
        }

        connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));
        connectionGeometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3));

        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0xef4a3a,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        this.connectionSystem = new THREE.LineSegments(connectionGeometry, connectionMaterial);
        this.scene.add(this.connectionSystem);
    }

    createWavyBackground() {
        // Create wavy 2D animation in the background
        const waveGeometry = new THREE.PlaneGeometry(20, 20, 50, 50);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0xef4a3a,
            transparent: true,
            opacity: 0.05,
            wireframe: true,
            side: THREE.DoubleSide
        });

        this.waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
        this.waveMesh.rotation.x = -Math.PI / 2;
        this.waveMesh.position.z = -5;
        this.scene.add(this.waveMesh);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.time += 0.01;

        // Update wave connections
        this.updateWaveConnections();
        
        // Update wavy background
        this.updateWavyBackground();
        
        // Rotate entire system
        this.scene.rotation.y += 0.001;
        this.scene.rotation.x += 0.0005;

        this.renderer.render(this.scene, this.camera);
    }



    updateWaveConnections() {
        // Animate wave connections
        const connectionPositions = [];
        const connectionColors = [];

        // Create animated wave-like connections
        const waveCount = 8;
        const pointsPerWave = 50;
        
        for (let wave = 0; wave < waveCount; wave++) {
            const waveRadius = 2 + wave * 0.5;
            const waveHeight = 0.3;
            
            for (let i = 0; i < pointsPerWave; i++) {
                const angle = (i / pointsPerWave) * Math.PI * 4 + this.time * 0.5;
                const nextAngle = ((i + 1) / pointsPerWave) * Math.PI * 4 + this.time * 0.5;
                
                // Current point with animation
                const x1 = waveRadius * Math.cos(angle);
                const y1 = waveHeight * Math.sin(angle * 3 + this.time);
                const z1 = waveRadius * Math.sin(angle);
                
                // Next point with animation
                const x2 = waveRadius * Math.cos(nextAngle);
                const y2 = waveHeight * Math.sin(nextAngle * 3 + this.time);
                const z2 = waveRadius * Math.sin(nextAngle);
                
                // Add connection line
                connectionPositions.push(x1, y1, z1, x2, y2, z2);

                // Connection color (orange gradient)
                const color = new THREE.Color();
                color.setHSL(0.08 + wave * 0.02, 0.8, 0.6 + wave * 0.1);
                connectionColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
            }
        }

        // Update connection geometry
        this.connectionSystem.geometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3));
        this.connectionSystem.geometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3));
    }

    updateWavyBackground() {
        if (this.waveMesh) {
            const positions = this.waveMesh.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                
                // Create wavy effect
                positions[i + 2] = Math.sin(x + this.time) * 0.5 + Math.sin(y + this.time * 0.5) * 0.3;
            }
            
            this.waveMesh.geometry.attributes.position.needsUpdate = true;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// ===== MAIN APPLICATION =====
class DiasGlobalApp {
    constructor() {
        this.universeAnimation = null;
        this.currentSection = '';
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        this.setupModals();
        this.setupScrollToTop();
        this.updateCurrentYear();
    }

    setupLoadingScreen() {
        // Wait for THREE.js to be available before initializing hero animation
        this.waitForThreeJS();
    }

    waitForThreeJS() {
        if (typeof THREE !== 'undefined' && THREE.Scene) {
            this.initHeroAnimation();
        } else {
            // Check again after a short delay
            setTimeout(() => {
                this.waitForThreeJS();
            }, 100);
        }
    }

    initHeroAnimation() {
        try {
            this.universeAnimation = new UniverseAnimation();
        } catch (error) {
            console.warn('Failed to initialize hero animation:', error);
        }
    }

    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.about-card, .sector-card, .timeline-item');
        animatedElements.forEach(el => observer.observe(el));
    }

    setupStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element, target) => {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 20);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => statsObserver.observe(stat));
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // Setup conditional form fields
        this.setupConditionalFields();

        // Check if we're on localhost
        const isLocalhost = this.isLocalhost();
        
        // Temporarily disabled reCAPTCHA
        /*
        // Hide reCAPTCHA on localhost
        if (isLocalhost) {
            const recaptchaContainer = form.querySelector('.recaptcha-container');
            if (recaptchaContainer) {
                recaptchaContainer.style.display = 'none';
            }
            
            // Add development mode indicator
            const devIndicator = document.createElement('div');
            devIndicator.className = 'dev-indicator';
            devIndicator.innerHTML = '<span>🔧 Development Mode - reCAPTCHA disabled</span>';
            
            const formActions = form.querySelector('.form-actions');
            if (formActions) {
                formActions.insertBefore(devIndicator, formActions.firstChild);
            }
        }
        */

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Use Formspree's recommended approach for AJAX submissions
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Try to parse JSON response
                    try {
                        const result = await response.json();
                        if (result.ok) {
                            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                            form.reset();
                            this.resetConditionalFields();
                        } else {
                            throw new Error(result.error || 'Form submission failed');
                        }
                    } catch (jsonError) {
                        // If JSON parsing fails, assume success (Formspree sometimes returns HTML)
                        this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                        form.reset();
                        this.resetConditionalFields();
                    }
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // If AJAX fails, try traditional form submission
                this.showNotification('Submitting form...', 'info');
                
                // Create a temporary form and submit it
                const tempForm = document.createElement('form');
                tempForm.method = 'POST';
                tempForm.action = form.action;
                tempForm.style.display = 'none';
                
                // Copy form data
                for (let [key, value] of formData.entries()) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    tempForm.appendChild(input);
                }
                
                document.body.appendChild(tempForm);
                tempForm.submit();
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    isLocalhost() {
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname === '0.0.0.0' ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname.includes('127.0.0.1');
        
        // Debug log
        console.log(`Hostname: ${window.location.hostname}, Is Localhost: ${isLocal}`);
        
        return isLocal;
    }

    setupConditionalFields() {
        const interestTypeSelect = document.getElementById('interest-type');
        const investmentFields = document.getElementById('investment-fields');
        const capacityField = document.getElementById('capacity-field');
        const partnershipFields = document.getElementById('partnership-fields');

        if (!interestTypeSelect) return;

        interestTypeSelect.addEventListener('change', () => {
            const selectedValue = interestTypeSelect.value;
            
            // Hide all conditional fields first
            if (investmentFields) investmentFields.style.display = 'none';
            if (capacityField) capacityField.style.display = 'none';
            if (partnershipFields) partnershipFields.style.display = 'none';

            // Show relevant fields based on selection
            if (selectedValue === 'investment') {
                if (investmentFields) investmentFields.style.display = 'block';
                if (capacityField) capacityField.style.display = 'block';
            } else if (selectedValue === 'partnership' || selectedValue === 'consultation') {
                if (partnershipFields) partnershipFields.style.display = 'block';
            }
        });
    }

    resetConditionalFields() {
        const investmentFields = document.getElementById('investment-fields');
        const capacityField = document.getElementById('capacity-field');
        const partnershipFields = document.getElementById('partnership-fields');

        // Hide all conditional fields
        if (investmentFields) investmentFields.style.display = 'none';
        if (capacityField) capacityField.style.display = 'none';
        if (partnershipFields) partnershipFields.style.display = 'none';

        // Reset select values
        const investmentSector = document.getElementById('investment-sector');
        const investmentCapacity = document.getElementById('investment-capacity');
        const partnershipArea = document.getElementById('partnership-area');

        if (investmentSector) investmentSector.value = '';
        if (investmentCapacity) investmentCapacity.value = '';
        if (partnershipArea) partnershipArea.value = '';
    }

    setupInvestmentForm() {
        const investmentForm = document.getElementById('investment-form');
        if (!investmentForm) return;

        investmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(investmentForm);
            const submitBtn = investmentForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Joining...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                this.showNotification('Successfully joined the investment mailing list! You\'ll be notified of new opportunities.', 'success');
                investmentForm.reset();
                
            } catch (error) {
                this.showNotification('There was an error joining the mailing list. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.id;
                    this.updateActiveNavLink(currentId);
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    updateActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    setupModals() {
        const privacyToggle = document.getElementById('privacy-toggle');
        const termsToggle = document.getElementById('terms-toggle');
        const privacyModal = document.getElementById('privacy-modal');
        const termsModal = document.getElementById('terms-modal');
        const privacyClose = document.getElementById('privacy-close');
        const termsClose = document.getElementById('terms-close');

        // Open modals
        privacyToggle?.addEventListener('click', () => {
            privacyModal?.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        termsToggle?.addEventListener('click', () => {
            termsModal?.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        // Close modals
        const closeModal = (modal) => {
            modal?.classList.remove('show');
            document.body.style.overflow = '';
        };

        privacyClose?.addEventListener('click', () => closeModal(privacyModal));
        termsClose?.addEventListener('click', () => closeModal(termsModal));

        // Close modal when clicking outside
        privacyModal?.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                closeModal(privacyModal);
            }
        });

        termsModal?.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                closeModal(termsModal);
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(privacyModal);
                closeModal(termsModal);
            }
        });
    }

    updateCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (!scrollToTopBtn) return;

        // Show/hide button based on scroll position
        const toggleScrollButton = () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        };

        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Listen for scroll events
        window.addEventListener('scroll', throttle(toggleScrollButton, 100), { passive: true });
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== THEME TOGGLE FUNCTIONALITY =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || this.getSystemTheme();
        this.init();
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        // Apply theme immediately
        this.applyTheme();
        
        // Setup event listeners with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
        
        // Apply theme again after a longer delay to ensure all elements are loaded
        setTimeout(() => {
            this.applyTheme();
        }, 500);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateLogos();
        this.updateToggleIcon();
    }

    updateLogos() {
        // Try multiple selectors to catch all logo types
        const selectors = [
            '[data-logo-dark][data-logo-light]',
            '.nav-logo[data-logo-dark][data-logo-light]',
            '.simple-logo[data-logo-dark][data-logo-light]',
            '.footer-logo[data-logo-dark][data-logo-light]'
        ];
        
        let allLogos = [];
        selectors.forEach(selector => {
            const logos = document.querySelectorAll(selector);
            allLogos.push(...logos);
        });
        
        // Remove duplicates
        const uniqueLogos = [...new Set(allLogos)];
        
        uniqueLogos.forEach((logo, index) => {
            const isLight = this.theme === 'light';
            const darkSrc = logo.getAttribute('data-logo-dark');
            const lightSrc = logo.getAttribute('data-logo-light');
            const newSrc = isLight ? lightSrc : darkSrc;
            
            if (newSrc) {
                // Force update the logo
                logo.src = newSrc;
                
                // Force a reload by setting src to empty first, then to new value
                setTimeout(() => {
                    const tempSrc = logo.src;
                    logo.src = '';
                    setTimeout(() => {
                        logo.src = newSrc;
                    }, 10);
                }, 50);
            }
        });
    }

    updateToggleIcon() {
        // The icons are now handled by CSS with opacity and transform
        // No JavaScript needed for icon updates
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    setupEventListeners() {
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new DiasGlobalApp();
    const themeManager = new ThemeManager();
    
    // Make app globally available for debugging
    window.diasGlobalApp = app;
    window.themeManager = themeManager;
    
    // Ensure theme is applied after DOM is fully loaded
    setTimeout(() => {
        themeManager.applyTheme();
    }, 200);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
const throttledScrollHandler = throttle(() => {
    // Handle scroll-based animations
}, 16);

window.addEventListener('scroll', throttledScrollHandler, { passive: true });

// ===== THEME FALLBACK =====
// Ensure theme is applied when window loads (fallback for timing issues)
window.addEventListener('load', () => {
    if (window.themeManager) {
        window.themeManager.applyTheme();
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
    if (window.diasGlobalApp && window.diasGlobalApp.universeAnimation) {
        window.diasGlobalApp.universeAnimation.destroy();
    }
});
