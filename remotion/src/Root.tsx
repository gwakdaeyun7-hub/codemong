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
