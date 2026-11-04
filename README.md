# Whatsapp widget
[![GitHub Actions Status Badge](https://github.com/miguelcolmenares/whatsapp-widget/workflows/CodeQL/badge.svg)](https://github.com/miguelcolmenares/whatsapp-widget/actions/workflows/codeql-analysis.yml)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/miguelcolmenares/whatsapp-widget)
[![](https://data.jsdelivr.com/v1/package/gh/miguelcolmenares/whatsapp-widget/badge?style=rounded)](https://www.jsdelivr.com/package/gh/miguelcolmenares/whatsapp-widget)

> Add a floating widget to open WhatsApp

## 🎮 Demo & Configurator

Read the [documentation](https://miguelcolmenares.com/whatsapp-widget/) and use the [interactive configurator](https://miguelcolmenares.com/whatsapp-widget/configurator/) to customize and test the widget before integrating it into your website.

## Getting Started

Add this javascript at the end of your page:
```html
<script type="text/javascript">
!function(w,h,a,t,s,p){
    w.whatsapp || (
    s = h.createElement(a),
    s.src = t,
    p = h.getElementsByTagName(a)[0],
    p.parentNode.insertBefore(s, p)
)}(window, document, "script", "https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget/dist/js/whatsapp-widget.js");
window.addEventListener('load', function(){
    new whatsapp({
        title: '¿Necesitas ayuda?',
        description: 'Chatea con nosotros por Whatsapp',
        agents:[{
            name: "Servicio al cliente",
            phone: "+57 320 1234567",
            hours: "Disponible 9am - 6pm",
            cta: "Haz clic para iniciar chat",
            message: "Hola, me gustaría obtener más información",
            schedule: [
                ["9:00", "18:00"], //Sundays or Holidays
                ["9:00", "20:00"],
                ["9:00", "20:00"],
                ["9:00", "20:00"],
                ["9:00", "20:00"],
                ["9:00", "22:00"],
                ["10:00", "18:00"] // Saturday
            ]
        },{
            name: "Soporte técnico",
            phone: "+57 320 7654321",
            hours: "Disponible 9am - 6pm",
            cta: "Haz clic para iniciar chat"
        }]
    })
});
</script>
```

## Widget Options

| Argument        | Type           | Default value  |
| --------------|:--------:| ---------------------------------:|
| title         | `String` | `¿Necesitas ayuda?`               |
| description   | `String` | `Chatea con nosotros por Whatsapp` |
| agents        | `Array`  | `[]` |

## Agents Options
| Argument      | Type     | Default value  |
| --------------|:--------:| ----:|
| name          | `String` | `""` |
| phone         | `String` | `""` |
| hours         | `String` | `""` |
| cta           | `String` | `""` |
| message       | `String` | `""` |
| schedule      | `Array`  | `[]` |

## Example:
```javascript
new whatsapp({
    title: '¿Necesitas ayuda?',
    description: 'Chatea con nosotros por Whatsapp',
    agents:[{
        name : "Servicio al cliente",
        phone: "+57 320 2851704",
        hours: "Disponible 9am - 6pm",
        cta  : "Haz clic para iniciar chat",
        message: "Hola, me gustaría obtener más información",
        schedule: [
            ["9:00", "18:00"], //Sundays or Holidays
            ["9:00", "20:00"],
            ["9:00", "20:00"],
            ["9:00", "20:00"],
            ["9:00", "20:00"],
            ["9:00", "22:00"],
            ["10:00", "18:00"] // Saturday
        ]
    }]
})
```

## 📁 Project Structure

- `src/` is the source of the widget.
- `dist/` is the built widget. It is committed to `main`, because the CDN reads it from the repository. The Auto Build workflow builds it and commits it on every push to `main`.
- `docs/` holds the pages of the documentation, in Markdown.
- `site/` is the documentation site and the configurator, built with [docs-sitekit](https://github.com/miguelcolmenares/docs-sitekit) and published to GitHub Pages by the Docs workflow. The configurator is `site/src/pages/configurator.astro`.
- `e2e/` holds the Playwright tests of the site and the configurator.

### Development Workflow

1. Make changes to the source code in `src/` on a branch, and open a pull request to `main`.
2. Push to `main`: GitHub Actions builds the widget and commits the `dist/` files.
3. The CDN (jsDelivr) serves the latest release at the address without a version, so a change reaches it with the next release. See [Files and the CDN](https://miguelcolmenares.com/whatsapp-widget/docs/files-and-cdn/).

### Documentation and Configurator

The preview in the configurator runs the widget of the branch, so build the widget before the site:

```bash
npm ci && npm ci --prefix site
npm run site:build        # builds the widget, copies it into the site and builds the site
npm run test:e2e          # Playwright tests of the site and the configurator
```

To work on the site with live reload, run `npm run build && npm run site:widget` once, then `npm --prefix site run dev`.
