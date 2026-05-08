window.onload = function() {
    // var preloader = document.getElementById('preloader');
    var animation1 = document.getElementById('animation1');
    animation1.innerHTML = ''; // Clear any existing content

    // Function to check if we should use Lottie animation
    function shouldUseLottie() {
        return window.innerWidth <= 500;
    }

    function scheduleLazyLoad(task) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(task, { timeout: 250 });
        } else {
            setTimeout(task, 150);
        }
    }

    function showAnimationContainer() {
        animation1.classList.add('visible');
    }

    function hideAnimationContainer() {
        animation1.classList.remove('visible');
    }

    // Initialize Lottie animation
    let lottieAnim = null;
    function initLottie() {
        if (lottieAnim) {
            lottieAnim.destroy();
        }
        animation1.innerHTML = ''; // Clear any existing content
        const animationPath = animation1.dataset.src || 'Flowerrr.json';
        lottieAnim = lottie.loadAnimation({
            container: animation1,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: animationPath
        });

        lottieAnim.addEventListener('DOMLoaded', function() {
            // preloader.style.display = 'none';
            showAnimationContainer();
        });

        lottieAnim.addEventListener('error', function() {
            console.error('Error loading Lottie animation');
            // preloader.style.display = 'none';
            showAnimationContainer();
        });
    }

    // Initialize image sequence
    const totalFrames = 599;
    const images = [];
    let currentFrame = 0;
    let animationInterval = null;

    function assignImageSrcs() {
        images.forEach(img => {
            if (!img.src) {
                img.src = img.dataset.src;
            }
        });
    }

    function initImageSequence() {
        animation1.innerHTML = '';
        if (lottieAnim) {
            lottieAnim.destroy();
            lottieAnim = null;
        }

        let loadedImages = 0;
        let animationStarted = false;
        const requiredLoadedFrames = Math.min(480, totalFrames + 1);

        for (let i = 0; i <= totalFrames; i++) {
            const img = new Image();
            img.onload = () => {
                loadedImages++;
                if (loadedImages >= requiredLoadedFrames && !animationStarted) {
                    // preloader.style.display = 'none';
                    if (!shouldUseLottie()) {
                        startImageAnimation();
                        animationStarted = true;
                        showAnimationContainer();
                    }
                }
            };
            img.onerror = () => {
                loadedImages++;
                if (loadedImages >= requiredLoadedFrames && !animationStarted) {
                    // preloader.style.display = 'none';
                    if (!shouldUseLottie()) {
                        startImageAnimation();
                        animationStarted = true;
                        showAnimationContainer();
                    }
                }
            };
            const frameNumber = i.toString().padStart(5, '0');
            img.dataset.src = `images/flower${frameNumber}.png`;
            img.style.display = 'none';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.position = 'absolute';
            animation1.appendChild(img);
            images.push(img);
        }

        assignImageSrcs();
    }

    function startImageAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
        }

        function updateFrame() {
            if (images[currentFrame]) {
                images[currentFrame].style.display = 'none';
            }
            currentFrame = (currentFrame + 1) % totalFrames;
            if (images[currentFrame]) {
                images[currentFrame].style.display = 'block';
            }
        }

        animationInterval = setInterval(updateFrame, 33);
        setupRotationEffect();
    }

    function setupRotationEffect() {
        let targetRotationX = 1;
        let targetRotationY = 1;
        let currentRotationX = 0;
        let currentRotationY = 0;

        animation1.style.transformStyle = 'preserve-3d';
        animation1.style.perspective = '1000px';

        document.addEventListener('mousemove', function(event) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            targetRotationX = ((mouseY - centerY) / centerY) * 20;
            targetRotationY = ((mouseX - centerX) / centerX) * 20;
        });

        function updateRotation() {
            currentRotationX += (targetRotationX - currentRotationX) * 0.1;
            currentRotationY += (targetRotationY - currentRotationY) * 0.1;

            animation1.style.transform = `
                rotateX(${-currentRotationX}deg) 
                rotateY(${currentRotationY}deg)
            `;

            requestAnimationFrame(updateRotation);
        }

        updateRotation();
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (shouldUseLottie()) {
                if (!lottieAnim) {
                    scheduleLazyLoad(initLottie);
                }
            } else {
                if (!images.length) {
                    scheduleLazyLoad(initImageSequence);
                } else if (!animationInterval) {
                    startImageAnimation();
                }
            }
        }, 250);
    });

    // Initialize based on current screen size once DOM is ready
    if (shouldUseLottie()) {
        scheduleLazyLoad(initLottie);
    } else {
        scheduleLazyLoad(initImageSequence);
    }

    // Mouse follower effect
    const follower = document.getElementById('mouseFollower');
    const followerRect = follower.getBoundingClientRect();

    document.addEventListener('mousemove', e => {
        follower.style.transform = `translate(${e.pageX - followerRect.width / 2}px, ${e.pageY - followerRect.height / 2}px)`;
    });
};
