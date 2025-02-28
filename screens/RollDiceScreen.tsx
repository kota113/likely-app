import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ExpoWebGLRenderingContext, GLView} from 'expo-gl';
import {Renderer, TextureLoader, THREE} from 'expo-three';
import * as CANNON from 'cannon-es';
import {Accelerometer} from 'expo-sensors';

interface PhysicsBody {
  position: CANNON.Vec3;
  velocity: CANNON.Vec3;
  angularVelocity: CANNON.Vec3;
  quaternion: CANNON.Quaternion;
  applyImpulse: (impulse: CANNON.Vec3, worldPoint?: CANNON.Vec3) => void;
  applyTorque: (torque: CANNON.Vec3) => void;
}

export default function Screen(): React.ReactElement {
  const [isSensorAvailable, setSensorAvailable] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('端末を振るとサイコロが転がります');

  const world = useRef<CANNON.World>(new CANNON.World());
  const dice = useRef<THREE.Mesh | null>(null);
  const cannonBody = useRef<PhysicsBody | null>(null);
  const renderer = useRef<Renderer | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const isRolling = useRef<boolean>(false);
  const accelerationThreshold = 2.0; // 加速度変化の閾値
  const lastRollTime = useRef<number>(0);
  const rollCooldown = 800; // ミリ秒単位のクールダウン

  // 加速度センサーのセットアップ
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    // 前回の加速度を記録
    let lastAccelData = { x: 0, y: 0, z: 0 };

    const setupSensors = async (): Promise<void> => {
      const isAccelerometerAvailable = await Accelerometer.isAvailableAsync();

      if (isAccelerometerAvailable) {
        Accelerometer.setUpdateInterval(50); // 更新間隔（ミリ秒）

        subscription = Accelerometer.addListener((data) => {
          // 加速度の変化量を計算
          const deltaX = Math.abs(data.x - lastAccelData.x);
          const deltaY = Math.abs(data.y - lastAccelData.y);
          const deltaZ = Math.abs(data.z - lastAccelData.z);

          // 変化量の合計（振動の激しさ）
          const totalDelta = deltaX + deltaY + deltaZ;

          // 現在の加速度を保存
          lastAccelData = { x: data.x, y: data.y, z: data.z };

          // しきい値を超えた場合でクールダウン期間が過ぎていればサイコロを振る
          const now = Date.now();
          if (totalDelta > accelerationThreshold &&
            !isRolling.current &&
            now - lastRollTime.current > rollCooldown) {
            console.log("振動を検知:", totalDelta);
            rollDice();
            lastRollTime.current = now;
          }
        });

        setSensorAvailable(true);
      } else {
        setSensorAvailable(false);
        setMessage('加速度センサーが利用できません');
      }
    };

    setupSensors();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // 物理世界の初期化
  const initPhysics = (): void => {
    if (!world.current) return;

    // 重力を設定
    world.current.gravity.set(0, -9.82, 0);
    world.current.broadphase = new CANNON.NaiveBroadphase();

    // 摩擦とダンピングを増やして動きを減衰させる
    world.current.defaultContactMaterial.friction = 0.5;
    world.current.defaultContactMaterial.restitution = 0.3;

    // 壁を作成（サイコロが画面外に出ないようにする）
    // 地面
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.set(0, -0.5, 0); // 地面の位置を上げる
    world.current.addBody(groundBody);

    // 壁（左）
    const leftWallShape = new CANNON.Plane();
    const leftWallBody = new CANNON.Body({ mass: 0 });
    leftWallBody.addShape(leftWallShape);
    leftWallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    leftWallBody.position.set(-3, 0, 0);
    world.current.addBody(leftWallBody);

    // 壁（右）
    const rightWallShape = new CANNON.Plane();
    const rightWallBody = new CANNON.Body({ mass: 0 });
    rightWallBody.addShape(rightWallShape);
    rightWallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    rightWallBody.position.set(3, 0, 0);
    world.current.addBody(rightWallBody);

    // 壁（奥）
    const backWallShape = new CANNON.Plane();
    const backWallBody = new CANNON.Body({ mass: 0 });
    backWallBody.addShape(backWallShape);
    backWallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), 0);
    backWallBody.position.set(0, 0, -3);
    world.current.addBody(backWallBody);

    // 壁（手前）
    const frontWallShape = new CANNON.Plane();
    const frontWallBody = new CANNON.Body({ mass: 0 });
    frontWallBody.addShape(frontWallShape);
    frontWallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);
    frontWallBody.position.set(0, 0, 3);
    world.current.addBody(frontWallBody);

    // サイコロの物理ボディを作成
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const body = new CANNON.Body({
      mass: 1,
      linearDamping: 0.5, // 移動の減衰
      angularDamping: 0.5  // 回転の減衰
    });
    body.addShape(boxShape);
    body.position.set(0, 0, 0); // 地面に接した状態から開始
    world.current.addBody(body);
    cannonBody.current = body as unknown as PhysicsBody;
  };

  // Three.jsのセットアップ
  const onContextCreate = async (gl: ExpoWebGLRenderingContext): Promise<void> => {
    // Three.jsのレンダラーを設定
    renderer.current = new Renderer({ gl });
    // @ts-ignore
    renderer.current.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    // @ts-ignore
    renderer.current.setClearColor('#efebd0');

    // シーンの作成
    scene.current = new THREE.Scene();

    // カメラの設定
    camera.current = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.current.position.set(0, 2, 5); // カメラ位置を調整
    camera.current.lookAt(0, 0, 0);

    // ライトの設定
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 5, 2);
    scene.current.add(directionalLight);

    // 地面の視覚的表現
    const floorGeometry = new THREE.PlaneGeometry(3, 3); // 床のサイズを縮小
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0 // Adjust the opacity for transparency
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    scene.current.add(floor);

    // 角丸サイコロの作成 - BoxGeometryの代わりにRoundedBoxGeometryライクな形状を使用
    // Expo-ThreeではRoundedBoxGeometryが直接利用できないため、代替アプローチを使用

    // 球体と立方体を組み合わせてサイコロを作成
    const boxSize = 1; // 少し小さめの箱サイズ
    const diceGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

    // テクスチャのロード
    const textureLoader = new TextureLoader();

    try {
      const textures = await Promise.all([
        textureLoader.load(require('../assets/dice1.png')),
        textureLoader.load(require('../assets/dice2.png')),
        textureLoader.load(require('../assets/dice3.png')),
        textureLoader.load(require('../assets/dice4.png')),
        textureLoader.load(require('../assets/dice5.png')),
        textureLoader.load(require('../assets/dice6.png')),
      ]);

      // サイコロのマテリアル (面ごとに異なるテクスチャ)
      const materials = [
        new THREE.MeshStandardMaterial({ map: textures[3] }), // 右面 (4)
        new THREE.MeshStandardMaterial({ map: textures[0] }), // 左面 (1)
        new THREE.MeshStandardMaterial({ map: textures[4] }), // 上面 (5)
        new THREE.MeshStandardMaterial({ map: textures[5] }), // 底面 (6)
        new THREE.MeshStandardMaterial({ map: textures[2] }), // 前面 (3)
        new THREE.MeshStandardMaterial({ map: textures[1] }), // 後面 (2)
      ];

      // サイコロのメッシュを作成
      dice.current = new THREE.Mesh(diceGeometry, materials);
      scene.current.add(dice.current);
    } catch (error) {
      console.error('テクスチャの読み込みに失敗しました:', error);

      // エラー時のフォールバック: 単色で表示
      const fallbackMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xff0000 }), // 赤
        new THREE.MeshStandardMaterial({ color: 0x00ff00 }), // 緑
        new THREE.MeshStandardMaterial({ color: 0x0000ff }), // 青
        new THREE.MeshStandardMaterial({ color: 0xffff00 }), // 黄
        new THREE.MeshStandardMaterial({ color: 0xff00ff }), // マゼンタ
        new THREE.MeshStandardMaterial({ color: 0x00ffff }), // シアン
      ];

      dice.current = new THREE.Mesh(diceGeometry, fallbackMaterials);
      scene.current.add(dice.current);
    }

    // 物理世界の初期化
    initPhysics();

    // アニメーションループ
    const render = (): void => {
      requestAnimationFrame(render);

      // 物理シミュレーションを更新
      if (world.current) {
        world.current.step(1/60);
      }

      // 3Dモデルの位置を物理ボディに合わせる
      if (cannonBody.current && dice.current) {
        dice.current.position.copy(cannonBody.current.position as unknown as THREE.Vector3);
        dice.current.quaternion.copy(cannonBody.current.quaternion as unknown as THREE.Quaternion);
      }

      // サイコロの位置を制限（万が一画面外に行ってしまった場合の安全策）
      if (dice.current) {
        const pos = dice.current.position;
        if (Math.abs(pos.x) > 3 || Math.abs(pos.z) > 3 || pos.y > 5 || pos.y < -1) {
          resetDicePosition();
        }
      }

      // サイコロが止まったかチェック
      if (isRolling.current && cannonBody.current) {
        const velocity = cannonBody.current.velocity;
        const angularVelocity = cannonBody.current.angularVelocity;

        // 速度と角速度が小さくなったらサイコロが止まったと判断
        if (velocity.length() < 0.05 && angularVelocity.length() < 0.05) {
          isRolling.current = false;
          setMessage('端末を振るとサイコロが転がります');
        }
      }

      if (renderer.current && scene.current && camera.current) {
        // memo: typingされてないだけ
        // @ts-ignore
        renderer.current.render(scene.current, camera.current);
      }

      gl.endFrameEXP();
    };

    render();
  };

  // サイコロの位置をリセット
  const resetDicePosition = (): void => {
    if (cannonBody.current) {
      cannonBody.current.position.set(0, 0, 0);
      cannonBody.current.velocity.set(0, 0, 0);
      cannonBody.current.angularVelocity.set(0, 0, 0);
      isRolling.current = false;
    }
  };

  // サイコロを振る関数
  const rollDice = (): void => {
    if (!cannonBody.current || isRolling.current || !isSensorAvailable) return;

    isRolling.current = true;
    setMessage('サイコロが転がっています...');

    // サイコロの位置を初期化
    cannonBody.current.position.set(0, 0, 0);
    cannonBody.current.velocity.set(0, 0, 0);
    cannonBody.current.angularVelocity.set(0, 0, 0);

    // 完全にランダムな力を加える
    const minUpwardForce = 8;  // 最小上向きの力
    const maxUpwardForce = 10;  // 最大上向きの力
    const horizontalForce = 1; // 水平方向の力の最大値

    // 上向きには常に強い力を、水平方向にはランダムな力を加える
    const impulse = new CANNON.Vec3(
      (Math.random() * 2 - 1) * horizontalForce, // -3.0〜3.0の範囲
      minUpwardForce + Math.random() * (maxUpwardForce - minUpwardForce), // 5.0〜8.0の範囲
      (Math.random() * 2 - 1) * horizontalForce  // -3.0〜3.0の範囲
    );

    cannonBody.current.applyImpulse(impulse);

    // 回転力も完全にランダムに加える
    const torqueMagnitude = 10; // 回転力の大きさ
    const angularImpulse = new CANNON.Vec3(
      (Math.random() * 2 - 1) * torqueMagnitude,
      (Math.random() * 2 - 1) * torqueMagnitude,
      (Math.random() * 2 - 1) * torqueMagnitude
    );

    cannonBody.current.applyTorque(angularImpulse);
  };

  return (
    <View style={styles.container}>
      <View style={styles.glContainer}>
        <GLView style={styles.gl} onContextCreate={onContextCreate} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {!isSensorAvailable && (
        <Text style={styles.warning}>
          加速度センサーが使用できません。
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efebd0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glContainer: {
    width: '100%',
    height: '80%',
    overflow: 'hidden',
  },
  gl: {
    flex: 1,
  },
  message: {
    fontSize: 18,
    color: 'white',
    marginVertical: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  warning: {
    fontSize: 14,
    color: '#ffcc00',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});
