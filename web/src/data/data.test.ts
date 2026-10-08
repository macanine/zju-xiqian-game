import { describe, expect, it } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { CONTENT_BUNDLE, SITES_DATA, TIMELINE_DATA, STORYLINE_DATA } from "./index";

const projectRoot = resolve(__dirname, "../../../");

describe("Modular Data Engineering & Integrity Verification", () => {
  it("bundles sites, timeline, and storyline cleanly without runtime overhead", () => {
    expect(CONTENT_BUNDLE.sites.sites.length).toBe(7);
    expect(CONTENT_BUNDLE.sites.galleries.length).toBe(1);
    expect(CONTENT_BUNDLE.timeline.timeline.length).toBe(24);
    expect(CONTENT_BUNDLE.storyline.nodes.length).toBe(8);
  });

  it("ensures timeline dates are chronologically ascending", () => {
    const dates = TIMELINE_DATA.timeline.map((entry) => entry.date);
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i] <= dates[i + 1]).toBe(true);
    }
  });

  it("ensures timeline stageIds match existing site ids or null for honor", () => {
    const siteIds = new Set(SITES_DATA.sites.map((s) => s.id));
    for (const entry of TIMELINE_DATA.timeline) {
      if (entry.stageId !== null) {
        expect(siteIds.has(entry.stageId)).toBe(true);
      }
    }
  });

  it("ensures storyline nodes have contiguous order 0 through 7", () => {
    STORYLINE_DATA.nodes.forEach((node, index) => {
      expect(node.order).toBe(index);
    });
  });

  it("strictly enforces allowed resource effect keys", () => {
    const allowedKeys = new Set(["supplies", "ration", "health", "morale"]);

    // Check location events
    for (const node of STORYLINE_DATA.nodes) {
      for (const event of node.locationEvents ?? []) {
        for (const choice of event.choices) {
          if (choice.effects) {
            for (const key of Object.keys(choice.effects)) {
              expect(allowedKeys.has(key)).toBe(true);
            }
          }
          if (choice.fallbackEffects) {
            for (const key of Object.keys(choice.fallbackEffects)) {
              expect(allowedKeys.has(key)).toBe(true);
            }
          }
        }
      }
    }

    // Check random events
    for (const event of STORYLINE_DATA.randomEvents) {
      for (const choice of event.choices) {
        if (choice.effects) {
          for (const key of Object.keys(choice.effects)) {
            expect(allowedKeys.has(key)).toBe(true);
          }
        }
        if (choice.fallbackEffects) {
          for (const key of Object.keys(choice.fallbackEffects)) {
            expect(allowedKeys.has(key)).toBe(true);
          }
        }
      }
      for (const outcome of event.autoOutcomes ?? []) {
        for (const key of Object.keys(outcome.effects)) {
          expect(allowedKeys.has(key)).toBe(true);
        }
      }
    }
  });

  it("recycles all flags without dead flags", () => {
    const producedFlags = new Set<string>();

    for (const node of STORYLINE_DATA.nodes) {
      for (const event of node.locationEvents ?? []) {
        for (const choice of event.choices) {
          if (choice.flag) {
            producedFlags.add(choice.flag);
          }
        }
      }
    }

    // Handled in epilogue fragments or cards
    const fragmentFlags = new Set(
      STORYLINE_DATA.endings.epilogueFragments.fragments.map((f) => f.flag),
    );

    for (const flag of producedFlags) {
      expect(fragmentFlags.has(flag)).toBe(true);
    }

    // Check exact required historical flags
    expect(producedFlags.has("doubt")).toBe(true);
    expect(producedFlags.has("siku")).toBe(true);
    expect(producedFlags.has("dike")).toBe(true);
    expect(producedFlags.has("memorial")).toBe(true);
    expect(producedFlags.has("debate")).toBe(true);
    expect(producedFlags.has("anthem")).toBe(true);
    expect(producedFlags.has("cambridge")).toBe(true);
  });

  it("verifies all referenced images physically exist in images/", () => {
    const referencedImages = new Set<string>();

    // From sites
    for (const site of SITES_DATA.sites) {
      site.images?.forEach((img) => referencedImages.add(img));
    }
    for (const gallery of SITES_DATA.galleries) {
      gallery.images.forEach((img) => referencedImages.add(img.path));
    }

    // From storyline
    for (const node of STORYLINE_DATA.nodes) {
      node.images.forEach((img) => referencedImages.add(img));
      if (node.backgroundHint) referencedImages.add(node.backgroundHint);
    }

    expect(referencedImages.size).toBe(25);

    for (const imgPath of referencedImages) {
      const fullPath = resolve(projectRoot, imgPath);
      expect(existsSync(fullPath)).toBe(true);
    }

    // Verify images/ folder has no orphaned unreferenced images
    const imagesDir = resolve(projectRoot, "images");
    const onDiskFiles = readdirSync(imagesDir).filter((f) => !f.startsWith("."));
    for (const file of onDiskFiles) {
      expect(referencedImages.has(`images/${file}`)).toBe(true);
    }
  });
});
