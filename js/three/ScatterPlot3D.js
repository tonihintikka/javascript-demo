/**
 * 3D Scatter Plot visualization
 * Color-coded points with floating animation
 */

import * as THREE from 'three';
import { ThreeVisualization } from './ThreeVisualization.js';

export class ScatterPlot3D extends ThreeVisualization {
  constructor(container, data) {
    super(container);
    this.data = data;
    this.points = [];
    this.createPoints();
  }

  createPoints() {
    const { data, title } = this.data;

    // Normalize data to fit in view
    const xValues = data.map(d => d[0]);
    const yValues = data.map(d => d[1]);
    const zValues = data.map(d => d[2] || Math.random() * 10);

    const xMin = Math.min(...xValues), xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues), yMax = Math.max(...yValues);
    const zMin = Math.min(...zValues), zMax = Math.max(...zValues);

    const normalize = (val, min, max) => ((val - min) / (max - min || 1)) * 8 - 4;

    // Create points
    const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);

    data.forEach((point, index) => {
      const x = normalize(point[0], xMin, xMax);
      const y = normalize(point[1], yMin, yMax);
      const z = normalize(point[2] || zValues[index], zMin, zMax);

      // Color based on y value
      const hue = (point[1] - yMin) / (yMax - yMin);
      const color = new THREE.Color().setHSL(hue * 0.7, 0.8, 0.5);

      const material = new THREE.MeshPhongMaterial({
        color,
        shininess: 100,
        emissive: color,
        emissiveIntensity: 0.2
      });

      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.set(x, y, z);
      sphere.castShadow = true;
      sphere.userData = { originalY: y, index };

      this.scene.add(sphere);
      this.points.push(sphere);
    });

    // Add axes
    this.addAxes();

    // Add title
    this.addTitle(title || '3D Scatter Plot');
  }

  addAxes() {
    const axisLength = 5;

    // X axis (red)
    const xAxis = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-4, -4, -4),
      axisLength,
      0xff4444
    );
    this.scene.add(xAxis);

    // Y axis (green)
    const yAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-4, -4, -4),
      axisLength,
      0x44ff44
    );
    this.scene.add(yAxis);

    // Z axis (blue)
    const zAxis = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(-4, -4, -4),
      axisLength,
      0x4444ff
    );
    this.scene.add(zAxis);
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
    sprite.position.set(0, 6, 0);
    sprite.scale.set(6, 0.75, 1);
    this.scene.add(sprite);
  }

  update() {
    // Subtle floating animation (with safety check)
    if (!this.points || this.points.length === 0) return;

    const time = Date.now() * 0.001;
    this.points.forEach((point, index) => {
      if (!point.userData) return;
      const offset = Math.sin(time + index * 0.5) * 0.05;
      point.position.y = point.userData.originalY + offset;
    });
  }
}
