/**
 * Lesson 12 — 디버깅 & AI 활용 (오류 분석 / print 추적 / 코드 개선 / AI 조수)
 *
 * Main composition. 각 scene 은 `timing.ts` 의 실측 타이밍(02-audio/timestamps.json
 * 에서 wire)으로 <Sequence> 에 배치된다.
 *
 * Audio: voiceover.mp3 를 AbsoluteFill root (Sequence 밖) 에 마운트. Sequence
 *   안에 두면 scene 마다 0부터 재시작하므로 안 된다. composition-relative 재생이
 *   timing.ts 의 adjacent-boundary scene 경계와 1:1 정렬된다. lesson-11 패턴 답습
 *   (`Audio` 는 remotion 코어에서 import — 검증된 렌더 경로).
 *
 * Captions: NONE. Per project policy — no SRT/VTT, no @remotion/captions, no
 * burn-in. Lower-third / scene-design text cards (및 12강의 Traceback·에러 텍스트
 * 화면 노출) 는 시각 디자인 요소이지 자막이 아니다.
 *
 * No CSS transitions / Tailwind animate-* — 모든 애니메이션은 scene 안에서
 * useCurrentFrame() + interpolate() 로 (per remotion-best-practices).
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
} as const;

export const Lesson12: React.FC = () => {
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
      <Audio src={staticFile("python-lesson-12/voiceover.mp3")} />
    </AbsoluteFill>
  );
};
