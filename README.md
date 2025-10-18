# WhatsApp Widget

[![GitHub Actions Status Badge](https://github.com/miguelcolmenares/whatsapp-widget/workflows/CodeQL/badge.svg)](https://github.com/miguelcolmenares/whatsapp-widget/actions/workflows/codeql-analysis.yml)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/miguelcolmenares/whatsapp-widget)
[![](https://data.jsdelivr.com/v1/package/gh/miguelcolmenares/whatsapp-widget/badge?style=rounded)](https://www.jsdelivr.com/package/gh/miguelcolmenares/whatsapp-widget)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

> Add a floating widget to open WhatsApp with multi-agent support and business hours scheduling

## 📚 Documentation

- **[Getting Started](#getting-started)** - Quick start guide
- **[Configuration Options](#widget-options)** - All available options
- **[Contributing](CONTRIBUTING.md)** - How to contribute to the project
- **[Roadmap](ROADMAP.md)** - Development plans for 2025
- **[Changelog](CHANGELOG.md)** - Version history and changes
- **[TODO](TODO.md)** - Planned improvements and features
- **[Quick Wins](QUICK_WINS.md)** - High-impact, quick improvements

## ✨ Features

- 🚀 **Easy Integration** - Simple script tag, no dependencies
- 👥 **Multi-Agent Support** - Multiple support agents with individual configurations
- ⏰ **Business Hours** - Automatic agent availability based on schedule
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Customizable** - Customize title, description, and agent details
- 📊 **Google Analytics** - Built-in tracking support
- 🔒 **Secure** - Sanitized inputs to prevent XSS attacks
- ⚡ **Lightweight** - Only 6.18 KiB minified

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

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

```bash
# Clone the repository
git clone https://github.com/miguelcolmenares/whatsapp-widget.git
cd whatsapp-widget

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Lint and format
npm run lint
npm run prettier
```

### Ways to Contribute

- 🐛 [Report bugs](https://github.com/miguelcolmenares/whatsapp-widget/issues/new?template=bug_report.md)
- 💡 [Suggest features](https://github.com/miguelcolmenares/whatsapp-widget/issues/new?template=feature_request.md)
- 📝 Improve documentation
- 🧪 Add tests
- 🎨 Improve design
- ✨ Add new features

Check out our [TODO.md](TODO.md) and [QUICK_WINS.md](QUICK_WINS.md) for ideas on what to work on!

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Miguel Colmenares**
- Email: me@miguelcolmenares.com
- GitHub: [@miguelcolmenares](https://github.com/miguelcolmenares)

## 🙏 Acknowledgments

Thanks to all contributors who have helped make this project better!

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/miguelcolmenares/whatsapp-widget?style=social)
![GitHub forks](https://img.shields.io/github/forks/miguelcolmenares/whatsapp-widget?style=social)
![GitHub issues](https://img.shields.io/github/issues/miguelcolmenares/whatsapp-widget)
![GitHub pull requests](https://img.shields.io/github/issues-pr/miguelcolmenares/whatsapp-widget)
