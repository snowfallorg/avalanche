import * as Settings from "../../../util/settings.js";
import * as Containers from "./containers.js";

const settings = Settings.load();

export const CpuUsage = Variable(0);
export const MemoryUsage = Variable(0);
export const DiskUsage = Variable(0);
export const NetworkUsage = Variable(0);
export const NetworkBandwidthRX = Variable(0);
export const NetworkBandwidthTX = Variable(0);

const updateCpuUsage = async () => {
  const usage = await Utils.execAsync(
    `bash -c "mpstat 1 3 | awk '$3 ~ /CPU/ { for(i=1;i<=NF;i++) { if ($i ~ /%idle/) field=i } } $3 ~ /all/ { print 100 - $field }'"`,
  );

  const results = usage.split("\n").map((x) => parseFloat(x.trim()));

  const sum = results.reduce((acc, val) => acc + val, 0);

  CpuUsage.value = sum / results.length;
};

const updateMemoryUsage = async () => {
  const usage = await Utils.execAsync(
    `bash -c "free -m | grep -oP '\\d+' | head -n2"`,
  );

  const [total, used] = usage.split("\n").map((x) => parseFloat(x.trim()));

  MemoryUsage.value = (used / total) * 100;
};

const updateDiskUsage = async () => {
  const usage = await Utils.execAsync(
    `bash -c "df -lP /home | tail -n1 | awk '{ print $2; print $3; }'"`,
  );

  const [total, used] = usage.split("\n").map((x) => parseFloat(x.trim()));

  DiskUsage.value = (used / total) * 100;
};

let lastIfstat = null;

const updateNetworkUsage = async () => {
  // NOTE: We can't use the `--json` output here due to `ifstat` ignoring history which
  // means we get the full count of bytes rather than a delta. It's faster for us to just
  // pipe things through awk instead.
  const usage = await Utils.execAsync(`bash -c "ifstat --json"`);

  let data;

  try {
    const json = JSON.parse(usage);

    const key = Object.keys(json)[0];

    if (!key) {
      throw new Error("No data found in ifstat output");
    }

    data = json[key];
  } catch (error) {
    console.error("Failed to parse ifstat output");
    console.error(error);
    return;
  }

  if (lastIfstat == null) {
    lastIfstat = data;
    return;
  }

  let rx = 0;
  let tx = 0;

  for (const [name, iface] of Object.entries(data)) {
    if (!lastIfstat[name]) {
      continue;
    }

    rx += Math.max(0, iface.rx_bytes - lastIfstat[name].rx_bytes);
    tx += Math.max(0, iface.tx_bytes - lastIfstat[name].tx_bytes);
  }

  lastIfstat = data;

  NetworkBandwidthRX.value = rx;
  NetworkBandwidthTX.value = tx;

  NetworkUsage.value =
    Math.min(1, rx / settings.panel.dashboard.stats.network.max) * 100;
};

setInterval(async () => {
  Promise.all([
    updateCpuUsage(),
    updateMemoryUsage(),
    updateDiskUsage(),
    updateNetworkUsage(),
  ]);
}, 5_000);

updateCpuUsage();
updateMemoryUsage();
updateDiskUsage();
updateNetworkUsage();

const OverlaySizer = () => {
  return Widget.Box({
    className: "AvalanchePanelDashboardItemStatsCircularProgress",
  });
};

const Stat = ({ name, icon, binding }) => {
  return Widget.Overlay({
    child: OverlaySizer(),
    overlays: [
      Widget.CircularProgress({
        hexpand: true,
        hpack: "center",
        className: "AvalanchePanelDashboardItemStatsCircularProgress ghost",
        rounded: true,
        startAt: 0.4,
        endAt: 0.1,
        value: 1,
      }),
      Widget.CircularProgress({
        hexpand: true,
        hpack: "center",
        className: binding
          .bind()
          .as(
            (value) =>
              `AvalanchePanelDashboardItemStatsCircularProgress ${name} ${value > 80 ? "high" : ""}`,
          ),
        rounded: true,
        startAt: 0.4,
        endAt: 0.1,
        value: binding.bind().as((value) => value / 100),
        child: Widget.Label({
          hpack: "center",
          vpack: "center",
          className: `AvalanchePanelDashboardItemStatsCircularProgressLabel ${name}`,
          label: icon,
        }),
      }),
    ],
  });
};

export const create = ({ view, config }) => {
  const cpu = Stat({
    name: "cpu",
    icon: "󰻠",
    binding: CpuUsage,
  });
  const memory = Stat({
    name: "memory",
    icon: "󰍛",
    binding: MemoryUsage,
  });
  const disk = Stat({
    name: "disk",
    icon: "󰋊",
    binding: DiskUsage,
  });
  const network = Stat({
    name: "network",
    icon: "󰌘",
    binding: NetworkUsage,
  });

  const Container = Containers.ContainerFromSize[config.size];

  if (config.size === 1) {
    return Container({
      className: "AvalanchePanelDashboardItemStats small",
      child: Widget.Box({
        className: "AvalanchePanelDashboardItemStatsContent",
        vertical: true,
        vpack: "center",
        hpack: "center",
        children: [
          Widget.Box({
            vexpand: true,
            hexpand: true,
            vpack: "center",
            hpack: "center",
            spacing: 16,
            children: [cpu, memory],
          }),
          Widget.Box({
            vexpand: true,
            hexpand: true,
            vpack: "center",
            hpack: "center",
            spacing: 16,
            children: [disk, network],
          }),
        ],
      }),
    });
  } else {
    return Container({
      className: "AvalanchePanelDashboardItemStats",
      child: Widget.Box({
        className: "AvalanchePanelDashboardItemStatsContent",
        children: [cpu, memory, disk, network],
      }),
    });
  }
};
