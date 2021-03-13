import * as THREE from 'three'
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

import './styles/global.scss'

import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// View Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

// scene
const scene = new THREE.Scene()

// camera
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)

// Controls
const controls = new TrackballControls(camera, canvas)
controls.enableDamping = true

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xf1f1f1, 0.5)

// Shader Uniforms
const uniforms = {
    // uTime: { value: 0 },
    // uColor: { value: new THREE.Color(0x000099)},
    // uMouse: { value: { x: 0.0, y: 0.0} },
    // uResolution: { value: { x: 0.0, y: 0.0 } }
}

// Mesh Object
const geometry = new THREE.TorusKnotGeometry(100, 3, 100, 13)
// const material = new THREE.ShaderMaterial({
//     vertexShader: vertex,
//     fragmentShader: fragment,
//     uniforms: uniforms,
//     side: THREE.DoubleSide,
// })
const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(geometry, material)

// Staging objects into scene
scene.add(mesh)

// animate

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update material
    // material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Rendering
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
