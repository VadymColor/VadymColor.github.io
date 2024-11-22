window.onload = function() {
    var preloader = document.getElementById('preloader');
    
    // Initialize the animation
    var animation1 = document.getElementById('animation1');
    animation1.innerHTML = ''; // Clear any existing content

    // Total number of frames
    const totalFrames = 598;

    // Track loaded images
    let loadedImages = 0;
    let animationStarted = false;

    // Preload all images
    const images = [];
    for (let i = 0; i <= totalFrames; i++) {
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            // Start animation when 90 images are loaded
            if (loadedImages === 90 && !animationStarted) {
                preloader.style.display = 'none';
                startAnimation();
                animationStarted = true;
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

    function startAnimation() {
        let currentFrame = 0;
        
        // Animation function
        function updateFrame() {
            // Hide previous frame
            images[currentFrame].style.display = 'none';
            
            // Update frame counter
            currentFrame = (currentFrame + 1) % (totalFrames + 1);
            
            // Show current frame
            images[currentFrame].style.display = 'block';
        }

        // Run animation at 30fps (approximately)
        setInterval(updateFrame, 33);

        // Enhanced mouse move rotation effect
        let targetRotationX = 1;
        let targetRotationY = 1;
        let currentRotationX = 0;
        let currentRotationY = 0;
        
        // Add perspective to the container
        animation1.style.transformStyle = 'preserve-3d';
        animation1.style.perspective = '1000px';

        document.addEventListener('mousemove', function(event) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Calculate target rotation (max 20 degrees)
            targetRotationX = ((mouseY - centerY) / centerY) * 20;
            targetRotationY = ((mouseX - centerX) / centerX) * 20;
        });

        // Smooth animation function
        function updateRotation() {
            // Smoothly interpolate current rotation towards target rotation
            currentRotationX += (targetRotationX - currentRotationX) * 0.1;
            currentRotationY += (targetRotationY - currentRotationY) * 0.1;

            // Apply the rotation
            animation1.style.transform = `
                rotateX(${-currentRotationX}deg) 
                rotateY(${currentRotationY}deg)
            `;

            requestAnimationFrame(updateRotation);
        }

        // Start the rotation animation
        updateRotation();

        // Mouse follower effect
        const follower = document.getElementById('mouseFollower');
        const followerRect = follower.getBoundingClientRect();
        
        document.addEventListener('mousemove', e => {
            follower.style.transform = `translate(${e.pageX - followerRect.width / 2}px, ${e.pageY - followerRect.height / 2}px)`;
        });
    }
};
