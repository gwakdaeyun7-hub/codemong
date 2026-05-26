import "./index.css";
import { Composition, Folder } from "remotion";
import { MyComposition } from "./Composition";
import {
  FPS,
  HEIGHT,
  Lesson1,
  TOTAL_DURATION_FRAMES,
  WIDTH,
} from "../../videos/python/lesson-1/03-composition";
import {
  Lesson2,
  TOTAL_DURATION_FRAMES as LESSON2_TOTAL_FRAMES,
} from "../../videos/python/lesson-2/03-composition";
import {
  Lesson3,
  TOTAL_DURATION_FRAMES as LESSON3_TOTAL_FRAMES,
} from "../../videos/python/lesson-3/03-composition";
import {
  Lesson4,
  TOTAL_DURATION_FRAMES as LESSON4_TOTAL_FRAMES,
} from "../../videos/python/lesson-4/03-composition";
import {
  Lesson5,
  TOTAL_DURATION_FRAMES as LESSON5_TOTAL_FRAMES,
} from "../../videos/python/lesson-5/03-composition";
import {
  Lesson6,
  TOTAL_DURATION_FRAMES as LESSON6_TOTAL_FRAMES,
} from "../../videos/python/lesson-6/03-composition";
import {
  Lesson7,
  TOTAL_DURATION_FRAMES as LESSON7_TOTAL_FRAMES,
} from "../../videos/python/lesson-7/03-composition";
import {
  Lesson8,
  TOTAL_DURATION_FRAMES as LESSON8_TOTAL_FRAMES,
} from "../../videos/python/lesson-8/03-composition";
import {
  Lesson9,
  TOTAL_DURATION_FRAMES as LESSON9_TOTAL_FRAMES,
} from "../../videos/python/lesson-9/03-composition";
import {
  Lesson10,
  TOTAL_DURATION_FRAMES as LESSON10_TOTAL_FRAMES,
} from "../../videos/python/lesson-10/03-composition";
import {
  Lesson11,
  TOTAL_DURATION_FRAMES as LESSON11_TOTAL_FRAMES,
} from "../../videos/python/lesson-11/03-composition";
import {
  Lesson12,
  TOTAL_DURATION_FRAMES as LESSON12_TOTAL_FRAMES,
} from "../../videos/python/lesson-12/03-composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Python">
        <Composition
          id="python-lesson-1"
          component={Lesson1}
          durationInFrames={TOTAL_DURATION_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-2"
          component={Lesson2}
          durationInFrames={LESSON2_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-3"
          component={Lesson3}
          durationInFrames={LESSON3_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-4"
          component={Lesson4}
          durationInFrames={LESSON4_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-5"
          component={Lesson5}
          durationInFrames={LESSON5_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-6"
          component={Lesson6}
          durationInFrames={LESSON6_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-7"
          component={Lesson7}
          durationInFrames={LESSON7_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-8"
          component={Lesson8}
          durationInFrames={LESSON8_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-9"
          component={Lesson9}
          durationInFrames={LESSON9_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-10"
          component={Lesson10}
          durationInFrames={LESSON10_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-11"
          component={Lesson11}
          durationInFrames={LESSON11_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="python-lesson-12"
          component={Lesson12}
          durationInFrames={LESSON12_TOTAL_FRAMES}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      </Folder>
      <Folder name="Sandbox">
        <Composition
          id="MyComp"
          component={MyComposition}
          durationInFrames={60}
          fps={30}
          width={1280}
          height={720}
        />
      </Folder>
    </>
  );
};
