# Third-party nature assets

The following static GLTF assets are from [Poly Haven](https://polyhaven.com/), licensed under CC0 1.0:

- `fir_sapling`
- `pine_sapling_small`
- `shrub_01`
- `rock_07`
- `boulder_01`
- `island_tree_02`
- `fern_02`
- `shrub_sorrel_01`
- `grass_bermuda_01`

Each asset is stored with its local `.gltf`, `.bin`, and referenced 1K textures. The runtime loads them through Three.js `GLTFLoader`, normalizes their bounds, and places cloned instances through the data-driven definitions in `web/src/scene/world/assets.ts`.
