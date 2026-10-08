/**
 * Motion System Tokens: Bakhtiar Abid Laskar Portfolio
 * Single source of truth for motion timing, easings, 3D distances, and scrub parameters.
 * Sections 4.3, 5.4, and 5.5.
 */

export const motionTokens = {
  // Interaction & micro-transition durations (seconds)
  durations: {
    instant: 0.1,
    fast: 0.2,
    base: 0.35,
    slow: 0.6,
    entrance: 0.9,
  },

  // GSAP standard easing curves
  eases: {
    out: 'power2.out',
    inOut: 'power2.inOut',
    smooth: 'power3.out',
    anticipate: 'power1.inOut',
    linear: 'none',
  },

  // Moment A: Hero Exit Scrub
  momentA: {
    perspective: 1000,          // px
    rotateXMax: 14,             // deg away from viewer
    translateZMax: -300,        // px into depth
    fontWidthStart: 125,        // Archivo wide setting
    fontWidthEnd: 85,           // Archivo condensed setting
  },

  // Moment B: Project Corridor (Signature 3D Moment)
  momentB: {
    perspective: 1200,          // px stage perspective
    cardZSpacing: 600,          // px along Z axis between adjacent panels
    cardApproachRotateY: 6,     // deg alternating angle while approaching
    scrollPixelsPerProject: 800,// px pinned scroll per project
    dwellHoldRatio: 0.2,        // portion of each slot dedicated to flat active dwell
  },

  // Moment C: Media Frame Depth & Pointer Tilt
  momentC: {
    maxTiltDeg: 4,              // deg max pointer tilt on fine-pointer devices
    dampingFactor: 0.15,        // smoothing on pointer follow
    layerTranslateZ: {
      frame: 0,                 // px base container
      screenshot: 25,           // px floating preview image
      chips: 50,                // px floating stack badges
    },
  },

  // Moment D: About Reveal
  momentD: {
    photoDepthOffset: 40,       // px offset against text
    lineStagger: 0.08,          // s stagger between revealed text segments
  },

  // Moment E: Closing
  momentE: {
    perspective: 1000,          // px container perspective
    rotateXStart: 70,           // deg initial tilt
    rotateXEnd: 0,              // deg resting flat angle
  },

  // Responsive & Media Queries
  mediaQueries: {
    finePointer: '(pointer: fine)',
    coarsePointer: '(pointer: coarse)',
    reducedMotion: '(prefers-reduced-motion: reduce)',
    desktopBreakpoint: '(min-width: 1024px)',
    tabletBreakpoint: '(min-width: 768px)',
  },
} as const;

export default motionTokens;
