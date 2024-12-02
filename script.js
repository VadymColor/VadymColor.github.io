window.onload = function() {
    var preloader = document.getElementById('preloader');
    var animation1 = document.getElementById('animation1');
    animation1.innerHTML = ''; // Clear any existing content

    // Function to check if we should use Lottie animation
    function shouldUseLottie() {
        return window.innerWidth <= 500;
    }

    // Initialize Lottie animation
    let lottieAnim = null;
    function initLottie() {
        if (lottieAnim) {
            lottieAnim.destroy();
        }
        animation1.innerHTML = ''; // Clear any existing content
        lottieAnim = lottie.loadAnimation({
            container: animation1,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'Flowerrr.json'
        });

        // Hide preloader once Lottie is loaded
        lottieAnim.addEventListener('DOMLoaded', function() {
            preloader.style.display = 'none';
        });

        // Handle any loading error
        lottieAnim.addEventListener('error', function() {
            console.error('Error loading Lottie animation');
            preloader.style.display = 'none';
        });
    }

    // Initialize image sequence
    const totalFrames = 599;
    const images = [];
    let currentFrame = 0;
    let animationInterval = null;

    function initImageSequence() {
        // Clear container
        animation1.innerHTML = '';
        if (lottieAnim) {
            lottieAnim.destroy();
            lottieAnim = null;
        }

        // Load images
        let loadedImages = 0;
        let animationStarted = false;

        for (let i = 0; i <= totalFrames; i++) {
            const img = new Image();
            img.onload = () => {
                loadedImages++;
                if (loadedImages === 360 && !animationStarted) {
                    preloader.style.display = 'none';
                    if (!shouldUseLottie()) {
                        startImageAnimation();
                        animationStarted = true;
                    }
                }
            };
            img.onerror = () => {
                loadedImages++;
                if (loadedImages === 90) {
                    preloader.style.display = 'none';
                }
            };
            const frameNumber = i.toString().padStart(5, '0');
            img.src = `images/flower${frameNumber}.png`;
            img.style.display = 'none';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.position = 'absolute';
            animation1.appendChild(img);
            images.push(img);
        }
    }

    function startImageAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
        }

        function updateFrame() {
            if (images[currentFrame]) {
                images[currentFrame].style.display = 'none';
            }
            currentFrame = (currentFrame + 1) % (totalFrames + 1);
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
                    initLottie();
                }
            } else {
                if (!images.length) {
                    initImageSequence();
                } else if (!animationInterval) {
                    startImageAnimation();
                }
            }
        }, 250);
    });

    // Initialize based on current screen size
    if (shouldUseLottie()) {
        initLottie();
    } else {
        initImageSequence();
    }

    // Mouse follower effect
    const follower = document.getElementById('mouseFollower');
    const followerRect = follower.getBoundingClientRect();
    
    document.addEventListener('mousemove', e => {
        follower.style.transform = `translate(${e.pageX - followerRect.width / 2}px, ${e.pageY - followerRect.height / 2}px)`;
    });
};
