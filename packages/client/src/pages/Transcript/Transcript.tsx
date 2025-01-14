import { useEffect, useState } from "react";
import { getTranscript } from "../../api/client";
import styles from "./Transcript.module.scss";
import { ParsedTranscript, SpeakerId } from "@transcription/server";
import { useParams } from "react-router-dom";
import clsx from "clsx";

type SpeakerColors = Record<SpeakerId, string>;

const COLORS = [
  "red",
  "darkcyan",
  "blue",
  "darkgoldenrod",
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
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "darkblue",
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

type TranscriptionVisbilityConfig = Record<SpeakerId, { visible: boolean }>;

export function Transcript() {
  const [parsedTranscript, setParsedTranscript] =
    useState<null | ParsedTranscript>(null);
  const [speakerColors, setSpeakerColors] = useState<SpeakerColors>({});

  const [transcriptionVisibilityConfig, setTranscriptionVisibilityConfig] =
    useState<TranscriptionVisbilityConfig>({});

  const { transcriptFileName } = useParams<{ transcriptFileName: string }>();

  useEffect(() => {
    if (!transcriptFileName) {
      return;
    }
    void getTranscript(transcriptFileName).then(setParsedTranscript);
  }, [transcriptFileName]);

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

  useEffect(() => {
    if (!parsedTranscript) {
      setTranscriptionVisibilityConfig({});
      return;
    }

    setTranscriptionVisibilityConfig(
      Object.keys(
        parsedTranscript.speakers,
      ).reduce<TranscriptionVisbilityConfig>((acc, curr) => {
        acc[curr] = { visible: true };
        return acc;
      }, {}),
    );
  }, [parsedTranscript]);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        if (!parsedTranscript) return;

        const speakerIds = Object.keys(parsedTranscript.speakers);
        const newConfig = {
          ...transcriptionVisibilityConfig,
        };
        for (let i = 0; i < speakerIds.length; i++) {
          const speakerId = speakerIds[i];
          // eslint-disable-next-line no-debugger
          debugger;
          newConfig[speakerId] = {
            visible: Math.random() > 0.5,
          };
        }

        setTranscriptionVisibilityConfig(newConfig);
      },
      Math.random() * (12000 - 2000) + 4000,
    );

    return () => clearInterval(intervalId);
  }, [parsedTranscript, setTranscriptionVisibilityConfig]);

  const speakerNameClickHandler = (speakerId: SpeakerId) => {
    setTranscriptionVisibilityConfig({
      ...transcriptionVisibilityConfig,
      [speakerId]: {
        visible: !transcriptionVisibilityConfig[speakerId].visible,
      },
    });
  };

  return (
    <div className={styles.transcriptContainer}>
      <div className={styles.speakerLegend}>
        {Object.values(parsedTranscript?.speakers || {}).map(({ name, id }) => (
          <>
            <span
              style={{ color: speakerColors[id] }}
              className={clsx({
                [styles.legendItem]: true,
                [styles.selected]: transcriptionVisibilityConfig[id]?.visible,
              })}
              onClick={() => speakerNameClickHandler(id)}
            >
              {name}
            </span>
            &nbsp; &nbsp;
          </>
        ))}
      </div>

      {parsedTranscript?.transcript.map((transcriptItem) => {
        return (
          <>
            <span
              style={{
                color: speakerColors[transcriptItem.speakerId],
              }}
              className={clsx({
                [styles.transcriptionItem]: true,
                [styles.visible]:
                  transcriptionVisibilityConfig[transcriptItem.speakerId]
                    ?.visible,
              })}
            >
              {transcriptItem.text}
            </span>
            &nbsp; &nbsp;
          </>
        );
      })}
    </div>
  );
}
