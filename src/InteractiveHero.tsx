import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// This component contains the 3D text and the custom shaders for the distortion effect.
function DistortedText() {
  const textRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  // The useFrame hook runs on every rendered frame.
  useFrame(({ clock, mouse }) => {
    if (materialRef.current) {
      // Update shader uniforms for time-based and mouse-based animation.
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.x, mouse.y), 0.1);
    }
  });

  // This is a custom GLSL shader material that creates the interactive visual effect.
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color('#FFFFFF') }, // Changed to white for a more refined look
    },
    // The vertex shader manipulates the position of each vertex in the 3D model.
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // This is the core distortion logic, creating waves based on time and mouse position.
        float distortion = sin(pos.y * 4.0 + uTime * 1.5 + uMouse.y * 2.0) * 0.1;
        distortion += cos(pos.x * 4.0 + uTime * 1.0 + uMouse.x * 2.0) * 0.1;
        
        pos.z += distortion;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    // The fragment shader determines the color of each pixel.
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;

      // Function to create a glowing line effect
      float glowingLine(float v, float thickness) {
        return smoothstep(0.0, 0.5, v) - smoothstep(0.5, 1.0, v);
      }

      void main() {
        // Create animated, glowing horizontal lines across the text
        float lines = glowingLine(fract(vUv.y * 10.0 - uTime * 0.2), 0.1);
        
        vec3 finalColor = uColor * (0.2 + lines * 0.8); // Base color plus bright lines
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide,
    transparent: true,
  });

  return (
    <Text
      ref={textRef}
      material={shaderMaterial}
      fontSize={2.5}
      font="/Syne-Bold.json" // Using a local, pre-converted font file
      anchorX="center"
      anchorY="middle"
      scale={[1, 1, 1]}
    >
      CAM
    </Text>
  );
}

// The main export component that sets up the 3D canvas.
export default function InteractiveHero() {
    return (
        <header className="header">
            <nav>
                {['Home', 'About', 'Photos'].map((item, idx) => (
                    <a key={idx} href={`#${item.toLowerCase()}`}>{item}</a>
                ))}
            </nav>
            <div className="logo-wrapper">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <Suspense fallback={null}>
                        <DistortedText />
                    </Suspense>
                </Canvas>
            </div>
        </header>
    );
}
