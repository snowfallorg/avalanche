const Audio = await Service.import("audio");

const getVolumeName = (volume) => {
  if (volume === 0) {
    return "muted";
  }

  const step = Math.floor(volume * 2);

  switch (step) {
    default:
    case 0:
      return "low";
    case 1:
      return "medium";
    case 2:
      return "high";
  }
};

const getMicrophoneVolumeIcon = (name) => {
  switch (name) {
    default:
      return "󰍬";
    case "muted":
      return "󰍭";
  }
};

const getSpeakerVolumeIcon = (name) => {
  switch (name) {
    default:
    case "muted":
      return "󰝟";
    case "low":
      return "󰕿";
    case "medium":
      return "󰖀";
    case "high":
      return "󰕾";
  }
};

export const create = ({ view }) => {
  const microphone = Widget.EventBox({
    className: "AvalancheBarVolumeMicrophone",
    onScrollUp: () => {
      const volume = Audio.microphone.volume;

      Audio.microphone.volume = Math.min(1, volume + 0.05);
    },
    onScrollDown: () => {
      const volume = Audio.microphone.volume;

      Audio.microphone.volume = Math.min(1, volume - 0.05);
    },
    onPrimaryClick: () => {
      view.value = "volume";
    },
    onSecondaryClick: () => {
      if (!Audio.microphone.stream) {
        return;
      }

      Audio.microphone.stream["is-muted"] =
        !Audio.microphone.stream["is-muted"];
    },
    child: Widget.Label({
      className: "AvalancheBarVolumeIcon",
      label: "",
      setup: (self) => {
        self.hook(Audio, () => {
          const volume = Audio.microphone.stream?.["is-muted"]
            ? "muted"
            : getVolumeName(Audio.microphone.volume);
          const icon = getMicrophoneVolumeIcon(volume);

          self.label = icon;
          self.class_name = `AvalancheBarVolumeIcon ${volume}`;
        });
      },
    }),
  });

  const speaker = Widget.EventBox({
    className: "AvalancheBarVolumeSpeaker",
    onScrollUp: () => {
      const volume = Audio.speaker.volume;

      Audio.speaker.volume = Math.min(1, volume + 0.05);
    },
    onScrollDown: () => {
      const volume = Audio.speaker.volume;

      Audio.speaker.volume = Math.min(1, volume - 0.05);
    },
    onPrimaryClick: () => {
      view.value = "volume";
    },
    onSecondaryClick: () => {
      if (!Audio.speaker.stream) {
        return;
      }

      Audio.speaker.stream["is-muted"] = !Audio.speaker.stream["is-muted"];
    },
    child: Widget.Label({
      className: "AvalancheBarVolumeIcon",
      label: "",
      setup: (self) => {
        self.hook(Audio, () => {
          const volume = Audio.speaker.stream?.["is-muted"]
            ? "muted"
            : getVolumeName(Audio.speaker.volume);
          const icon = getSpeakerVolumeIcon(volume);

          self.label = icon;
          self.class_name = `AvalancheBarVolumeIcon ${volume}`;
        });
      },
    }),
  });

  const widget = Widget.Box({
    className: "AvalancheBarVolume",
    vertical: true,
    children: [microphone, speaker],
  });

  return widget;
};
