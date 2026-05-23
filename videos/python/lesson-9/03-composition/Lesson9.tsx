/**
 * Lesson 9 — 함수 (`def` / 매개변수 / `return` / 지역·전역 변수)
 *
 * Main composition. Each scene is wrapped in a <Sequence> with timing from
 * `timing.ts` (Stage 3 — real values wired from 02-audio/timestamps.json).
 *
 * Audio: voiceover.mp3 mounted at the AbsoluteFill root (NOT inside any
 * <Sequence>, otherwise it would restart per-scene). Composition-relative
 * playback aligns 1:1 with the scene boundaries computed via the
 * adjacent-boundary rule in timing.ts.
 *
 * Captions: NONE. Per project policy, no SRT/VTT, no @remotion/captions, no
 * burn-in. Lower-third / scene-design text cards inside each Scene component
 * are visual design elements, not captions.
 *
 * No CSS transitions / Tailwind animate-* — all animation lives inside scenes
 * via useCurrentFrame() + interpolate() (per remotion-best-practices).
 */

import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { Scene05 } from "./scenes/Scene05";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10 } from "./scenes/Scene10";
import { Scene11 } from "./scenes/Scene11";
import { SCENES, sceneOf } from "./timing";

const sceneComponents = {
  "scene-01": Scene01,
  "scene-02": Scene02,
  "scene-03": Scene03,
  "scene-04": Scene04,
  "scene-05": Scene05,
  "scene-06": Scene06,
  "scene-07": Scene07,
  "scene-08": Scene08,
  "scene-09": Scene09,
  "scene-10": Scene10,
  "scene-11": Scene11,
} as const;

export const Lesson9: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#fafafa" }}>
      {SCENES.map((scene) => {
        const Component = sceneComponents[scene.id];
        const timing = sceneOf(scene.id);
        return (
          <Sequence
            key={scene.id}
            from={timing.from}
            durationInFrames={timing.durationInFrames}
            premountFor={30}
            name={scene.id}
          >
            <Component />
          </Sequence>
        );
      })}
      <Audio src={staticFile("python-lesson-9/voiceover.mp3")} />
    </AbsoluteFill>
  );
};
