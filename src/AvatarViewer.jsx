import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function AvatarModel({ isSpeaking, isBlinking }) {
  const { scene, animations } = useGLTF('/models/6891b6cd4dd25e58780a0edf.glb');
  const avatarRef = useRef();
  const mixerRef = useRef();

  useEffect(() => {
    if (scene && animations && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixerRef.current.clipAction(clip);
        action.play();
      });
    }
  }, [scene, animations]);

  useEffect(() => {
    let animationId;
    const animate = () => {
      if (mixerRef.current) {
        mixerRef.current.update(0.016);
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  // useEffect(() => {
  //   if (avatarRef.current) {
  //     if (isSpeaking) {
  //       const speakInterval = setInterval(() => {
  //         if (avatarRef.current) {
  //           avatarRef.current.rotation.y += 0.02;
  //           avatarRef.current.rotation.x = Math.sin(Date.now() * 0.01) * 0.1;
  //         }
  //       }, 100);
  //       return () => clearInterval(speakInterval);
  //     } else {
  //       if (avatarRef.current) {
  //         avatarRef.current.rotation.y = 0;
  //         avatarRef.current.rotation.x = 0;
  //       }
  //     }
  //   }
  // }, [isSpeaking]);

  // useEffect(() => {
  //   if (avatarRef.current) {
  //     const blinkInterval = setInterval(() => {
  //       if (avatarRef.current && isBlinking) {
  //         avatarRef.current.scale.y = 0.95;
  //         setTimeout(() => {
  //           if (avatarRef.current) {
  //             avatarRef.current.scale.y = 1;
  //           }
  //         }, 100);
  //       }
  //     }, 3000);
  //     return () => clearInterval(blinkInterval);
  //   }
  // }, [isBlinking]);

  return (
    <primitive
      ref={avatarRef}
      object={scene}
      scale={[1, 1, 1]}
      // position={[0, -0.8, 2.2]}
    />
  );
}

export default function AvatarViewer({ isSpeaking, isBlinking }) {
  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          // rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 4]}
          azimuth={[-Math.PI / 1.4, 0.75]}
        >
          <AvatarModel  />
        </PresentationControls>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  );
}