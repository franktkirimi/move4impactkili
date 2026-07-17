import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { mkdir, writeFile } from "node:fs/promises";

globalThis.FileReader = class FileReader {
  result = null;
  onloadend = null;
  onerror = null;

  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    }).catch((error) => this.onerror?.(error));
  }
};

const root = new THREE.Group();
root.name = "EdenArchitecturalAssets";

const materials = {
  timber: new THREE.MeshStandardMaterial({ color: 0x76513a, roughness: 0.64, metalness: 0.02 }),
  paleTimber: new THREE.MeshStandardMaterial({ color: 0xb68b61, roughness: 0.7, metalness: 0.01 }),
  fabric: new THREE.MeshStandardMaterial({ color: 0xcabda7, roughness: 0.95, metalness: 0 }),
  linen: new THREE.MeshStandardMaterial({ color: 0xf0e9dc, roughness: 0.94, metalness: 0 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x585d5a, roughness: 0.28, metalness: 0.82 }),
  appliance: new THREE.MeshStandardMaterial({ color: 0xddd8ce, roughness: 0.3, metalness: 0.25 }),
  solar: new THREE.MeshPhysicalMaterial({ color: 0x132633, roughness: 0.18, metalness: 0.55, clearcoat: 0.7 }),
  tank: new THREE.MeshStandardMaterial({ color: 0xc6b992, roughness: 0.56, metalness: 0.08 }),
  charcoal: new THREE.MeshStandardMaterial({ color: 0x2f302d, roughness: 0.52, metalness: 0.12 }),
};

function box(name, size, position, material, parent, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(name, radius, height, position, material, parent, segments = 32) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

const bedroom = new THREE.Group();
bedroom.name = "Bedroom";
bedroom.userData = { hotspot: "bedroom" };
for (const [index, x] of [-3.05, -1.55].entries()) {
  box(`BedroomBedFrame${index + 1}`, [1.2, 0.25, 2.15], [x, 0.58, -1.85], materials.timber, bedroom);
  box(`BedroomMattress${index + 1}`, [1.14, 0.22, 2.02], [x, 0.82, -1.85], materials.linen, bedroom);
  box(`BedroomPillow${index + 1}`, [0.76, 0.16, 0.42], [x, 1.01, -2.55], materials.fabric, bedroom);
}
box("BedroomCupboard", [1.15, 2.1, 0.55], [-3.25, 1.36, -3.05], materials.paleTimber, bedroom);
root.add(bedroom);

const kitchen = new THREE.Group();
kitchen.name = "Kitchen";
kitchen.userData = { hotspot: "kitchen" };
box("KitchenBaseUnits", [3.05, 0.85, 0.65], [2.65, 0.82, -2.85], materials.paleTimber, kitchen);
box("KitchenWorktop", [3.15, 0.12, 0.75], [2.65, 1.29, -2.85], materials.charcoal, kitchen);
box("KitchenTallUnit", [0.75, 2.25, 0.7], [3.95, 1.42, -2.8], materials.paleTimber, kitchen);
box("KitchenCooker", [0.72, 0.86, 0.67], [2.35, 0.84, -2.8], materials.appliance, kitchen);
root.add(kitchen);

const dining = new THREE.Group();
dining.name = "Dining";
dining.userData = { hotspot: "kitchen" };
box("DiningTableTop", [2.35, 0.14, 1.15], [1.3, 1.15, 1.55], materials.timber, dining);
for (const x of [0.4, 2.2]) for (const z of [1.15, 1.95]) box("DiningTableLeg", [0.13, 0.9, 0.13], [x, 0.68, z], materials.timber, dining);
for (const [index, x, z] of [[0, 0.15, 1.55], [1, 2.45, 1.55], [2, 1.3, 0.45], [3, 1.3, 2.65]]) {
  box(`DiningChairSeat${index + 1}`, [0.7, 0.12, 0.7], [x, 0.72, z], materials.paleTimber, dining);
  box(`DiningChairBack${index + 1}`, [0.7, 0.85, 0.12], [x, 1.12, z + (index < 2 ? 0.25 : 0)], materials.paleTimber, dining);
}
root.add(dining);

const solar = new THREE.Group();
solar.name = "SolarPanels";
solar.userData = { hotspot: "solar" };
for (let index = 0; index < 6; index += 1) {
  const x = -2.25 + (index % 3) * 1.55;
  const z = -0.7 + Math.floor(index / 3) * 1.45;
  box(`SolarPanel${index + 1}`, [1.38, 0.07, 1.16], [x, 4.36, z], materials.solar, solar, [-0.1, 0, 0.07]);
}
root.add(solar);

const water = new THREE.Group();
water.name = "WaterTank";
water.userData = { hotspot: "water" };
cylinder("WaterTankBody", 0.9, 2.2, [-6.3, 2.75, -2.8], materials.tank, water, 48);
for (const x of [-6.9, -5.7]) for (const z of [-3.3, -2.3]) box("WaterTankStand", [0.12, 2.0, 0.12], [x, 1.0, z], materials.metal, water);
box("WaterTankPlatform", [2.0, 0.12, 2.0], [-6.3, 1.98, -2.8], materials.metal, water);
root.add(water);

const landscape = new THREE.Group();
landscape.name = "LandscapeFurniture";
landscape.userData = { hotspot: "landscape" };
for (const [index, x] of [-5.2, 5.6].entries()) {
  box(`BenchSeat${index + 1}`, [2.25, 0.16, 0.55], [x, 0.65, 3.7], materials.timber, landscape);
  box(`BenchBack${index + 1}`, [2.25, 0.72, 0.14], [x, 1.0, 3.94], materials.timber, landscape, [-0.12, 0, 0]);
  box(`BenchLegA${index + 1}`, [0.13, 0.6, 0.4], [x - 0.75, 0.32, 3.7], materials.metal, landscape);
  box(`BenchLegB${index + 1}`, [0.13, 0.6, 0.4], [x + 0.75, 0.32, 3.7], materials.metal, landscape);
}
root.add(landscape);

const exporter = new GLTFExporter();
const output = await new Promise((resolve, reject) => {
  exporter.parse(root, resolve, reject, { binary: true, onlyVisible: true });
});

await mkdir(new URL("../public/models/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/models/eden-architectural-assets.glb", import.meta.url), Buffer.from(output));
