---
title: Getting started
description: "Add one script to your page and the widget draws a floating WhatsApp button."
order: 1
---

# Getting started

The widget is one script. Add it at the end of your page and it draws a floating WhatsApp button. A click on the button opens a panel with a title, a description and one entry for each agent who is available.

Build the code for your page with the [configurator](https://miguelcolmenares.com/whatsapp-widget/configurator/), or copy this one and change the texts.

## The code

Add this JavaScript at the end of your page:

```html
<script type="text/javascript">
  !(function (w, h, a, t, s, p) {
    w.whatsapp ||
      ((s = h.createElement(a)),
      (s.src = t),
      (p = h.getElementsByTagName(a)[0]),
      p.parentNode.insertBefore(s, p));
  })(
    window,
    document,
    "script",
    "https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget/dist/js/whatsapp-widget.js",
  );
  window.addEventListener("load", function () {
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
        {
          name: "Soporte técnico",
          phone: "+57 320 7654321",
          hours: "Disponible 9am - 6pm",
          cta: "Haz clic para iniciar chat",
        },
      ],
    });
  });
</script>
```

The first function adds the widget file to the page, unless `window.whatsapp` already exists. When the page has loaded, `new whatsapp({ ... })` creates the widget with your options.

## What a visitor sees

- A floating button. The `title` is its tooltip.
- After a click, a panel with the `title`, the `description` and one entry for each agent who is available now. An agent entry shows the `name`, the `hours` text and the `cta` text.
- A click on an agent opens `https://wa.me/` with the phone number, in a new tab. If the agent has a `message`, the chat starts with that text.

If no agent is available at that moment, the widget is not drawn at all. See [Agents and schedules](agents-and-schedules.md).

## Next

- [Options](options.md) lists every option of the widget and of an agent.
- [Agents and schedules](agents-and-schedules.md) explains the `schedule` option.
- [Files and the CDN](files-and-cdn.md) says where the files come from.
