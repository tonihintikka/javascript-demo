/**
 * 3D Surface Plot visualization
 * Mathematical surface with color gradient and wireframe overlay
 */

import * as THREE from 'three';
import { ThreeVisualization } from './ThreeVisualization.js';

export class SurfacePlot3D extends ThreeVisualization {
  constructor(container, data) {
    super(container);
    this.data = data;
    this.mesh = null;
    this.wireframe = null;
    this.createSurface();
  }

  createSurface() {
    const resolution = 50;
    const size = 10;

    // Generate surface data using mathematical function
    const geometry = new THREE.PlaneGeometry(size, size, resolution - 1, resolution - 1);
    const positions = geometry.attributes.position.array;

    // Apply height function
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 1];

      // Mathematical surface function
      const y = this.surfaceFunction(x, z);
      positions[i + 2] = y;
    }

    // Rotate to correct orientation
    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();

    // Create color gradient based on height
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < positions.length; i += 3) {
      const height = positions[i + 1];
      const normalizedHeight = (height + 2) / 4; // Normalize to 0-1
      color.setHSL(0.7 - normalizedHeight * 0.7, 0.8, 0.5);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Material with vertex colors
    const material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      shininess: 50,
      flatShading: false
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // Add wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    this.wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
    this.wireframe.position.copy(this.mesh.position);
    this.scene.add(this.wireframe);

    // Add title
    this.addTitle(this.data?.title || '3D Surface Plot');
  }

  surfaceFunction(x, z) {
    // Interesting mathematical surface
    const r = Math.sqrt(x * x + z * z);
    return Math.sin(r * 1.5) * Math.cos(x * 0.5) * 2;
  }

  addTitle(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 64;

    context.fillStyle = '#ffffff';
    context.font = 'bold 36px Arial';
    context.textAlign = 'center';
    context.fillText(text, 256, 45);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(0, 5, 0);
    sprite.scale.set(6, 0.75, 1);
    this.scene.add(sprite);
  }

  update() {
    // Slow rotation for effect
    if (this.mesh) {
      this.mesh.rotation.y += 0.002;
      if (this.wireframe) {
        this.wireframe.rotation.y = this.mesh.rotation.y;
      }
    }
  }
}
