import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer, TextureLoader, THREE } from 'expo-three';
import * as CANNON from 'cannon-es';
import { Accelerometer } from 'expo-sensors';

type DiceResult = number | string;

interface CannonVec3 {
  x: number;
  y: number;
  z: number;
}

interface PhysicsBody {
  position: CANNON.Vec3;
  velocity: CANNON.Vec3;
  angularVelocity: CANNON.Vec3;
  quaternion: CANNON.Quaternion;
  applyImpulse: (impulse: CANNON.Vec3, worldPoint?: CANNON.Vec3) => void;
  applyTorque: (torque: CANNON.Vec3) => void;
}

export default function DiceApp(): React.ReactElement {
  const [result, setResult] = useState<DiceResult>('振ってください');
  const [isSensorAvailable, setSensorAvailable] = useState<boolean>(true);
  const [sensorSubscription, setSensorSubscription] = useState<{ remove: () => void } | null>(null);

  const world = useRef<CANNON.World>(new CANNON.World());
  const dice = useRef<THREE.Mesh | null>(null);
  const cannonBody = useRef<PhysicsBody | null>(null);
  const renderer = useRef<Renderer | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const isRolling = useRef<boolean>(false);
  const lastAcceleration = useRef<CannonVec3>({ x: 0, y: 0, z: 0 });

  // サイコロの面のマッピング
  const faceMap: { [key: number]: number } = {
    0: 6, // 底面 (実際には6)
    1: 1, // 左面
    2: 5, // 背面
    3: 2, // 右面
    4: 3, // 正面
    5: 4  // 上面
  };

  // 加速度センサーのセットアップ
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    const setupSensors = async (): Promise<void> => {
      const isAccelerometerAvailable = await Accelerometer.isAvailableAsync();

      if (isAccelerometerAvailable) {
        Accelerometer.setUpdateInterval(100); // 更新間隔（ミリ秒）

        subscription = Accelerometer.addListener((data) => {
          if (!isRolling.current && cannonBody.current) {
            // 加速度データを保存
            lastAcceleration.current = {
              x: data.x,
              y: data.y,
              z: data.z
            };
          }
        });

        setSensorSubscription(subscription);
        setSensorAvailable(true);
      } else {
        setSensorAvailable(false);
        console.log('加速度センサーが利用できません');
      }
    };

    setupSensors();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // 結果を判定する関数
  const getDiceValue = (): number | null => {
    if (!cannonBody.current) return null;

    // サイコロの向きを取得
    const rotation = cannonBody.current.quaternion;
    const rotationMatrix = new CANNON.Mat3();
    rotationMatrix.setRotationFromQuaternion(rotation);

    // Y軸方向の向きベクトルを計算
    const upVector = new CANNON.Vec3(0, 1, 0);
    const transformedVector = new CANNON.Vec3();
    rotationMatrix.vmult(upVector, transformedVector);

    // 最も上を向いている面を判定
    let maxDot = -Infinity;
    let faceIndex = -1;

    // 各面の法線ベクトル
    const normals: CANNON.Vec3[] = [
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
  const initPhysics = (): void => {
    if (!world.current) return;

    world.current.gravity.set(0, -9.82, 0);
    world.current.broadphase = new CANNON.NaiveBroadphase();
    // world.current.solver.iterations = 10;

    // 地面を作成
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.set(0, -2, 0);
    world.current.addBody(groundBody);

    // サイコロの物理ボディを作成
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const body = new CANNON.Body({ mass: 1 });
    body.addShape(boxShape);
    body.position.set(0, 3, 0);
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
    // memo: typingされてないだけ
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
    const texture = await textureLoader.load(require('./assets/brick.jpg'));

    // 全ての面に同じテクスチャを使用
    const material = new THREE.MeshStandardMaterial({ map: texture });

    // サイコロのメッシュを作成
    dice.current = new THREE.Mesh(diceGeometry, material);
    scene.current.add(dice.current);

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

      // サイコロが止まったかチェック
      if (isRolling.current && cannonBody.current) {
        const velocity = cannonBody.current.velocity;
        const angularVelocity = cannonBody.current.angularVelocity;

        // 速度と角速度が小さくなったらサイコロが止まったと判断
        if (velocity.normalize() < 0.1 && angularVelocity.normalize() < 0.1) {
          isRolling.current = false;
          const value = getDiceValue();
          if (value !== null) {
            setResult(`結果: ${value}`);
          }
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

  // サイコロを振る関数
  const rollDice = (): void => {
    if (!cannonBody.current || isRolling.current || !isSensorAvailable) return;

    isRolling.current = true;
    setResult('振っています...');

    // サイコロの位置を初期化
    cannonBody.current.position.set(0, 3, 0);
    cannonBody.current.velocity.set(0, 0, 0);
    cannonBody.current.angularVelocity.set(0, 0, 0);

    // 加速度センサーからの力を加える
    const forceMagnitude = 5; // 力の大きさの倍率
    const impulse = new CANNON.Vec3(
      lastAcceleration.current.x * forceMagnitude,
      lastAcceleration.current.y * forceMagnitude,
      lastAcceleration.current.z * forceMagnitude
    );

    // 力が小さすぎる場合はランダムな力を加える
    // if (impulse.normalize() < 1) {
    //   impulse.set(
    //     (Math.random() - 0.5) * 3,
    //     Math.random() * 3,
    //     (Math.random() - 0.5) * 3
    //   );
    // }

    cannonBody.current.applyImpulse(impulse);

    // 加速度の回転成分から回転力も加える
    const torqueMagnitude = 2;
    const angularImpulse = new CANNON.Vec3(
      lastAcceleration.current.y * torqueMagnitude,
      lastAcceleration.current.z * torqueMagnitude,
      lastAcceleration.current.x * torqueMagnitude
    );

    cannonBody.current.applyTorque(angularImpulse);
  };

  return (
    <View style={styles.container}>
      <View style={styles.glContainer}>
        <GLView style={styles.gl} onContextCreate={onContextCreate} />
      </View>
      <Text style={styles.result}>{result}</Text>
      {!isSensorAvailable && (
        <Text style={styles.warning}>
          加速度センサーが使用できません。ランダムな動きで代用します。
        </Text>
      )}
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
  warning: {
    fontSize: 14,
    color: '#ffcc00',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
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
