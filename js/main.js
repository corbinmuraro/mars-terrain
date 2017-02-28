$(document).ready(function() {
    var locations = [];
    var active;

    $('#next').click(function(e) {
        $("#next").css('opacity', 0.5);

        if (active == locations[0]) {
            $('.overlay-header').text('Buttes and Mesas Near Cerberus Fossae');

            $('.overlay-coordinates').text('7.8° N 149.3° E');
            scene.remove(active);
            scene.add(locations[1]);
            active = locations[1];
            decode($('.overlay-coordinates'),'overlay-coordinates');
            decode($('.overlay-header'),'overlay-header');
            setTimeout(function() {
                $("#next").delay(1000).animate({
                    opacity: 1
                }, {
                    duration: 1000,
                    queue: false
                });
            }, 1000);
        }

        else if (active == locations[1]) {
            $('.overlay-header').text('Fault Lines in Candor Chasma');
            $('.overlay-coordinates').text('-6.68° N 284.2° E');
            scene.remove(active);
            scene.add(locations[2]);
            active = locations[2];
            decode($('.overlay-coordinates'),'overlay-coordinates');
            decode($('.overlay-header'),'overlay-header');
            setTimeout(function() {
                $("#next").delay(1000).animate({
                    opacity: 1
                }, {
                    duration: 1000,
                    queue: false
                });
            }, 1000);        
        }

        else {
            $('.overlay-header').text('Sand Dunes in Olympia Undae');
            $('.overlay-coordinates').text('81.64° N 178.9° E');
            scene.remove(active);
            scene.add(locations[0]);
            active = locations[0];
            decode($('.overlay-coordinates'),'overlay-coordinates');
            decode($('.overlay-header'),'overlay-header');
            setTimeout(function() {
                $("#next").delay(1000).animate({
                    opacity: 1
                }, {
                    duration: 1000,
                    queue: false
                });
            }, 1000);
        }
    });


	 // LOADER

    $('.inner-bar').animate({
        width: "+=25%"
    }, 500);

	THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
	};

	THREE.DefaultLoadingManager.onLoad = function ( ) {

	    console.log( 'Loading Complete!');

	    $('.inner-bar').css('width', '100%');
    	$('.loader-container').fadeOut('slow');
    	decode($('.overlay-coordinates'),'overlay-coordinates');
    	decode($('.overlay-header'),'overlay-header');

        setTimeout(function() {
            $("#next").delay(1000).animate({
                opacity: 1
            }, {
                duration: 1000,
                queue: false
            });
        }, 1000);

	};


	THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        if (itemsLoaded == 1) {
            $('.inner-bar').css('width', '75%');
        }
        // else if (itemsLoaded == 2) {

        // }

	};

	THREE.DefaultLoadingManager.onError = function ( url ) {

	    console.log( 'There was an error loading ' + url );

	}; 

    // BASIC SETUP

    var width  = window.innerWidth;
    var height = window.innerHeight;

    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xeeeeee));

    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, -16, 5);
    camera.rotation.x+=1.6;

    var renderer = new THREE.WebGLRenderer({ alpha: true });


    // BUILD MARTIAN SKYBOX

    var vertexShader = document.getElementById('sky-vertex').textContent;
    var fragmentShader = document.getElementById('sky-fragment').textContent;

    var uniforms = {
        topColor: {type: "c", value: new THREE.Color(0xb79670)}, bottomColor: {type: "c", value: new THREE.Color(0xc48051)},
        offset: {type: "f", value: 50}, exponent: {type: "f", value: 0.6}
    };

    var skyMaterial = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide, fog: false});

    // create Mesh with sphere geometry and add to the scene
    var skyBox = new THREE.Mesh( new THREE.SphereGeometry(250, 60, 40), skyMaterial);
    scene.add(skyBox);

    // BUILD MARTIAN TERRAIN
    renderer.setClearColor( 0xffffff, 0);
    renderer.setSize(width, height);
    var terrainLoader = new THREE.TerrainLoader();
    terrainLoader.load('terrain/E.bin', function(data) {
        var geometry = new THREE.PlaneGeometry(60, 60, 499, 499);
        for (var i = 0, l = geometry.vertices.length; i < l; i++) {
            geometry.vertices[i].z = data[i]/ 65535 * 5;        
        }

        var material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('terrain/E_brown.jpg')
        });

        plane = new THREE.Mesh(geometry, material);
        plane.position.set(0,0,0);
        locations.push(plane);
        scene.add(locations[0]);
        active = locations[0];
    });

    terrainLoader.load('terrain/A.bin', function(data) {
        var geometry = new THREE.PlaneGeometry(60, 60, 499, 499);
        for (var i = 0, l = geometry.vertices.length; i < l; i++) {
            geometry.vertices[i].z = data[i]/ 65535 * 5;        
        }

        var material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('terrain/A_brown.jpg')
        });

        plane = new THREE.Mesh(geometry, material);
        plane.position.set(0,0,0);
        locations.push(plane);
    });

    terrainLoader.load('terrain/F.bin', function(data) {
        var geometry = new THREE.PlaneGeometry(60, 60, 499, 499);
        for (var i = 0, l = geometry.vertices.length; i < l; i++) {
            geometry.vertices[i].z = data[i]/ 65535 * 5;        
        }

        var material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('terrain/F_brown.jpg')
        });

        plane = new THREE.Mesh(geometry, material);
        plane.position.set(0,0,0);
        locations.push(plane);
    });

    // RENDER THE SCENE

    document.getElementById('webgl').appendChild(renderer.domElement);

    render();
    function render() {
        requestAnimationFrame(render);
        active.rotation.z += 0.001;
        renderer.render(scene, camera);
    }

    
	// NAVIGATION WITH KEYBOARD
	// document.addEventListener( 'keypress', onDocumentKeyPress, false );
	// function onDocumentKeyPress( event ) {

 //        var keyCode = event.which;
 //        var positionDelta = 70;
 //        var rotationDelta = 0.1;
 //        //console.log(keyCode);
 //        //A
 //        if ( keyCode == 97 )
 //        {
 //            plane.rotation.z += rotationDelta;
 //        }
 //        //D
 //        else if ( keyCode == 100 )
 //        {
 //            plane.rotation.z -= rotationDelta;
 //        }
 //        //W
 //        else if ( keyCode == 119 )
 //        {
 //            plane.rotation.x += rotationDelta;
 //        }
 //        //S
 //        else if ( keyCode == 115 )
 //        {
 //            plane.rotation.x -= rotationDelta;
 //        }
 //        //Q
 //        else if ( keyCode == 113 )
 //        {
 //            camera.position.y += positionDelta / 100;
 //        }
 //        //E
 //        else if ( keyCode == 101 )
 //        {
 //            camera.position.y -= positionDelta / 100;

 //        }
 //        //T
 //        else if ( keyCode == 116 )
 //        {
 //            camera.rotation.x += rotationDelta;

 //        }
 //        //G
 //        else if ( keyCode == 103 )
 //        {
 //            camera.rotation.x -= rotationDelta;

 //        }
 //        //F
 //        else if ( keyCode == 102 )
 //        {
 //            camera.rotation.y += rotationDelta;

 //        }
 //        //H
 //        else if ( keyCode == 104 )
 //        {
 //            camera.rotation.y -= rotationDelta;
 //        }
 //    }


});





