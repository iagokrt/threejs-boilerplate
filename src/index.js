import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

import * as dat from 'dat.gui'

import './styles/global.scss'

import vertex from './shader/vertexParticles.glsl'
import fragment from './shader/fragment.glsl'

export default class Particled {
    constructor(options) {
        this.scene = new THREE.Scene()

        this.container = options.dom // document.getElementById('webgl')
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0x111111, 1)
        this.renderer.physicallyCorrectLights = true

        this.container.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        )

        this.camera.position.set(0, 0, 2)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.time = 0

        this.isPlaying = true

        this.addObjects()
        this.resize()
        this.render()
        this.setupResize()
    }

    settings() {
        let that = this
        this.settings = {
            progress: 0,
        }
        this.gui = new dat.GUI()
        this.gui.add(this.settings, 'progress', 0, 1, 0.01)
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.renderer.setSize(this.width, this.height)
        this.camera.aspect = this.width / this.height

        this.camera.updateProjectionMatrix()
    }

    addObjects() {
        let that = this

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { type: 'f', value: 0 },
                resolution: { type: 'v4', value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1),
                },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        })

        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10)

        this.plane = new THREE.Points(this.geometry, this.material)

        this.scene.add(this.plane)
    }

    stop() {
        this.isPlaying = false
    }

    play() {
        if (!this.isPlaying) {
            this.render()
            this.isPlaying = true
        }
    }

    render() {
        if (!this.isPlaying) return

        this.time += 0.05
        this.material.uniforms.time.value = this.time
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
}

new Particled({
    dom: document.getElementById('webgl'),
})
