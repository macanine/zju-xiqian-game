import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  ShaderMaterial,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
} from "three";
import { terrainHeight } from "./config";

export function addTerrain(scene: Scene): MeshStandardMaterial {
  const geometry = new PlaneGeometry(132, 128, 72, 68);
  const position = geometry.getAttribute("position");
  for (let index = 0; index < position.count; index += 1) {
    const localX = position.getX(index);
    const localDepth = position.getY(index);
    const worldZ = -localDepth - 14;
    position.setZ(index, terrainHeight(localX, worldZ));
  }
  const uv = geometry.getAttribute("uv");
  geometry.setAttribute("uv2", new BufferAttribute(new Float32Array(uv.array as ArrayLike<number>), 2));
  geometry.computeVertexNormals();

  // The material starts neutral while the photo scanned PBR maps load.
  // There is deliberately no procedural or hand-painted fallback texture.
  const material = new MeshStandardMaterial({
    color: 0x756b58,
    roughness: 1,
    metalness: 0,
    displacementScale: 0.055,
    displacementBias: -0.0275,
  });
  const ground = new Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.08, -14);
  ground.receiveShadow = true;
  scene.add(ground);
  return material;
}

function createDeformedSurface(width: number, depth: number, centerZ: number, lift: number): BufferGeometry {
  const geometry = new PlaneGeometry(width, depth, 72, 20);
  const position = geometry.getAttribute("position");
  for (let index = 0; index < position.count; index += 1) {
    const localX = position.getX(index);
    const localDepth = position.getY(index);
    const worldZ = centerZ - localDepth;
    position.setZ(index, terrainHeight(localX, worldZ) + lift);
  }
  const uv = geometry.getAttribute("uv");
  geometry.setAttribute("uv2", new BufferAttribute(new Float32Array(uv.array as ArrayLike<number>), 2));
  geometry.computeVertexNormals();
  return geometry;
}

export function addSurfacePatch(scene: Scene, centerZ: number, depth: number): MeshStandardMaterial {
  const material = new MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    displacementScale: 0.035,
    displacementBias: -0.0175,
  });
  const patch = new Mesh(createDeformedSurface(132, depth, centerZ, 0.035), material);
  patch.rotation.x = -Math.PI / 2;
  patch.position.z = centerZ;
  patch.receiveShadow = true;
  scene.add(patch);
  return material;
}

export async function loadPbrMaterial(
  material: MeshStandardMaterial,
  root: string,
  repeat: [number, number],
  displacementScale: number,
  mapExtension: "jpg" | "png",
): Promise<Texture[]> {
  const loader = new TextureLoader();
  const [diffuse, normal, roughness, ao, displacement] = await Promise.all([
    loader.loadAsync(`${root}/diffuse.jpg`),
    loader.loadAsync(`${root}/normal.${mapExtension}`),
    loader.loadAsync(`${root}/roughness.${mapExtension}`),
    loader.loadAsync(`${root}/ao.${mapExtension}`),
    loader.loadAsync(`${root}/displacement.${mapExtension}`),
  ]);
  const maps = [diffuse, normal, roughness, ao, displacement];
  maps.forEach((texture) => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
    texture.anisotropy = 4;
  });
  diffuse.colorSpace = SRGBColorSpace;
  material.map = diffuse;
  material.normalMap = normal;
  material.roughnessMap = roughness;
  material.aoMap = ao;
  material.displacementMap = displacement;
  material.displacementScale = displacementScale;
  material.displacementBias = -displacementScale * 0.5;
  material.needsUpdate = true;
  return maps;
}

export function createRibbon(curve: CatmullRomCurve3, width: number, lift: number, segments = 180): BufferGeometry {
  const positions = new Float32Array((segments + 1) * 2 * 3);
  const uvs = new Float32Array((segments + 1) * 2 * 2);
  const indices: number[] = [];
  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const side = new Vector3(-tangent.z, 0, tangent.x).normalize();
    const left = point.clone().addScaledVector(side, width);
    const right = point.clone().addScaledVector(side, -width);
    left.y += lift;
    right.y += lift;
    const offset = index * 6;
    positions[offset] = left.x;
    positions[offset + 1] = left.y;
    positions[offset + 2] = left.z;
    positions[offset + 3] = right.x;
    positions[offset + 4] = right.y;
    positions[offset + 5] = right.z;
    const uvOffset = index * 4;
    uvs[uvOffset] = 0;
    uvs[uvOffset + 1] = t * 12;
    uvs[uvOffset + 2] = 1;
    uvs[uvOffset + 3] = t * 12;
    if (index < segments) {
      const next = index * 2;
      indices.push(next, next + 1, next + 2, next + 1, next + 3, next + 2);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
  geometry.setAttribute("uv2", new BufferAttribute(new Float32Array(uvs), 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function addRoute(scene: Scene, route: CatmullRomCurve3): { roadMaterial: MeshStandardMaterial } {
  const roadMaterial = new MeshStandardMaterial({
    color: 0x81715e,
    roughness: 1,
    side: DoubleSide,
    displacementScale: 0.018,
  });
  const road = new Mesh(createRibbon(route, 0.14, 0.045), roadMaterial);
  road.receiveShadow = true;
  scene.add(road);
  return { roadMaterial };
}

const waterVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vec3 displaced = position;
    float longWave = sin(position.z * 2.2 + uTime * 0.85) * 0.018;
    float crossWave = sin(position.x * 5.4 - uTime * 1.2 + position.z * 0.9) * 0.012;
    displaced.y += longWave + crossWave;
    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPosition.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const waterFragmentShader = `
  uniform float uTime;
  uniform vec3 uWaterColor;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    float rippleA = sin(vUv.y * 80.0 - uTime * 1.8 + sin(vUv.x * 18.0) * 2.0);
    float rippleB = sin(vUv.y * 34.0 + uTime * 1.1 + vUv.x * 21.0);
    float glint = smoothstep(0.55, 0.98, rippleA * 0.5 + rippleB * 0.5 + 0.5);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float grazing = 1.0 - max(dot(viewDirection, vec3(0.0, 1.0, 0.0)), 0.0);
    vec3 color = mix(uWaterColor, vec3(0.58, 0.84, 0.78), glint * 0.34);
    color += vec3(0.18, 0.25, 0.20) * grazing * 0.2;
    float alpha = mix(0.68, 0.88, grazing) + glint * 0.04;
    float shore = 1.0 - smoothstep(0.03, 0.18, min(vUv.x, 1.0 - vUv.x));
    color = mix(color, vec3(0.66, 0.82, 0.76), shore * 0.22);
    gl_FragColor = vec4(color, alpha);
  }
`;

export interface WatercourseLayer {
  bedMaterial: MeshStandardMaterial;
  update: (elapsed: number) => void;
}

export function addWatercourse(scene: Scene, river: CatmullRomCurve3): WatercourseLayer {
  const bedMaterial = new MeshStandardMaterial({
    color: 0x665947,
    roughness: 1,
    displacementScale: 0.02,
    side: DoubleSide,
  });
  const riverbed = new Mesh(createRibbon(river, 2.8, -0.03, 160), bedMaterial);
  riverbed.receiveShadow = true;
  scene.add(riverbed);

  const waterMaterial = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWaterColor: { value: new Color(0x2f756b) },
    },
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
  });
  const water = new Mesh(createRibbon(river, 2.05, 0.055, 160), waterMaterial);
  water.renderOrder = 2;
  scene.add(water);
  return {
    bedMaterial,
    update: (elapsed) => {
      waterMaterial.uniforms.uTime.value = elapsed;
    },
  };
}
