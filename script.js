import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";
import frag from './shader/main.frag';
import vert from './shader/main.vert';
import t from './image/t.png';
export default class main {
  constructor(webgl) {
    this.webgl = webgl
    this.scene = new THREE.Scene()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    this.renderer.setClearColor( new THREE.Color( 0xCCCCCCC ))
    this.renderer.setSize(this.width,this.height)
    this.geometry = null
    this.material = null
    this.mesh = null
    this.camera = null

    this.init()
  }

  init() {
    this.setting()
    this.onRaf()
    this.tl = gsap.timeline()
    .to(this.material.uniforms.progress, {
      value:1,
      duration:1,
      delay:1.,
      ease:'circ.inOut'
    })
  }

  setting() {

    this.webgl.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      2 * Math.atan((this.height / 2) / 100) * 160 / Math.PI,
      this.width / this.height,
      1,
      1000
    )    

    this.camera.position.set(
      0,
      0,
      100
    )
    this.camera.updateProjectionMatrix()

    this._setMesh()

  }
  _setParticle(){
    const controls = new OrbitControls(this.camera,this.renderer.domElement);
  controls.enableDamping = true
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(t);
  this.camera.position.z = 5;
    this.geometry = new THREE.BufferGeometry();
    const count =2000;
    const position = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      position[i] = (Math.random() - 0.5) * 10;
    }
    this.geometry.setAttribute("position", new THREE.BufferAttribute(position,3));
     this.material = new THREE.PointsMaterial({
      size:0.3,
      sizeAttenuation:true,
      color:new THREE.Color('#FFFFFF'),
      map:texture,
      alphaMap:texture,
      transparent:true,
      depthTest:false
    })
    const particle = new THREE.Points(this.geometry,this.material);
    this.scene.add(particle);
    const raf = () => {
      particle.rotation.z +=0.001
      particle.rotation.x +=0.001
      particle.rotation.y +=0.001
      controls.update();
      this.renderer.render(this.scene,this.camera);
      window.requestAnimationFrame(raf);
    }
    raf();
  }
  _setMesh() {
    this.geometry = new THREE.PlaneBufferGeometry(this.width,this.height,100,100)
    this.material = new THREE.ShaderMaterial({
      vertexShader:vert,
      fragmentShader:frag,
      transparent:true,
      uniforms: {
        progress: {
          value:0.0
        },
      }
    })

    this.mesh = new THREE.Mesh(this.geometry,this.material);
    this.scene.add(this.mesh);
  }

  onResize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.mesh.scale.x = this.width
    this.mesh.scale.y = this.height
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.renderer.setSize( window.innerWidth,window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    this.camera.updateProjectionMatrix()
  }

  onRaf() {
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => {
      this.onRaf();
    })
  }
}
//   particle();

window.addEventListener('load',()=>{
  const gl = new main(document.querySelector('#canvas'));
  window.addEventListener('resize',()=>{
    gl.onResize();
  });
  setTimeout(() => {
    gl._setParticle();
  }, 1710);

})

// const scene = new THREE.Scene();

//   const camera = new THREE.PerspectiveCamera(
//     50,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );

//   const controls = new OrbitControls(camera,renderer.domElement);
//   controls.enableDamping = true
//   const textureLoader = new THREE.TextureLoader();
//   const texture = textureLoader.load(t);
//   camera.position.z = 5;
//   scene.add(camera);

//   const geometry = new THREE.BufferGeometry();
//   const count =2000;
//   const position = new Float32Array(count * 3);
//   for (let i = 0; i < count * 3; i++) {
//     position[i] = (Math.random() - 0.5) * 10;
//   }
//   geometry.setAttribute("position", new THREE.BufferAttribute(position,3));
//   const material = new THREE.PointsMaterial({
//     size:0.3,
//     sizeAttenuation:true,
//     color:new THREE.Color('#FFFFFF'),
//     map:texture,
//     alphaMap:texture,
//     transparent:true,
//     depthTest:false
//   })
//   const particle = new THREE.Points(geometry,material);
//   scene.add(particle);

//   const raf = () => {
//     particle.rotation.z +=0.001
//     particle.rotation.x +=0.001
//     particle.rotation.y +=0.001
//     controls.update();
//     gl.render(scene,camera);
//     window.requestAnimationFrame(raf);
//   }
//   raf();

