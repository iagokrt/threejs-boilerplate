import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

// post-processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import * as dat from 'dat.gui';
import gsap from 'gsap';

import './styles/global.scss';

// import t from '../public/a-end.jpg'; // end frame of video : the texture that will be used itself with the fragment uniforms
import t1 from '../public/a-start.jpg';
import t from '../public/b-end.jpg';
// import t1 from '../public/b-start.jpg';

import vertex from './shader/vertexParticles.glsl';
import fragment from './shader/fragment.glsl';

export default class Particled {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom; // document.getElementById('webgl')
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.physicallyCorrectLights = true;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      5000
    );

    this.camera.position.set(0, 0, 1500);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    // video events (timeline)
    this.video = document.getElementById('video1');
    // this.video2 = document.getElementById('video2');

    this.isPlaying = true;

    this.addPostProcessing();

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.settings();

    // right after video is ended, starts the webgl animations!
    this.video.addEventListener('ended', () => {
      // remove video opacity. because video element is over our canvas
      gsap.to(this.video, {
        duration: 0.1,
        opacity: 0,
      });

      // starts the distortion animation
      gsap.to(this.material.uniforms.uDistortion, {
        duration: 2,
        value: 3,
        ease: 'power2.inOut',
      });

      gsap.to(this.material.uniforms.progress, {
        duration: 1,
        delay: 1.5,
        value: 1,
      });

      // starts the bloom animation
      gsap.to(this.bloomPass, {
        duration: 2,
        strength: 7,
        ease: 'power2.in',
      });

      // revert the init state distortion
      gsap.to(this.material.uniforms.uDistortion, {
        duration: 2,
        value: 0,
        delay: 2,
        ease: 'power2.inOut',
      });

      // revert the init state bloom
      gsap.to(this.bloomPass, {
        duration: 2,
        strength: 0,
        delay: 2,
        ease: 'power2.out',
        onComplete: () => {
          this.video.currentTime * 0;
          // fade-in video | loop
          this.video.play();

          gsap.to(this.video, {
            duration: 0.1,
            opacity: 1,
          });
        },
      });

      // gsap.to(this.video2, {
      //   duration: 0.1,
      //   opacity: 1,
      // });
    });
  }

  addPostProcessing() {
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.settings.bloomThreshold;
    this.bloomPass.strength = this.settings.bloomStrength;
    this.bloomPass.radius = this.settings.bloomRadius;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
  }

  settings() {
    let that = this;
    this.settings = {
      // distortion: 0,
      // bloomStrength: 0,
    };
    this.gui = new dat.GUI();
    // this.gui.add(this.settings, 'distortion', 0, 3, 0.01);
    // this.gui.add(this.settings, 'bloomStrength', 0, 10, 0.01);
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
    this.composer.setSize(this.width, this.height);
  }

  addObjects() {
    let that = this;

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives :enable',
      },
      uniforms: {
        time: { type: 'f', value: 0 },
        progress: { type: 'f', value: 0 },
        uDistortion: { type: 'f', value: 0 },
        t: {
          type: 't',
          value: new THREE.TextureLoader().load(t),
        },
        t1: {
          type: 't',
          value: new THREE.TextureLoader().load(t1),
        },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneBufferGeometry(
      480 * 1.75,
      820 * 1.75,
      480,
      820
    );

    this.plane = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;

    this.time += 0.05;

    this.material.uniforms.time.value = this.time;
    // this.material.uniforms.uDistortion.value = this.settings.distortion;
    // this.bloomPass.strength = this.settings.bloomStrength;

    requestAnimationFrame(this.render.bind(this));
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();
  }
}

new Particled({
  dom: document.getElementById('webgl'),
});
