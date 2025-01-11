import { useEffect, useState } from "react";
import { getTranscript } from "../../api/client";
import styles from "./Home.module.scss";
import { ParsedTranscript, SpeakerId } from "@record-collection/server";

type SpeakerColors = Record<SpeakerId, string>;

const COLORS = [
  "red",
  "lime",
  "blue",
  "cyan",
  "magenta",
  "green",
  "maroon",
  "olive",
  "purple",
  "teal",
  "navy",
  "aqua",
  "fuchsia",
  "orange",
  "aliceblue",
  "antiquewhite",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "blanchedalmond",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dodgerblue",
  "firebrick",
  "forestgreen",
  "gainsboro",
  "gold",
  "goldenrod",
  "greenyellow",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightsteelblue",
  "lightyellow",
  "limegreen",
  "linen",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
];

export function HomePage() {
  const [parsedTranscript, setParsedTranscript] =
    useState<null | ParsedTranscript>(null);
  const [speakerColors, setSpeakerColors] = useState<SpeakerColors>({});

  useEffect(() => {
    void getTranscript("egg.txt").then(setParsedTranscript);
  }, []);

  useEffect(() => {
    const newSpeakerColors: SpeakerColors = {};
    if (!parsedTranscript?.speakers) {
      setSpeakerColors(newSpeakerColors);
      return;
    }
    const speakerIds = Object.keys(parsedTranscript.speakers);
    for (let i = 0; i < speakerIds.length; i++) {
      const speakerId = speakerIds[i];
      newSpeakerColors[speakerId] = COLORS[i];
    }
    setSpeakerColors(newSpeakerColors);
  }, [parsedTranscript]);

  return (
    <div className={styles.homeContainer}>
      {parsedTranscript?.transcript.map((transcriptItem) => {
        return (
          <>
            <span style={{ color: speakerColors[transcriptItem.speakerId] }}>
              {transcriptItem.text}
            </span>
            &nbsp; &nbsp;
          </>
        );
      })}
    </div>
  );
}
