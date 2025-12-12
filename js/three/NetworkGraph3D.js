/**
 * 3D Network Graph visualization
 * Nodes with edges and pulsing animation
 */

import * as THREE from 'three';
import { ThreeVisualization } from './ThreeVisualization.js';

export class NetworkGraph3D extends ThreeVisualization {
  constructor(container, data) {
    super(container);
    this.data = data || this.generateSampleNetwork();
    this.nodes = [];
    this.edges = [];
    this.createNetwork();
  }

  generateSampleNetwork() {
    // Generate a sample network if no data provided
    const nodes = [];
    const edges = [];
    const nodeCount = 20;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: i,
        label: `Node ${i}`,
        size: 0.2 + Math.random() * 0.3,
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8
      });
    }

    // Create edges (random connections)
    for (let i = 0; i < nodeCount; i++) {
      const connections = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connections; j++) {
        const target = Math.floor(Math.random() * nodeCount);
        if (target !== i) {
          edges.push({ source: i, target });
        }
      }
    }

    return { nodes, edges, title: '3D Network Graph' };
  }

  createNetwork() {
    const { nodes, edges, title } = this.data;

    // Create node meshes
    nodes.forEach((node, index) => {
      const geometry = new THREE.SphereGeometry(node.size, 16, 16);
      const hue = index / nodes.length;
      const color = new THREE.Color().setHSL(hue, 0.7, 0.5);

      const material = new THREE.MeshPhongMaterial({
        color,
        shininess: 100,
        emissive: color,
        emissiveIntensity: 0.3
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(node.x, node.y, node.z);
      mesh.castShadow = true;
      mesh.userData = { ...node, index };

      this.scene.add(mesh);
      this.nodes.push(mesh);
    });

    // Create edge lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.4
    });

    edges.forEach((edge) => {
      const sourceNode = nodes[edge.source];
      const targetNode = nodes[edge.target];

      if (sourceNode && targetNode) {
        const points = [
          new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z),
          new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        this.scene.add(line);
        this.edges.push(line);
      }
    });

    // Add title
    this.addTitle(title);
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
    // Subtle pulsing effect on nodes (with safety check)
    if (!this.nodes || this.nodes.length === 0) return;

    const time = Date.now() * 0.002;
    this.nodes.forEach((node, index) => {
      const scale = 1 + Math.sin(time + index * 0.5) * 0.1;
      node.scale.setScalar(scale);
    });
  }
}
