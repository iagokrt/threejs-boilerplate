import * as THREE from 'three'

import './styles/global.scss'

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

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xf1f1f1, 0.5)

// animate

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

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
