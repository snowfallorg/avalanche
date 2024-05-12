const hours = Variable("");
const minutes = Variable("");

const update = () => {
  let [h = "", m = ""] = Utils.exec('date +"%H %M"').split(" ");

  hours.value = h;
  minutes.value = m;
};

update();
setInterval(update, 1000);

export const create = ({ view }) => {
  const widget = Widget.Box({
    className: "AvalancheBarTime",
    vertical: true,
    children: [
      Widget.Label({
        className: "AvalancheBarTimeHours",
        label: hours.bind(),
      }),
      Widget.Label({
        className: "AvalancheBarTimeMinutes",
        label: minutes.bind(),
      }),
    ],
  });

  return widget;
};
