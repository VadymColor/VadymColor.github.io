        var animation = bodymovin.loadAnimation({
            container: document.getElementById('animation1'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'Flowerrr.json' // Update the path to your Lottie animation file
        });
/*
         document.getElementById('movingbg1').addEventListener('mousemove', function(event) {
            var mouseX = event.clientX;
            var mouseY = event.clientY;
            var centerX = window.innerWidth / 2;
            var centerY = window.innerHeight / 2;
            var angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
            document.getElementById('animation1').style.transition = 'transform 1s ease';
            document.getElementById('animation1').style.transform = 'rotate(' + angle + 'deg)';
        });
*/

var animation1 = document.getElementById('animation1');

document.addEventListener('mousemove', function(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;

    var deltaX = (mouseX - centerX) / centerX;
    var deltaY = (mouseY - centerY) / centerY;

    var rotationY = deltaX * 30; // Change the multiplier for more or less rotation
    var rotationX = deltaY * -30; // Change the multiplier for more or less rotation
    document.getElementById('animation1').style.transition = 'transform 0.5s ease';
    animation1.style.transform = 'perspective(500px) rotateY(' + rotationY + 'deg) rotateX(' + rotationX + 'deg)';
});

        const follower = document.getElementById('mouseFollower');
        const followerRect = follower.getBoundingClientRect();
        
        document.addEventListener('mousemove', e => {
          follower.style.transform = `translate(${e.pageX - followerRect.width / 2}px, ${e.pageY - followerRect.height / 2}px)`;
        });