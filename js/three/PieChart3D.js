/**
 * 3D Pie Chart visualization
 * Cylinder segments with labels and bobbing animation
 */

import * as THREE from 'three';
import { ThreeVisualization } from './ThreeVisualization.js';

export class PieChart3D extends ThreeVisualization {
  constructor(container, data) {
    super(container);
    this.data = data;
    this.segments = [];
    this.createPieChart();
  }

  createPieChart() {
    const { data, title } = this.data;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = 3;
    const height = 1;

    const colors = [
      0x5470c6, 0x91cc75, 0xfac858, 0xee6666,
      0x73c0de, 0x3ba272, 0xfc8452, 0x9a60b4
    ];

    let startAngle = 0;

    data.forEach((item, index) => {
      const angle = (item.value / total) * Math.PI * 2;

      // Create cylinder segment
      const geometry = new THREE.CylinderGeometry(
        radius, radius, height,
        32, 1, false,
        startAngle, angle
      );

      const material = new THREE.MeshPhongMaterial({
        color: colors[index % colors.length],
        shininess: 80
      });

      const segment = new THREE.Mesh(geometry, material);
      segment.position.y = height / 2;
      segment.castShadow = true;
      segment.receiveShadow = true;
      segment.userData = {
        label: item.name,
        value: item.value,
        percentage: ((item.value / total) * 100).toFixed(1),
        targetY: height / 2,
        index
      };

      this.scene.add(segment);
      this.segments.push(segment);

      // Add label
      const labelAngle = startAngle + angle / 2;
      const labelRadius = radius + 1;
      const labelX = Math.sin(labelAngle) * labelRadius;
      const labelZ = Math.cos(labelAngle) * labelRadius;
      this.addLabel(`${item.name}\n${segment.userData.percentage}%`, labelX, 2, labelZ);

      startAngle += angle;
    });

    // Add center cylinder
    const centerGeometry = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, height * 1.2, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a2e });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = height * 0.6;
    this.scene.add(center);

    // Add title
    this.addTitle(title || '3D Pie Chart');
  }

  addLabel(text, x, y, z) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    context.fillStyle = '#ffffff';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';

    const lines = text.split('\n');
    lines.forEach((line, i) => {
      context.fillText(line, 128, 40 + i * 30);
    });

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(x, y, z);
    sprite.scale.set(2, 1, 1);
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
    sprite.position.set(0, 5, 0);
    sprite.scale.set(6, 0.75, 1);
    this.scene.add(sprite);
  }

  update() {
    // Hover effect - raise segment on mouse proximity (simplified version)
    if (!this.segments || this.segments.length === 0) return;

    const time = Date.now() * 0.001;
    this.segments.forEach((segment, index) => {
      if (!segment.userData) return;
      // Subtle bob animation
      segment.position.y = segment.userData.targetY + Math.sin(time + index) * 0.05;
    });
  }
}
