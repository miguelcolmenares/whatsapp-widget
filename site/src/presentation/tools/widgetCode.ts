/**
 * The configurator of the widget, without a browser in it: what the form holds, and the integration code that
 * it makes. The page calls `buildCode` on the server for the first screen and again in the browser on every change.
 * The text it returns is the one the page produced before it was part of the site, letter by letter: the test files
 * in `e2e/fixtures` hold that text.
 */

/** One day of the schedule: the opening and the closing time, or `null` for a day off. */
export type DaySchedule = string[] | null;

export interface AgentConfig {
  name: string;
  phone: string;
  hours: string;
  cta: string;
  message: string;
  /** Seven entries from Sunday. A day that was never set is a hole, which the code writes as `null`. */
  schedule: DaySchedule[];
}

export interface WidgetConfig {
  title: string;
  description: string;
  agents: AgentConfig[];
}

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** The widget file the code asks the CDN for. */
export const WIDGET_CDN_URL = "https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget/dist/js/whatsapp-widget.js";

/** What the form starts with. */
export const DEFAULT_CONFIG: WidgetConfig = {
  title: "¿Necesitas ayuda?",
  description: "Chatea con nosotros por WhatsApp",
  agents: [
    {
      name: "Servicio al cliente",
      phone: "+57 320 1234567",
      hours: "Disponible 9am - 6pm",
      cta: "Haz clic para iniciar chat",
      message: "Hola, me gustaría obtener más información",
      schedule: [
        ["9:00", "18:00"], // Sunday
        ["9:00", "20:00"], // Monday
        ["9:00", "20:00"], // Tuesday
        ["9:00", "20:00"], // Wednesday
        ["9:00", "20:00"], // Thursday
        ["9:00", "22:00"], // Friday
        ["10:00", "18:00"], // Saturday
      ],
    },
  ],
};

/** The agent that "Add agent" appends. It has no schedule, so it is always available. */
export function newAgent(): AgentConfig {
  return {
    name: "New Agent",
    phone: "+57 320 0000000",
    hours: "Available 9am - 6pm",
    cta: "Click to start chat",
    message: "Hello, I would like to get more information",
    schedule: [],
  };
}

/** Whether the agent works on a day: both times are there. */
export function worksOn(agent: AgentConfig, day: number): boolean {
  const entry = agent.schedule?.[day];
  return Boolean(entry && entry[0] && entry[1]);
}

/** A time for a `type="time"` field, which only takes two digits for the hour: `9:00` is shown as `09:00`. */
export function timeValue(time: string): string {
  return /^\d:\d\d$/.test(time) ? `0${time}` : time;
}

const doubleQuoted = (text: string) => text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const singleQuoted = (text: string) => text.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

/** The integration code for a configuration, the text a visitor copies into a page. */
export function buildCode(config: WidgetConfig): string {
  const agentsCode = config.agents
    .map((agent) => {
      const scheduleCode =
        agent.schedule && agent.schedule.length > 0
          ? ",\n                    schedule: " +
            JSON.stringify(agent.schedule, null, 24).replace(/\n/g, "\n                    ")
          : "";
      const messageCode = agent.message
        ? ",\n                    message: \"" + doubleQuoted(agent.message) + '"'
        : "";

      return (
        "{" +
        '\n                    name: "' + doubleQuoted(agent.name) + '",' +
        '\n                    phone: "' + doubleQuoted(agent.phone) + '",' +
        '\n                    hours: "' + doubleQuoted(agent.hours) + '",' +
        '\n                    cta: "' + doubleQuoted(agent.cta) + '"' + messageCode + scheduleCode +
        "\n                }"
      );
    })
    .join(",\n                ");

  return (
    '<script type="text/javascript">\n' +
    "    !function (w, h, a, t, s, p) {\n" +
    "        w.whatsapp || (\n" +
    "            s = h.createElement(a),\n" +
    "            s.src = t,\n" +
    "            p = h.getElementsByTagName(a)[0],\n" +
    "            p.parentNode.insertBefore(s, p)\n" +
    "        )\n" +
    '    }(window, document, "script", "' + WIDGET_CDN_URL + '");\n' +
    "    \n" +
    "    window.addEventListener('load', function () {\n" +
    "        new whatsapp({\n" +
    "            title: '" + singleQuoted(config.title) + "',\n" +
    "            description: '" + singleQuoted(config.description) + "',\n" +
    "            agents: [\n" +
    "                " + agentsCode + "\n" +
    "            ]\n" +
    "        });\n" +
    "    });\n" +
    "</script>"
  );
}
