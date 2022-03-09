# Whatsapp widget
[![GitHub Actions Status Badge](https://github.com/miguelcolmenares/whatsapp-widget/workflows/CodeQL/badge.svg)](https://github.com/miguelcolmenares/whatsapp-widget/actions/workflows/codeql-analysis.yml)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/miguelcolmenares/whatsapp-widget)
[![](https://data.jsdelivr.com/v1/package/gh/miguelcolmenares/whatsapp-widget/badge?style=rounded)](https://www.jsdelivr.com/package/gh/miguelcolmenares/whatsapp-widget)

> Add a floating widget to open WhatsApp

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
| ----------|:--------:| ----:|
| name      | `String` | `""` |
| phone     | `String` | `""` |
| hours     | `String` | `""` |
| cta       | `String` | `""` |
| message   | `String` | `""` |
| schedule  | `Array`  | `[]` |

## Example:
```javascript
new whatsapp({
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
