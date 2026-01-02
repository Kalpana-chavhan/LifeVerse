"use client";

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';
import { Building2, Lock, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

function Building({ position, unlocked, type, level }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && unlocked) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const colors: Record<string, string> = {
    academy: '#8b5cf6',
    gym: '#ef4444',
    bank: '#10b981',
    garden: '#06b6d4',
    temple: '#f59e0b',
    hall: '#ec4899',
  };

  const height = unlocked ? 1 + level * 0.5 : 0.5;

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial 
          color={unlocked ? colors[type] : '#666666'} 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {unlocked && (
        <>
          <pointLight position={[0, height + 0.5, 0]} intensity={0.5} color={colors[type]} />
          <Text
            position={[0, height + 0.8, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Lv.{level}
          </Text>
        </>
      )}
      {!unlocked && (
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      )}
    </group>
  );
}

function CityScene() {
  const { buildings } = useGameStore();

  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 8, 8]} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <gridHelper args={[20, 20, '#333333', '#222222']} position={[0, -0.49, 0]} />

      {buildings.map((building) => (
        <Building
          key={building.id}
          position={[building.position.x, building.position.y, building.position.z]}
          unlocked={building.unlocked}
          type={building.type}
          level={building.level}
        />
      ))}

      <Text
        position={[0, 3, -8]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Your FocusCity
      </Text>
    </>
  );
}

export default function CityPage() {
  const { buildings, cityLevel, unlockBuilding, user, completedQuestsToday } = useGameStore();

  const unlockedBuildings = buildings.filter((b) => b.unlocked).length;
  const totalBuildings = buildings.length;
  const cityProgress = (unlockedBuildings / totalBuildings) * 100;

  const buildingInfo: Record<string, { emoji: string; description: string; requirement: string }> = {
    academy: {
      emoji: '🎓',
      description: 'Boosts learning XP by 10%',
      requirement: 'Complete 5 study quests',
    },
    gym: {
      emoji: '💪',
      description: 'Boosts fitness XP by 10%',
      requirement: 'Complete 5 fitness quests',
    },
    bank: {
      emoji: '🏦',
      description: 'Earn extra coins from quests',
      requirement: 'Save $1000',
    },
    garden: {
      emoji: '🌳',
      description: 'Boosts mental health XP',
      requirement: 'Complete 5 mental quests',
    },
    temple: {
      emoji: '🛕',
      description: 'Unlock meditation bonuses',
      requirement: 'Reach level 5',
    },
    hall: {
      emoji: '🏛️',
      description: 'Unlock clan features',
      requirement: 'Join a clan',
    },
  };

  const handleUnlock = (buildingId: string) => {
    if (user.coins >= 100) {
      unlockBuilding(buildingId);
      useGameStore.getState().addCoins(-100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Building2 className="h-10 w-10 text-blue-500" />
            Your FocusCity
          </h1>
          <p className="text-muted-foreground text-lg">
            Build and upgrade structures as you complete quests
          </p>
        </div>

        {/* City Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">City Level</p>
                <p className="text-3xl font-bold">{cityLevel}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Buildings</p>
                <p className="text-3xl font-bold">{unlockedBuildings} / {totalBuildings}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progress</p>
                <p className="text-3xl font-bold">{Math.round(cityProgress)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D City View */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">3D City View</h2>
                <Badge variant="outline">Drag to rotate • Scroll to zoom</Badge>
              </div>
              <div className="h-[520px] bg-black/50 rounded-lg overflow-hidden">
                  <Suspense fallback={
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading your city...</p>
                      </div>
                    </div>
                  }>
                    <Canvas shadows data-orchids-name="city-canvas">
                      <CityScene />
                    </Canvas>
                  </Suspense>
              </div>
            </Card>
          </div>

          {/* Buildings List */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Buildings</h3>
              <div className="space-y-3">
                {buildings.map((building) => {
                  const info = buildingInfo[building.type];
                  return (
                    <Card
                      key={building.id}
                      className={`p-4 transition-all ${
                        building.unlocked
                          ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20'
                          : 'bg-card opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-3xl">{info.emoji}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{building.name}</h4>
                              {building.unlocked && (
                                <Badge variant="outline" className="text-xs">
                                  Lv.{building.level}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {info.description}
                            </p>
                            {!building.unlocked && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
                                🔒 {info.requirement}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {!building.unlocked && (
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleUnlock(building.id)}
                          disabled={user.coins < 100}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Unlock (100 🪙)
                        </Button>
                      )}
                      {building.unlocked && (
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                          ✓ Unlocked & Active
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                How It Works
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Complete quests to unlock buildings</li>
                <li>• Each building provides unique bonuses</li>
                <li>• Upgrade buildings to increase effects</li>
                <li>• Your city grows with your progress</li>
                <li>• Interact with the 3D view above!</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
