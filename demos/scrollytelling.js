/**
 * Scrollytelling 2.0 Demo - GSAP ScrollTrigger + ECharts
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as echarts from 'echarts';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// HERO ANIMATIONS
// ============================================

function initHero() {
  const titleWords = document.querySelectorAll('.title-word');
  const subtitle = document.querySelector('.hero-subtitle');

  gsap.fromTo(titleWords,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    }
  );

  gsap.fromTo(subtitle,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out'
    }
  );
}

// ============================================
// PROGRESS BAR
// ============================================

function initProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = Math.round(self.progress * 100);
        progressText.textContent = `${progress}%`;
      }
    }
  });
}

// ============================================
// FADE-IN ANIMATIONS
// ============================================

function initFadeIns() {
  const fadeElements = document.querySelectorAll('.fade-in');

  fadeElements.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1
        }
      }
    );
  });
}

// ============================================
// SCROLL METAPHOR ANIMATION
// ============================================

function initScrollMetaphor() {
  const scrollFrame = document.getElementById('scroll-frame');

  gsap.to(scrollFrame, {
    y: 300,
    ease: 'none',
    scrollTrigger: {
      trigger: '#section-intro',
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  });
}

// ============================================
// STICKY CHART WITH NARRATIVE
// ============================================

let growthChart = null;

function initGrowthChart() {
  const chartDom = document.getElementById('growth-chart');
  growthChart = echarts.init(chartDom);

  const data = [
    { year: 2020, value: 100 },
    { year: 2021, value: 250 },
    { year: 2022, value: 500 },
    { year: 2023, value: 900 },
    { year: 2024, value: 1200 },
    { year: 2025, value: 2000 }
  ];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 14, 39, 0.9)',
      borderColor: '#6366f1',
      textStyle: { color: '#e8eaf6' }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.year),
      axisLine: { lineStyle: { color: '#9fa8da' } },
      axisLabel: { color: '#9fa8da' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#9fa8da' } },
      axisLabel: { color: '#9fa8da' },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      data: data.map(d => d.value),
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#06b6d4' }
          ]
        }
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
            { offset: 1, color: 'rgba(6, 182, 212, 0.1)' }
          ]
        }
      },
      emphasis: {
        itemStyle: {
          color: '#6366f1',
          borderWidth: 2,
          borderColor: '#06b6d4'
        }
      }
    }]
  };

  growthChart.setOption(option);

  // Handle resize
  window.addEventListener('resize', () => {
    growthChart?.resize();
  });

  return growthChart;
}

function initNarrativeSteps() {
  const steps = document.querySelectorAll('.narrative-step');

  steps.forEach((step, index) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        updateChartHighlight(index + 1);
      },
      onEnterBack: () => {
        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        updateChartHighlight(index + 1);
      }
    });
  });
}

function updateChartHighlight(stepIndex) {
  if (!growthChart) return;

  const option = growthChart.getOption();
  const seriesData = option.series[0].data;

  // Highlight data point based on step
  const highlightIndex = Math.min(stepIndex, seriesData.length - 1);

  growthChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: highlightIndex
  });

  // Animate to that point
  growthChart.setOption({
    series: [{
      markPoint: {
        data: [{
          coord: [highlightIndex, seriesData[highlightIndex]],
          symbol: 'circle',
          symbolSize: 15,
          itemStyle: {
            color: '#06b6d4',
            borderColor: '#fff',
            borderWidth: 2
          }
        }]
      }
    }]
  });
}

// ============================================
// PIE CHART (CATEGORIES)
// ============================================

function initPieChart() {
  const chartDom = document.getElementById('pie-chart');
  const chart = echarts.init(chartDom);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 14, 39, 0.9)',
      borderColor: '#6366f1',
      textStyle: { color: '#e8eaf6' }
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: { color: '#9fa8da' }
    },
    series: [{
      name: 'User Categories',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#0a0e27',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#e8eaf6'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 900, name: 'Enterprise', itemStyle: { color: '#6366f1' } },
        { value: 600, name: 'SMB', itemStyle: { color: '#8b5cf6' } },
        { value: 500, name: 'Individual', itemStyle: { color: '#06b6d4' } }
      ]
    }]
  };

  chart.setOption(option);

  // Animate on scroll
  gsap.fromTo('.chart-reveal',
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#section-categories',
        start: 'top center',
        end: 'center center',
        scrub: 1
      }
    }
  );

  window.addEventListener('resize', () => chart.resize());
  return chart;
}

// ============================================
// PERFORMANCE BAR CHART
// ============================================

function initPerformanceChart() {
  const chartDom = document.getElementById('performance-chart');
  const chart = echarts.init(chartDom);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10, 14, 39, 0.9)',
      borderColor: '#6366f1',
      textStyle: { color: '#e8eaf6' }
    },
    legend: {
      data: ['2024', '2025'],
      textStyle: { color: '#9fa8da' }
    },
    xAxis: {
      type: 'category',
      data: ['Load Time', 'API Response', 'Time to Interactive', 'First Paint'],
      axisLine: { lineStyle: { color: '#9fa8da' } },
      axisLabel: { color: '#9fa8da', interval: 0, rotate: 15 }
    },
    yAxis: {
      type: 'value',
      name: 'ms',
      axisLine: { lineStyle: { color: '#9fa8da' } },
      axisLabel: { color: '#9fa8da' },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [
      {
        name: '2024',
        type: 'bar',
        data: [800, 200, 1200, 400],
        itemStyle: { color: '#9fa8da' }
      },
      {
        name: '2025',
        type: 'bar',
        data: [400, 100, 600, 200],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#6366f1' },
              { offset: 1, color: '#06b6d4' }
            ]
          }
        }
      }
    ]
  };

  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
  return chart;
}

// ============================================
// COUNTER ANIMATIONS
// ============================================

function initCounters() {
  const counters = document.querySelectorAll('.stat-value');

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: 'power2.out'
        });
      }
    });
  });
}

// ============================================
// PROJECTION LINE ANIMATION
// ============================================

function initProjection() {
  const projectionLine = document.getElementById('projection-line');

  gsap.fromTo(projectionLine,
    { scaleX: 0, transformOrigin: 'left' },
    {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#section-future',
        start: 'top center'
      }
    }
  );
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    initHero();
    initProgressBar();
    initFadeIns();
    initScrollMetaphor();
    initProjection();
    initCounters();
  }

  // Initialize charts
  initGrowthChart();
  initNarrativeSteps();
  initPieChart();
  initPerformanceChart();

  console.log('📊 Scrollytelling 2.0 demo initialized');
  console.log('GSAP ScrollTrigger active');

  // Refresh ScrollTrigger after images load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});

// Cleanup on page leave
window.addEventListener('beforeunload', () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  echarts.getInstanceByDom(document.getElementById('growth-chart'))?.dispose();
  echarts.getInstanceByDom(document.getElementById('pie-chart'))?.dispose();
  echarts.getInstanceByDom(document.getElementById('performance-chart'))?.dispose();
});
