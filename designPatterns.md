```js
/**
 * Defalt javascript solution
 *
 */
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
// vertexShader: vertex,
// fragmentShader: fragment,
// uniforms: uniforms,
// side: THREE.DoubleSide,
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
```

```js
/**
 * Object-Oriented solution (with a 'classy' way)
 *
 */

export default class Particled {
    constructor(options) {
        this.scene = new THREE.Scene()

        this.container = options.dom // document.getElementById('webgl')
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0x000111, 1)
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

        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

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
```
