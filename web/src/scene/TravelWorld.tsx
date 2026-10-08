import { useEffect, useRef, type ReactElement } from "react";
import {
  ACESFilmicToneMapping,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  FogExp2,
  HemisphereLight,
  MathUtils,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Texture,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";
import { assetUrl } from "../domain/content";
import { addRoute, addSurfacePatch, addTerrain, addWatercourse, loadPbrMaterial } from "./world/materials";
import { disposeObject, populateNature, type NatureWorld } from "./world/assets";
import { riverPoints, routePoints } from "./world/config";
import { getWorldSceneProfile } from "./world/profiles";
import type { CinematicScreen, TravelWorldProps, WorldRuntime } from "./world/types";

export type { CinematicScreen } from "./world/types";
export type { TravelWorldProps } from "./world/types";

function targetProgress(screen: CinematicScreen, nodeIndex: number, eventIndex: number, eventCount: number, nodeCount: number): number {
  if (screen === "home") return 0.015;
  if (screen === "ending") return 0.99;
  const nodeProgress = nodeCount > 1 ? nodeIndex / (nodeCount - 1) : 0;
  const eventProgress = screen === "event" && eventCount > 0 ? Math.min(0.045, (eventIndex / eventCount) * 0.045) : 0;
  return Math.min(0.94, 0.06 + nodeProgress * 0.83 + eventProgress);
}

export function TravelWorld({ content, screen, storyNodeId, eventId, nodeIndex, eventIndex, eventCount }: TravelWorldProps): ReactElement | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ screen, storyNodeId, eventId, nodeIndex, eventIndex, eventCount });
  const runtimeRef = useRef<WorldRuntime | null>(null);
  propsRef.current = { screen, storyNodeId, eventId, nodeIndex, eventIndex, eventCount };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new Scene();
    const initialProfile = getWorldSceneProfile(propsRef.current.storyNodeId, propsRef.current.eventId);
    scene.background = new Color(initialProfile.background);
    scene.fog = new FogExp2(initialProfile.fog, initialProfile.fogDensity);

    const camera = new PerspectiveCamera(44, 1, 0.1, 220);
    const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    // Keep high-DPI displays from multiplying the full-screen foliage cost.
    // The scene uses PBR maps and baked AO, so a modest render scale keeps the
    // image crisp while leaving headroom for a stable 60 fps.
    const renderScale = 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, renderScale));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    // Dynamic shadows multiplied the cost of every dense GLTF foliage layer.
    // PBR AO and directional lighting retain depth cues without a second
    // shadow render of the entire landscape every frame.
    renderer.shadowMap.enabled = false;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.className = "travel-world-canvas";
    container.appendChild(renderer.domElement);

    const route = new CatmullRomCurve3(routePoints, false, "catmullrom", 0.42);
    const river = new CatmullRomCurve3(riverPoints, false, "catmullrom", 0.42);
    const terrainMaterial = addTerrain(scene);
    const loadedTerrainTextures: Texture[] = [];
    const loadedRoadTextures: Texture[] = [];
    const loadedSurfaceTextures: Texture[] = [];
    let natureWorld: NatureWorld | null = null;
    let disposed = false;

    void loadPbrMaterial(terrainMaterial, assetUrl("terrain/forest_ground_05"), [7, 7], 0.055, "png")
      .then((textures) => {
        if (disposed) {
          textures.forEach((texture) => texture.dispose());
          return;
        }
        loadedTerrainTextures.push(...textures);
      })
      .catch(() => undefined);

    const landscapePatches = [
      { centerZ: 12, depth: 10, root: "terrain/forest_ground_04", repeat: [4.5, 1.8] as [number, number] },
      { centerZ: 1, depth: 12, root: "terrain/aerial_grass_rock", repeat: [4.5, 2.2] as [number, number] },
      { centerZ: -12, depth: 12, root: "terrain/brown_mud_rocks_01", repeat: [4.2, 2] as [number, number] },
      { centerZ: -28, depth: 20, root: "terrain/dry_riverbed_rock", repeat: [4.4, 2.4] as [number, number] },
    ];
    landscapePatches.forEach((patch) => {
      const material = addSurfacePatch(scene, patch.centerZ, patch.depth);
      void loadPbrMaterial(material, assetUrl(patch.root), patch.repeat, 0.035, "jpg")
        .then((textures) => {
          if (disposed) {
            textures.forEach((texture) => texture.dispose());
            return;
          }
          loadedSurfaceTextures.push(...textures);
        })
        .catch(() => undefined);
    });

    const watercourse = addWatercourse(scene, river);
    void loadPbrMaterial(watercourse.bedMaterial, assetUrl("terrain/dry_riverbed_rock"), [1.5, 12], 0.02, "jpg")
      .then((textures) => {
        if (disposed) {
          textures.forEach((texture) => texture.dispose());
          return;
        }
        loadedSurfaceTextures.push(...textures);
      })
      .catch(() => undefined);

    void populateNature(route, river)
      .then((world) => {
        if (disposed) {
          disposeObject(world.root);
          return;
        }
        natureWorld = world;
        world.setNode(propsRef.current.storyNodeId);
        scene.add(world.root);
      })
      .catch(() => undefined);
    const routeLayer = addRoute(scene, route);
    void loadPbrMaterial(routeLayer.roadMaterial, assetUrl("terrain/rock_path"), [1.2, 11], 0.018, "jpg")
      .then((textures) => {
        if (disposed) {
          textures.forEach((texture) => texture.dispose());
          return;
        }
        loadedRoadTextures.push(...textures);
      })
      .catch(() => undefined);

    scene.add(new HemisphereLight(0xbdd4bf, 0x12251b, 2.35));
    const sun = new DirectionalLight(initialProfile.sunColor, initialProfile.sunIntensity);
    sun.position.set(-18, 32, 18);
    scene.add(sun);
    const rim = new DirectionalLight(initialProfile.rimColor, initialProfile.rimIntensity);
    rim.position.set(28, 14, -38);
    scene.add(rim);

    let activeProfileId = `${propsRef.current.storyNodeId}:${propsRef.current.eventId ?? ""}`;
    let activeProfile = initialProfile;
    const applyProfile = () => {
      scene.background = new Color(activeProfile.background);
      scene.fog = new FogExp2(activeProfile.fog, activeProfile.fogDensity);
      sun.color.setHex(activeProfile.sunColor);
      sun.intensity = activeProfile.sunIntensity;
      rim.color.setHex(activeProfile.rimColor);
      rim.intensity = activeProfile.rimIntensity;
    };

    const runtime: WorldRuntime = {
      renderer,
      scene,
      camera,
      route,
      progress: 0.015,
      targetProgress: 0.015,
      elapsed: 0,
    };
    runtimeRef.current = runtime;

    const pointer = { x: 0, y: 0 };
    const updatePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });

    const resize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const timer = new Timer();
    timer.connect(document);
    const showPerformanceStats =
      import.meta.env.DEV && new URLSearchParams(window.location.search).has("stats");
    let fpsFrameCount = 0;
    let fpsWindowStart = performance.now();
    const animate = () => {
      timer.update();
      const delta = Math.min(timer.getDelta(), 0.05);
      runtime.elapsed += delta;
      watercourse.update(runtime.elapsed);
      const current = propsRef.current;
      const profileId = `${current.storyNodeId}:${current.eventId ?? ""}`;
      if (profileId !== activeProfileId) {
        activeProfileId = profileId;
        activeProfile = getWorldSceneProfile(current.storyNodeId, current.eventId);
        applyProfile();
        natureWorld?.setNode(current.storyNodeId);
      }
      runtime.targetProgress = targetProgress(current.screen, current.nodeIndex, current.eventIndex, current.eventCount, content.storyline.nodes.length);
      runtime.progress = MathUtils.damp(runtime.progress, runtime.targetProgress, 1.1, delta);

      const pathT = MathUtils.clamp(runtime.progress, 0.005, 0.995);
      const point = route.getPointAt(pathT);
      const tangent = route.getTangentAt(pathT).normalize();
      const side = new Vector3(-tangent.z, 0, tangent.x).normalize();
      const eventClose = current.screen === "event" && current.eventId ? 0.9 : 0;
      const cameraPosition = point.clone().addScaledVector(tangent, -(activeProfile.cameraDistance - eventClose)).addScaledVector(side, 1.15 + pointer.x * 0.55);
      cameraPosition.y += activeProfile.cameraHeight + Math.sin(runtime.elapsed * 0.25) * 0.16 + pointer.y * -0.55;
      camera.position.lerp(cameraPosition, 1 - Math.exp(-delta * 2.2));
      const lookAt = point.clone().addScaledVector(tangent, activeProfile.lookAhead);
      lookAt.y += 0.55 + pointer.y * 0.15;
      camera.lookAt(lookAt);

      renderer.render(scene, camera);
      if (showPerformanceStats) {
        fpsFrameCount += 1;
        const now = performance.now();
        if (now - fpsWindowStart >= 2000) {
          const fps = (fpsFrameCount * 1000) / (now - fpsWindowStart);
          console.debug(`[TravelWorld] ${fps.toFixed(1)} fps · ${renderer.info.render.calls} draw calls`);
          fpsFrameCount = 0;
          fpsWindowStart = now;
        }
      }
    };
    renderer.setAnimationLoop(animate);

    return () => {
      disposed = true;
      loadedTerrainTextures.forEach((texture) => texture.dispose());
      loadedRoadTextures.forEach((texture) => texture.dispose());
      loadedSurfaceTextures.forEach((texture) => texture.dispose());
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      timer.disconnect();
      timer.dispose();
      disposeObject(scene);
      renderer.dispose();
      renderer.domElement.remove();
      runtimeRef.current = null;
    };
  }, [content]);

  return <div className="travel-world" ref={containerRef} aria-hidden="true" />;
}
