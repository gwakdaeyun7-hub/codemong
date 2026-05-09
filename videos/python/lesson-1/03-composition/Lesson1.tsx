/**
 * Lesson 1 — 파이썬 개요 & 개발환경
 *
 * Main composition. Each scene is wrapped in a <Sequence> with timing from
 * `timing.ts` (frame boundaries derived from 02-audio/timestamps.json).
 *
 * Wiring (step 3):
 *   • <Audio> mounted ONCE at the composition root (never inside Sequences,
 *     otherwise it would restart per-scene).
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
import { Scene12 } from "./scenes/Scene12";
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
  "scene-12": Scene12,
} as const;

export const Lesson1: React.FC = () => {
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
      {/*
        Single Audio mount — composition-relative playback. Putting <Audio>
        inside a <Sequence> would restart it on each scene boundary.
      */}
      <Audio src={staticFile("python-lesson-1/voiceover.mp3")} />
    </AbsoluteFill>
  );
};
