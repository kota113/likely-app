import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader, THREE } from 'expo-three';
import * as CANNON from 'cannon-es';

export default function DiceApp() {
  const [result, setResult] = useState('振ってください');
  const world = useRef(new CANNON.World()).current;
  const dice = useRef(null);
  const cannonBody = useRef(null);
  const renderer = useRef(null);
  const camera = useRef(null);
  const scene = useRef(null);
  const isRolling = useRef(false);

  // サイコロの面のマッピング
  const faceMap = {
    0: 6, // 底面 (実際には6)
    1: 1, // 左面
    2: 5, // 背面
    3: 2, // 右面
    4: 3, // 正面
    5: 4  // 上面
  };

  // 結果を判定する関数
  const getDiceValue = () => {
    if (!cannonBody.current) return null;

    // サイコロの向きを取得
    const rotation = cannonBody.current.quaternion;
    const rotationMatrix = new CANNON.Mat3();
    rotation.toMatrix(rotationMatrix);

    // Y軸方向の向きベクトルを計算
    const upVector = new CANNON.Vec3(0, 1, 0);
    const transformedVector = new CANNON.Vec3();
    rotationMatrix.vmult(upVector, transformedVector);

    // 最も上を向いている面を判定
    let maxDot = -Infinity;
    let faceIndex = -1;

    // 各面の法線ベクトル
    const normals = [
      new CANNON.Vec3(0, -1, 0), // 底面
      new CANNON.Vec3(-1, 0, 0), // 左面
      new CANNON.Vec3(0, 0, -1), // 背面
      new CANNON.Vec3(1, 0, 0),  // 右面
      new CANNON.Vec3(0, 0, 1),  // 正面
      new CANNON.Vec3(0, 1, 0)   // 上面
    ];

    // 最も上を向いている面を計算
    for (let i = 0; i < normals.length; i++) {
      const dot = transformedVector.dot(normals[i]);
      if (dot > maxDot) {
        maxDot = dot;
        faceIndex = i;
      }
    }

    return faceMap[faceIndex];
  };

  // 物理世界の初期化
  const initPhysics = () => {
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    // 地面を作成
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.set(0, -2, 0);
    world.addBody(groundBody);

    // サイコロの物理ボディを作成
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    cannonBody.current = new CANNON.Body({ mass: 1 });
    cannonBody.current.addShape(boxShape);
    cannonBody.current.position.set(0, 3, 0);
    world.addBody(cannonBody.current);
  };

  // Three.jsのセットアップ
  const onContextCreate = async (gl) => {
    // Three.jsのレンダラーを設定
    renderer.current = new Renderer({ gl });
    renderer.current.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.current.setClearColor('black');

    // シーンの作成
    scene.current = new THREE.Scene();

    // カメラの設定
    camera.current = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.current.position.set(0, 0, 5);

    // ライトの設定
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.current.add(directionalLight);

    // サイコロの作成
    const diceGeometry = new THREE.BoxGeometry(1, 1, 1);

    // テクスチャのロード
    const textureLoader = new TextureLoader();
    const textures = await Promise.all([
      textureLoader.load(require('./assets/brick.jpg')),
      textureLoader.load(require('./assets/brick.jpg')),
      textureLoader.load(require('./assets/brick.jpg')),
      textureLoader.load(require('./assets/brick.jpg')),
      textureLoader.load(require('./assets/brick.jpg')),
      textureLoader.load(require('./assets/brick.jpg')),
    ]);

    // サイコロのマテリアル (面ごとに異なるテクスチャ)
    const materials = [
      new THREE.MeshStandardMaterial({ map: textures[3] }), // 右面 (2)
      new THREE.MeshStandardMaterial({ map: textures[0] }), // 左面 (1)
      new THREE.MeshStandardMaterial({ map: textures[4] }), // 上面 (5)
      new THREE.MeshStandardMaterial({ map: textures[5] }), // 底面 (6)
      new THREE.MeshStandardMaterial({ map: textures[2] }), // 前面 (3)
      new THREE.MeshStandardMaterial({ map: textures[1] }), // 後面 (4)
    ];

    // サイコロのメッシュを作成
    dice.current = new THREE.Mesh(diceGeometry, materials);
    scene.current.add(dice.current);

    // 物理世界の初期化
    initPhysics();

    // アニメーションループ
    const render = () => {
      requestAnimationFrame(render);

      // 物理シミュレーションを更新
      world.step(1/60);

      // 3Dモデルの位置を物理ボディに合わせる
      if (cannonBody.current && dice.current) {
        dice.current.position.copy(cannonBody.current.position);
        dice.current.quaternion.copy(cannonBody.current.quaternion);
      }

      // サイコロが止まったかチェック
      if (isRolling.current && cannonBody.current) {
        const velocity = cannonBody.current.velocity;
        const angularVelocity = cannonBody.current.angularVelocity;

        // 速度と角速度が小さくなったらサイコロが止まったと判断
        if (velocity.norm() < 0.1 && angularVelocity.norm() < 0.1) {
          isRolling.current = false;
          const value = getDiceValue();
          setResult(`結果: ${value}`);
        }
      }

      renderer.current.render(scene.current, camera.current);
      gl.endFrameEXP();
    };

    render();
  };

  // サイコロを振る関数
  const rollDice = () => {
    if (!cannonBody.current || isRolling.current) return;

    isRolling.current = true;
    setResult('振っています...');

    // サイコロの位置を初期化
    cannonBody.current.position.set(0, 3, 0);
    cannonBody.current.velocity.set(0, 0, 0);
    cannonBody.current.angularVelocity.set(0, 0, 0);

    // ランダムな方向に力を加える
    const force = 3;
    const impulse = new CANNON.Vec3(
      (Math.random() - 0.5) * force,
      Math.random() * force,
      (Math.random() - 0.5) * force
    );
    cannonBody.current.applyImpulse(impulse);

    // ランダムな回転も加える
    const angularImpulse = new CANNON.Vec3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    cannonBody.current.applyTorque(angularImpulse);
  };

  return (
    <View style={styles.container}>
      <View style={styles.glContainer}>
        <GLView style={styles.gl} onContextCreate={onContextCreate} />
      </View>
      <Text style={styles.result}>{result}</Text>
      <TouchableOpacity style={styles.button} onPress={rollDice}>
        <Text style={styles.buttonText}>サイコロを振る</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glContainer: {
    width: '100%',
    height: '70%',
    overflow: 'hidden',
  },
  gl: {
    flex: 1,
  },
  result: {
    fontSize: 24,
    color: 'white',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
