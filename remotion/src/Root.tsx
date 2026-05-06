import "./index.css";
import { Composition, Folder } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
