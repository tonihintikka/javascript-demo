/**
 * 3D Bar Chart visualization
 * Animated bar chart with labels and shadows
 */

import * as THREE from 'three';
import { ThreeVisualization } from './ThreeVisualization.js';

export class BarChart3D extends ThreeVisualization {
  constructor(container, data) {
    super(container);
    this.data = data;
    this.bars = [];
    this.targetHeights = [];
    this.createBars();
  }

  createBars() {
    const { labels, values } = this.data;
    const barWidth = 0.8;
    const barDepth = 0.8;
    const spacing = 1.5;
    const maxValue = Math.max(...values);
    const scaleFactor = 5 / maxValue;

    const colors = [
      0x5470c6, 0x91cc75, 0xfac858, 0xee6666,
      0x73c0de, 0x3ba272, 0xfc8452, 0x9a60b4
    ];

    const offsetX = ((labels.length - 1) * spacing) / 2;

    labels.forEach((label, index) => {
      const height = values[index] * scaleFactor;
      this.targetHeights.push(height);

      // Create bar geometry (start with height 0 for animation)
      const geometry = new THREE.BoxGeometry(barWidth, 0.01, barDepth);
      const material = new THREE.MeshPhongMaterial({
        color: colors[index % colors.length],
        shininess: 80,
        specular: 0x444444
      });

      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = index * spacing - offsetX;
      bar.position.y = 0;
      bar.position.z = 0;
      bar.castShadow = true;
      bar.receiveShadow = true;

      // Store metadata
      bar.userData = { label, value: values[index], index };

      this.scene.add(bar);
      this.bars.push(bar);

      // Add label
      this.addLabel(label, index * spacing - offsetX, -0.5, 1);
    });

    // Add title
    this.addTitle(this.data.title || '3D Bar Chart');
  }

  addLabel(text, x, y, z) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    context.fillStyle = '#ffffff';
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.fillText(text, 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(x, y, z);
    sprite.scale.set(2, 0.5, 1);
    this.scene.add(sprite);
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
    sprite.position.set(0, 7, 0);
    sprite.scale.set(6, 0.75, 1);
    this.scene.add(sprite);
  }

  update() {
    // Animate bars growing (with safety check)
    if (!this.bars || this.bars.length === 0) return;

    this.bars.forEach((bar, index) => {
      const targetHeight = this.targetHeights[index];
      if (targetHeight === undefined) return;

      const currentScale = bar.scale.y;

      if (currentScale < targetHeight) {
        const newScale = Math.min(currentScale + 0.05, targetHeight);
        bar.scale.y = newScale;
        bar.position.y = newScale / 2;
      }
    });
  }

  updateData(newData) {
    this.data = newData;
    const maxValue = Math.max(...newData.values);
    const scaleFactor = 5 / maxValue;

    this.targetHeights = newData.values.map(v => v * scaleFactor);

    // Reset bar scales for animation
    this.bars.forEach((bar, index) => {
      bar.scale.y = 0.01;
      bar.position.y = 0;
      bar.userData.value = newData.values[index];
    });
  }
}
