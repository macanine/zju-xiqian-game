import {
  Box3,
  DoubleSide,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  NoColorSpace,
  Object3D,
  StaticDrawUsage,
  TextureLoader,
  Vector3,
  type Material,
  type Texture,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { assetUrl } from "../../domain/content";
import { seeded, terrainHeight } from "./config";

interface NatureAssetDefinition {
  id: string;
  count: number;
  height: [number, number];
}

export type NatureBand = "canopy" | "open" | "wet" | "humid" | "plateau";

interface NaturePlacementDefinition extends NatureAssetDefinition {
  band: NatureBand;
  xRange: [number, number];
  zRange: [number, number];
  groundOffset?: number;
}

interface RiverBankPlacementDefinition extends NatureAssetDefinition {
  band: NatureBand;
  offset: [number, number];
}

interface RouteEdgePlacementDefinition extends NatureAssetDefinition {
  band: NatureBand;
  tRange: [number, number];
  offset: [number, number];
}

interface NatureBatchMesh {
  instance: InstancedMesh;
  sourceMatrix: Matrix4;
}

interface NatureBatch {
  meshes: NatureBatchMesh[];
  index: number;
}

// The route is a visual interpretation of the journey. The bands keep each
// narrative stop spatially distinct while using only the locally sourced GLTF
// assets. They also leave enough overlap for a smooth camera transition.
const natureAssetDefinitions: NaturePlacementDefinition[] = [
  { id: "island_tree_02", band: "canopy", count: 3, height: [5.2, 7.2], xRange: [-40, 40], zRange: [6, 18], groundOffset: -0.42 },
  { id: "fir_sapling", band: "canopy", count: 32, height: [2.6, 4.7], xRange: [-46, 46], zRange: [5, 19] },
  { id: "pine_sapling_small", band: "canopy", count: 22, height: [2.2, 4.1], xRange: [-46, 46], zRange: [5, 19] },
  { id: "shrub_01", band: "canopy", count: 22, height: [0.7, 1.35], xRange: [-46, 46], zRange: [5, 19] },
  { id: "shrub_01", band: "open", count: 26, height: [0.7, 1.35], xRange: [-42, 42], zRange: [-8, 6] },
  { id: "rock_07", band: "open", count: 18, height: [0.35, 0.85], xRange: [-42, 42], zRange: [-8, 6] },
  { id: "boulder_01", band: "open", count: 8, height: [0.75, 1.55], xRange: [-42, 42], zRange: [-8, 6] },
  { id: "fir_sapling", band: "wet", count: 16, height: [2.6, 4.7], xRange: [-44, 44], zRange: [-23, -8] },
  { id: "shrub_01", band: "wet", count: 24, height: [0.7, 1.35], xRange: [-44, 44], zRange: [-23, -8] },
  { id: "rock_07", band: "wet", count: 8, height: [0.35, 0.85], xRange: [-44, 44], zRange: [-23, -8] },
  { id: "boulder_01", band: "wet", count: 8, height: [0.75, 1.55], xRange: [-44, 44], zRange: [-23, -8] },
  { id: "fern_02", band: "wet", count: 28, height: [0.5, 1.25], xRange: [-44, 44], zRange: [-23, -8] },
  { id: "shrub_sorrel_01", band: "wet", count: 20, height: [0.42, 0.9], xRange: [-44, 44], zRange: [-23, -8] },
  { id: "island_tree_02", band: "wet", count: 2, height: [4.8, 6.6], xRange: [-38, 38], zRange: [-22, -10], groundOffset: -0.42 },
  { id: "island_tree_02", band: "humid", count: 3, height: [5.2, 7.2], xRange: [-40, 40], zRange: [-34, -23], groundOffset: -0.42 },
  { id: "fir_sapling", band: "humid", count: 28, height: [2.6, 4.7], xRange: [-46, 46], zRange: [-35, -22] },
  { id: "pine_sapling_small", band: "humid", count: 20, height: [2.2, 4.1], xRange: [-46, 46], zRange: [-35, -22] },
  { id: "shrub_01", band: "humid", count: 22, height: [0.7, 1.35], xRange: [-46, 46], zRange: [-35, -22] },
  { id: "fern_02", band: "humid", count: 30, height: [0.5, 1.25], xRange: [-46, 46], zRange: [-35, -22] },
  { id: "shrub_sorrel_01", band: "humid", count: 20, height: [0.42, 0.9], xRange: [-46, 46], zRange: [-35, -22] },
  { id: "rock_07", band: "humid", count: 8, height: [0.35, 0.85], xRange: [-46, 46], zRange: [-35, -22] },
  { id: "pine_sapling_small", band: "plateau", count: 22, height: [2.2, 4.1], xRange: [-44, 44], zRange: [-51, -34] },
  { id: "fir_sapling", band: "plateau", count: 10, height: [2.6, 4.7], xRange: [-44, 44], zRange: [-51, -34] },
  { id: "shrub_01", band: "plateau", count: 18, height: [0.7, 1.35], xRange: [-44, 44], zRange: [-51, -34] },
  { id: "rock_07", band: "plateau", count: 14, height: [0.35, 0.85], xRange: [-44, 44], zRange: [-51, -34] },
  { id: "boulder_01", band: "plateau", count: 6, height: [0.75, 1.55], xRange: [-44, 44], zRange: [-51, -34] },
  { id: "island_tree_02", band: "plateau", count: 2, height: [4.8, 6.6], xRange: [-38, 38], zRange: [-50, -37], groundOffset: -0.42 },
];

const riverBankDefinitions: RiverBankPlacementDefinition[] = [
  { id: "boulder_01", band: "wet", count: 14, height: [0.7, 1.4], offset: [2.2, 3.6] },
  { id: "rock_07", band: "wet", count: 24, height: [0.3, 0.72], offset: [2.05, 3.2] },
  { id: "shrub_01", band: "humid", count: 18, height: [0.62, 1.2], offset: [3.1, 4.3] },
  { id: "fern_02", band: "wet", count: 22, height: [0.5, 1.1], offset: [2.8, 4.2] },
  { id: "shrub_sorrel_01", band: "humid", count: 16, height: [0.4, 0.85], offset: [3.2, 4.4] },
];

// A second layer follows the player-facing route itself. Wide biome scatter
// gives the world scale; this close layer prevents the camera corridor from
// reading as empty and keeps groundcover visible in every narrative stop.
const routeEdgeDefinitions: RouteEdgePlacementDefinition[] = [
  { id: "fir_sapling", band: "canopy", count: 12, height: [2.8, 4.8], tRange: [0.02, 0.2], offset: [8, 18] },
  { id: "pine_sapling_small", band: "canopy", count: 10, height: [2.4, 4.2], tRange: [0.02, 0.2], offset: [9, 19] },
  { id: "grass_bermuda_01", band: "canopy", count: 2, height: [0.72, 1.08], tRange: [0.02, 0.2], offset: [2.3, 5.2] },
  { id: "fern_02", band: "canopy", count: 10, height: [0.55, 1.15], tRange: [0.02, 0.2], offset: [2.1, 5.8] },
  { id: "shrub_sorrel_01", band: "canopy", count: 10, height: [0.45, 0.88], tRange: [0.02, 0.2], offset: [2.4, 6.2] },
  { id: "shrub_01", band: "canopy", count: 8, height: [0.65, 1.25], tRange: [0.02, 0.2], offset: [3.2, 7.2] },
  { id: "shrub_01", band: "open", count: 12, height: [0.65, 1.25], tRange: [0.2, 0.4], offset: [2.2, 6.2] },
  { id: "rock_07", band: "open", count: 8, height: [0.32, 0.78], tRange: [0.2, 0.4], offset: [2.0, 5.5] },
  { id: "grass_bermuda_01", band: "open", count: 2, height: [0.72, 1.08], tRange: [0.2, 0.4], offset: [2.3, 5.2] },
  { id: "fir_sapling", band: "wet", count: 10, height: [2.8, 4.8], tRange: [0.38, 0.62], offset: [8, 18] },
  { id: "grass_bermuda_01", band: "wet", count: 2, height: [0.72, 1.08], tRange: [0.38, 0.62], offset: [2.3, 5.2] },
  { id: "fern_02", band: "wet", count: 18, height: [0.55, 1.2], tRange: [0.38, 0.62], offset: [2.1, 5.8] },
  { id: "shrub_sorrel_01", band: "wet", count: 12, height: [0.45, 0.9], tRange: [0.38, 0.62], offset: [2.4, 6.1] },
  { id: "shrub_01", band: "wet", count: 10, height: [0.65, 1.3], tRange: [0.38, 0.62], offset: [3.1, 7.0] },
  { id: "fir_sapling", band: "humid", count: 14, height: [2.8, 4.8], tRange: [0.58, 0.82], offset: [8, 18] },
  { id: "pine_sapling_small", band: "humid", count: 10, height: [2.4, 4.2], tRange: [0.58, 0.82], offset: [9, 19] },
  { id: "grass_bermuda_01", band: "humid", count: 2, height: [0.72, 1.08], tRange: [0.58, 0.82], offset: [2.3, 5.2] },
  { id: "fern_02", band: "humid", count: 18, height: [0.55, 1.2], tRange: [0.58, 0.82], offset: [2.1, 5.8] },
  { id: "shrub_sorrel_01", band: "humid", count: 12, height: [0.45, 0.9], tRange: [0.58, 0.82], offset: [2.4, 6.1] },
  { id: "shrub_01", band: "humid", count: 10, height: [0.65, 1.3], tRange: [0.58, 0.82], offset: [3.1, 7.0] },
  { id: "pine_sapling_small", band: "plateau", count: 10, height: [2.4, 4.2], tRange: [0.78, 0.98], offset: [8, 18] },
  { id: "fir_sapling", band: "plateau", count: 6, height: [2.8, 4.8], tRange: [0.78, 0.98], offset: [9, 19] },
  { id: "grass_bermuda_01", band: "plateau", count: 2, height: [0.72, 1.08], tRange: [0.78, 0.98], offset: [2.3, 5.2] },
  { id: "shrub_01", band: "plateau", count: 12, height: [0.65, 1.25], tRange: [0.78, 0.98], offset: [2.2, 6.4] },
  { id: "rock_07", band: "plateau", count: 8, height: [0.32, 0.78], tRange: [0.78, 0.98], offset: [2.0, 5.8] },
];

const bandVisibility: Record<string, NatureBand[]> = {
  "prologue-hangzhou": ["canopy", "open"],
  "01-xitianmushan": ["canopy", "open"],
  "02-jiande": ["canopy", "open", "wet"],
  "03-jian": ["open", "wet"],
  "04-taihe": ["open", "wet", "humid"],
  "05-yishan": ["wet", "humid", "plateau"],
  "06-zunyi-meitan": ["humid", "plateau"],
  "finale-1946": ["humid", "plateau"],
};

export interface NatureWorld {
  root: Group;
  setNode: (nodeId: string) => void;
}

function normalizeNatureAsset(asset: Object3D): Object3D {
  asset.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(asset);
  const size = bounds.getSize(new Vector3());
  const scale = 1 / Math.max(size.y, 0.001);
  asset.scale.setScalar(scale);
  asset.position.x -= (bounds.min.x + bounds.max.x) * 0.5 * scale;
  asset.position.y -= bounds.min.y * scale;
  asset.position.z -= (bounds.min.z + bounds.max.z) * 0.5 * scale;
  asset.updateMatrixWorld(true);
  asset.traverse((object) => {
    if (object instanceof Mesh) {
      // Foliage is lit by the PBR material and baked AO. Avoid making every
      // leaf a dynamic shadow caster/receiver when hundreds are on screen.
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;
    }
  });
  return asset;
}

async function loadNaturePrototypes(): Promise<Map<string, Object3D>> {
  const loader = new GLTFLoader();
  const textureLoader = new TextureLoader();
  const { SimplifyModifier } = await import("three/addons/modifiers/SimplifyModifier.js");
  const simplifier = new SimplifyModifier();
  const assetIds = [
    ...new Set(
      [...natureAssetDefinitions, ...riverBankDefinitions, ...routeEdgeDefinitions].map((definition) => definition.id),
    ),
  ];
  const grassAlphaMap = assetIds.includes("grass_bermuda_01")
    ? await textureLoader.loadAsync(
        assetUrl("models/polyhaven/grass_bermuda_01/textures/grass_bermuda_01_alpha_1k.png"),
      )
    : null;
  if (grassAlphaMap) grassAlphaMap.colorSpace = NoColorSpace;
  const entries = await Promise.all(
    assetIds.map(async (id) => {
      const path = assetUrl(`models/polyhaven/${id}/${id}_1k.gltf`);
      const gltf = await loader.loadAsync(path);
      if (id === "grass_bermuda_01" && grassAlphaMap) {
        gltf.scene.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (!(material instanceof MeshStandardMaterial)) return;
            material.alphaMap = grassAlphaMap;
            material.alphaTest = 0.42;
            material.side = DoubleSide;
            material.needsUpdate = true;
          });
        });
      }
      const keepRatio = id === "island_tree_02"
        ? 0.1
        : id === "fir_sapling" || id === "pine_sapling_small"
          ? 0.14
          : id === "shrub_01"
            ? 0.16
            : id === "boulder_01"
              ? 0.32
              : id === "rock_07"
                ? 0.45
                : 0.72;
      const geometries = new Set<import("three").BufferGeometry>();
      const meshes: Mesh[] = [];
      gltf.scene.traverse((object) => {
        if (object instanceof Mesh && !geometries.has(object.geometry)) {
          geometries.add(object.geometry);
          meshes.push(object);
        }
      });
      await Promise.all(
        meshes.map(async (mesh) => {
          const position = mesh.geometry.getAttribute("position");
          if (!position || position.count < 120) return;
          const remove = Math.floor(position.count * (1 - keepRatio));
          if (remove < 3) return;
          const original = mesh.geometry;
          mesh.geometry = await simplifier.modify(original, remove);
          mesh.geometry.computeBoundingBox();
          mesh.geometry.computeBoundingSphere();
          original.dispose();
        }),
      );
      return [id, normalizeNatureAsset(gltf.scene)] as const;
    }),
  );
  return new Map(entries);
}

function batchKey(band: NatureBand, id: string): string {
  return `${band}:${id}`;
}

function createNatureBatches(
  prototypes: Map<string, Object3D>,
  bandGroups: Map<NatureBand, Group>,
): Map<string, NatureBatch> {
  const capacities = new Map<string, number>();
  [...natureAssetDefinitions, ...riverBankDefinitions, ...routeEdgeDefinitions].forEach((definition) => {
    const key = batchKey(definition.band, definition.id);
    capacities.set(key, (capacities.get(key) ?? 0) + definition.count);
  });
  const batches = new Map<string, NatureBatch>();
  capacities.forEach((capacity, key) => {
    const [band, id] = key.split(":") as [NatureBand, string];
    const prototype = prototypes.get(id);
    const bandGroup = bandGroups.get(band);
    if (!prototype || !bandGroup) return;
    const meshes: NatureBatchMesh[] = [];
    prototype.updateMatrixWorld(true);
    const sourceMeshes: Mesh[] = [];
    prototype.traverse((object) => {
      if (object instanceof Mesh) sourceMeshes.push(object);
    });
    if (id === "grass_bermuda_01" && sourceMeshes.length > 1) {
      const mergedParts = sourceMeshes.map((source) => {
        const geometry = source.geometry.clone();
        geometry.applyMatrix4(source.matrixWorld);
        return geometry;
      });
      const merged = mergeGeometries(mergedParts, false);
      mergedParts.forEach((geometry) => geometry.dispose());
      const sourceGeometries = new Set(sourceMeshes.map((source) => source.geometry));
      sourceGeometries.forEach((geometry) => geometry.dispose());
      if (merged) {
        const instance = new InstancedMesh(merged, sourceMeshes[0].material, capacity);
        instance.instanceMatrix.setUsage(StaticDrawUsage);
        instance.castShadow = false;
        instance.receiveShadow = false;
        instance.frustumCulled = true;
        bandGroup.add(instance);
        meshes.push({ instance, sourceMatrix: new Matrix4() });
      }
    } else {
      sourceMeshes.forEach((source) => {
        const instance = new InstancedMesh(source.geometry, source.material, capacity);
        instance.instanceMatrix.setUsage(StaticDrawUsage);
        instance.castShadow = false;
        instance.receiveShadow = false;
        instance.frustumCulled = true;
        bandGroup.add(instance);
        meshes.push({ instance, sourceMatrix: source.matrixWorld.clone() });
      });
    }
    if (meshes.length) batches.set(key, { meshes, index: 0 });
  });
  return batches;
}

function placeNatureInstance(
  batches: Map<string, NatureBatch>,
  band: NatureBand,
  id: string,
  position: Vector3,
  scale: number,
  rotation: number,
  transform: Object3D,
): void {
  const batch = batches.get(batchKey(band, id));
  if (!batch || batch.index >= batch.meshes[0].instance.count) return;
  transform.position.copy(position);
  transform.rotation.set(0, rotation, 0);
  transform.scale.setScalar(scale);
  transform.updateMatrix();
  const instanceIndex = batch.index;
  batch.meshes.forEach(({ instance, sourceMatrix }) => {
    instance.setMatrixAt(instanceIndex, new Matrix4().multiplyMatrices(transform.matrix, sourceMatrix));
  });
  batch.index += 1;
}

function finalizeNatureBatches(batches: Map<string, NatureBatch>): void {
  batches.forEach(({ meshes, index }) => {
    meshes.forEach(({ instance }) => {
      instance.count = index;
      instance.instanceMatrix.needsUpdate = true;
      if (index > 0) instance.computeBoundingSphere();
    });
  });
}

export function disposeObject(object: Object3D): void {
  const geometries = new Set<object>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    if (!geometries.has(child.geometry)) {
      geometries.add(child.geometry);
      child.geometry.dispose();
    }
    const meshMaterials = Array.isArray(child.material) ? child.material : [child.material];
    meshMaterials.forEach((material) => {
      if (materials.has(material)) return;
      materials.add(material);
      const materialWithTextures = material as Material &
        Partial<Record<"map" | "normalMap" | "roughnessMap" | "metalnessMap" | "aoMap" | "alphaMap", Texture | null>>;
      [
        materialWithTextures.map,
        materialWithTextures.normalMap,
        materialWithTextures.roughnessMap,
        materialWithTextures.metalnessMap,
        materialWithTextures.aoMap,
        materialWithTextures.alphaMap,
      ].forEach((texture) => {
        if (texture) textures.add(texture);
      });
      material.dispose();
    });
  });
  textures.forEach((texture) => texture.dispose());
}

export async function populateNature(
  route: import("three").CatmullRomCurve3,
  river: import("three").CatmullRomCurve3,
): Promise<NatureWorld> {
  const prototypes = await loadNaturePrototypes();
  const root = new Group();
  root.name = "polyhaven-nature-assets";
  const bandGroups = new Map<NatureBand, Group>();
  for (const band of ["canopy", "open", "wet", "humid", "plateau"] as NatureBand[]) {
    const group = new Group();
    group.name = `polyhaven-band-${band}`;
    bandGroups.set(band, group);
    root.add(group);
  }
  const batches = createNatureBatches(prototypes, bandGroups);
  const transform = new Object3D();
  const routeSamples = route.getPoints(28);
  let sequence = 0;
  for (const definition of natureAssetDefinitions) {
    let placed = 0;
    for (let attempt = 0; attempt < definition.count * 8 && placed < definition.count; attempt += 1) {
      const x = definition.xRange[0] + seeded(sequence * 2 + 1) * (definition.xRange[1] - definition.xRange[0]);
      const z = definition.zRange[0] + seeded(sequence * 2 + 2) * (definition.zRange[1] - definition.zRange[0]);
      sequence += 1;
      const routeDistance = Math.min(...routeSamples.map((point) => Math.hypot(point.x - x, point.z - z)));
      if (routeDistance < 1.45) continue;
      const scale = definition.height[0] + seeded(sequence + 100) * (definition.height[1] - definition.height[0]);
      placeNatureInstance(
        batches,
        definition.band,
        definition.id,
        new Vector3(x, terrainHeight(x, z) + 0.02 + (definition.groundOffset ?? 0), z),
        scale,
        seeded(sequence + 200) * Math.PI * 2,
        transform,
      );
      placed += 1;
    }
  }
  for (const definition of riverBankDefinitions) {
    const bandGroup = bandGroups.get(definition.band);
    if (!bandGroup || !batches.has(batchKey(definition.band, definition.id))) continue;
    for (let index = 0; index < definition.count; index += 1) {
      const sequenceIndex = 1000 + index + definition.id.length * 17;
      const t = 0.06 + seeded(sequenceIndex) * 0.88;
      const point = river.getPointAt(t);
      const tangent = river.getTangentAt(t).normalize();
      const side = new Vector3(-tangent.z, 0, tangent.x).normalize();
      const sign = seeded(sequenceIndex + 7) > 0.5 ? 1 : -1;
      const offset = definition.offset[0] + seeded(sequenceIndex + 11) * (definition.offset[1] - definition.offset[0]);
      const position = point.clone().addScaledVector(side, sign * offset);
      const routeDistance = Math.min(...routeSamples.map((sample) => Math.hypot(sample.x - position.x, sample.z - position.z)));
      if (routeDistance < 1.45) continue;
      const scale = definition.height[0] + seeded(sequenceIndex + 100) * (definition.height[1] - definition.height[0]);
      placeNatureInstance(
        batches,
        definition.band,
        definition.id,
        new Vector3(position.x, terrainHeight(position.x, position.z) + 0.02, position.z),
        scale,
        seeded(sequenceIndex + 200) * Math.PI * 2,
        transform,
      );
    }
  }
  for (const definition of routeEdgeDefinitions) {
    const bandGroup = bandGroups.get(definition.band);
    if (!bandGroup || !batches.has(batchKey(definition.band, definition.id))) continue;
    for (let index = 0; index < definition.count; index += 1) {
      const sequenceIndex = 4000 + index + definition.id.length * 31 + definition.band.length * 13;
      const t = definition.tRange[0] + seeded(sequenceIndex) * (definition.tRange[1] - definition.tRange[0]);
      const point = route.getPointAt(t);
      const tangent = route.getTangentAt(t).normalize();
      const side = new Vector3(-tangent.z, 0, tangent.x).normalize();
      const sign = seeded(sequenceIndex + 7) > 0.5 ? 1 : -1;
      const offset = definition.offset[0] + seeded(sequenceIndex + 11) * (definition.offset[1] - definition.offset[0]);
      const position = point.clone().addScaledVector(side, sign * offset);
      const scale = definition.height[0] + seeded(sequenceIndex + 100) * (definition.height[1] - definition.height[0]);
      placeNatureInstance(
        batches,
        definition.band,
        definition.id,
        new Vector3(position.x, terrainHeight(position.x, position.z) + 0.02, position.z),
        scale,
        seeded(sequenceIndex + 200) * Math.PI * 2,
        transform,
      );
    }
  }
  finalizeNatureBatches(batches);
  const setNode = (nodeId: string) => {
    const visibleBands = new Set(bandVisibility[nodeId] ?? ["canopy", "open", "wet", "humid", "plateau"]);
    bandGroups.forEach((group, band) => {
      group.visible = visibleBands.has(band);
    });
  };
  setNode("prologue-hangzhou");
  return { root, setNode };
}
