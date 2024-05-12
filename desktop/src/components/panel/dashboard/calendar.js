import Gtk from "gi://Gtk?version=3.0";

import * as Settings from "../../../util/settings.js";
import * as Containers from "./containers.js";

const settings = Settings.load();

const date = Variable(new Date());

const DAY_LABEL_PADDING = 8;
const MONTH_PADDING = 16;

const updateDate = () => {
  date.value = new Date();

  const timeUntilNextDay = new Date(
    date.value.getFullYear(),
    date.value.getMonth(),
    date.value.getDate() + 1,
    0,
    0,
    0,
    0,
  ).getTime();

  setTimeout(updateDate, timeUntilNextDay - date.value.getTime());
};

updateDate();

const CalendarDay = ({ date, modifier }) => {
  const isToday = date.getDate() === new Date().getDate();

  const containerSize = Containers.DOUBLE_ITEM_SIZE / 7 - MONTH_PADDING / 2;
  const contentSize = containerSize - DAY_LABEL_PADDING;

  const containerCss = `min-width: ${containerSize}px; min-height: ${containerSize}px;`;
  const contentCss = `min-width: ${contentSize}px; min-height: ${contentSize}px;`;

  return Widget.Box({
    className: `AvalanchePanelDashboardItemCalendarDay ${modifier} ${isToday ? "today" : ""}`,
    css: containerCss,
    vpack: "center",
    hpack: "center",
    child: Widget.Box({
      className: "AvalanchePanelDashboardItemCalendarDayContent",
      css: contentCss,
      vpack: "center",
      hpack: "center",
      child: Widget.Label({
        css: contentCss,
        halign: Gtk.Align.CENTER,
        label: date.toLocaleString("en", { day: "numeric" }),
      }),
    }),
  });
};

export const create = ({ view, config }) => {
  const Container = Containers.ContainerFromSize[config.size];

  if (config.size === 1) {
    return Container({
      className: "AvalanchePanelDashboardItemCalendar small",
      vexpand: true,
      child: Widget.Box({
        className: "AvalanchePanelDashboardItemCalendarContent",
        vertical: true,
        hexpand: true,
        vexpand: true,
        hpack: "start",
        vpack: "center",
        children: [
          Widget.Label({
            className: "AvalanchePanelDashboardItemCalendarDay",
            hpack: "start",
            label: date
              .bind()
              .as((date) =>
                date.toLocaleString("en", { weekday: "long" }).toUpperCase(),
              ),
          }),

          Widget.Label({
            className: "AvalanchePanelDashboardItemCalendarDate",
            hpack: "start",
            label: date.bind().as((date) => String(date.getDate())),
          }),
        ],
      }),
    });
  } else if (config.size === 2) {
    return Container({
      className: "AvalanchePanelDashboardItemCalendar medium",
      vexpand: true,
      child: Widget.Box({
        className: "AvalanchePanelDashboardItemCalendarContent",
        vertical: true,
        hexpand: true,
        vexpand: true,
        hpack: "start",
        vpack: "center",
        children: [
          Widget.Label({
            className: "AvalanchePanelDashboardItemCalendarDay",
            hpack: "start",
            label: date
              .bind()
              .as((date) =>
                date.toLocaleString("en", { weekday: "long" }).toUpperCase(),
              ),
          }),

          Widget.Label({
            className: "AvalanchePanelDashboardItemCalendarDate",
            hpack: "start",
            label: date
              .bind()
              .as(
                (date) =>
                  `${date.toLocaleString("en", { month: "short" })} ${date.getDate()}`,
              ),
          }),
        ],
      }),
    });
  } else {
    return Container({
      className: "AvalanchePanelDashboardItemCalendar large",
      child: Widget.Box({
        className: "AvalanchePanelDashboardItemCalendarContent",
        css: `margin-bottom: ${MONTH_PADDING}px;`,
        hpack: "fill",
        vpack: "fill",
        hexpand: true,
        vexpand: true,
        vertical: true,
        children: date.bind().as((date) => {
          // Generate rows of calendar days for the current month.
          let children = [];

          children.push(
            Widget.Box({
              className: "AvalanchePanelDashboardItemCalendarHeader",
              hpack: "center",
              vpack: "center",
              child: Widget.Label({
                className: "AvalanchePanelDashboardItemCalendarHeaderLabel",
                label: date.toLocaleString("en", {
                  month: "long",
                  year: "numeric",
                }),
              }),
            }),
          );

          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const monthStartDay = monthStart.getDay();
          const monthEndDay = monthEnd.getDate();

          const previousMonthDays = Array.from(
            { length: monthStartDay },
            (_, i) => i + 1,
          );
          const nextMonthDays = Array.from(
            {
              length:
                6 -
                new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  monthEndDay,
                ).getDay(),
            },
            (_, i) => i + 1,
          );

          const weeks = Math.ceil((monthEndDay + monthStartDay) / 7);

          for (let i = 0; i < weeks; i++) {
            const days = [];

            if (i === 0) {
              for (const day of previousMonthDays) {
                const d = new Date(date.getFullYear(), date.getMonth(), -day);

                days.push(CalendarDay({ date: d, modifier: "previous" }));
              }

              for (let day = previousMonthDays.length; day < 7; day++) {
                const d = new Date(date.getFullYear(), date.getMonth(), day);
                days.push(CalendarDay({ date: d, modifier: "current" }));
              }
            } else if (i === weeks - 1) {
              for (let day = 0; day < 7 - nextMonthDays.length; day++) {
                const d = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  i * 7 + day,
                );
                days.push(CalendarDay({ date: d, modifier: "current" }));
              }

              for (const day of nextMonthDays) {
                const d = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  day,
                );
                days.push(CalendarDay({ date: d, modifier: "next" }));
              }
            } else {
              for (let day = 0; day < 7; day++) {
                const d = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  i * 7 + day,
                );
                days.push(CalendarDay({ date: d, modifier: "current" }));
              }
            }

            children.push(
              Widget.Box({
                className: "AvalanchePanelDashboardItemCalendarWeek",
                css: `margin-left: ${MONTH_PADDING / 2}px;`,
                children: days,
                hexpand: true,
                vexpand: true,
                hpack: "center",
                vpack: "fill",
              }),
            );
          }

          return children;
        }),
      }),
    });
  }
};
