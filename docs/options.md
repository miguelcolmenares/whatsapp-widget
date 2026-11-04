---
title: Options
description: "Every option of the widget and of an agent, with its type and what it does."
order: 2
---

# Options

`new whatsapp(options)` takes the options of the widget, and `agents` takes a list of agents. Text in every option has its HTML tags removed before it is shown.

## Widget options

| Option        | Type     | Default                            | What it does                                                           |
| ------------- | -------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `title`       | `String` | `¿Necesitas ayuda?`                | The heading of the panel, and the tooltip of the button.               |
| `description` | `String` | `Chatea con nosotros por Whatsapp` | The line under the heading.                                            |
| `agents`      | `Array`  | `[]`                               | The people the visitor can write to. With no agents nothing is drawn.  |

## Agent options

| Option     | Type     | What it does                                                                                               |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `name`     | `String` | The name shown for the agent, and part of the tooltip of its entry.                                        |
| `phone`    | `String` | The WhatsApp number. The spaces and the `+` are removed to build the chat address, so `+57 320 1234567` works. |
| `hours`    | `String` | A text shown under the name, such as `Disponible 9am - 6pm`. It is only a label, see below.                |
| `cta`      | `String` | The call to action, such as `Haz clic para iniciar chat`.                                                  |
| `message`  | `String` | The text the chat starts with. Leave it out and the chat opens empty.                                      |
| `schedule` | `Array`  | The days and times when the agent is available. Leave it out and the agent is always available.            |

`hours` does not decide when an agent is available. `schedule` does. Write both, so that what the visitor reads matches what the widget does.

## Example

```javascript
new whatsapp({
  title: "¿Necesitas ayuda?",
  description: "Chatea con nosotros por Whatsapp",
  agents: [
    {
      name: "Servicio al cliente",
      phone: "+57 320 1234567",
      hours: "Disponible 9am - 6pm",
      cta: "Haz clic para iniciar chat",
      message: "Hola, me gustaría obtener más información",
      schedule: [
        ["9:00", "18:00"], // Sunday
        ["9:00", "20:00"],
        ["9:00", "20:00"],
        ["9:00", "20:00"],
        ["9:00", "20:00"],
        ["9:00", "22:00"],
        ["10:00", "18:00"], // Saturday
      ],
    },
  ],
});
```

## Analytics

If the page has `window.dataLayer`, the widget pushes an event to it when the button is clicked and when an agent is clicked. The event is `ga_event`, with the category `Widget WhatsApp` and the action `Click WhatsApp`. The label is `Click Icono` for the button and the name of the agent for an agent. A page without `window.dataLayer` is not affected.
