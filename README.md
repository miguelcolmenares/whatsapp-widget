# Whatsapp widget
> Add a flotating widget to open WhatsApp

## How to use

Add this javascript at the end of your page:
```html
<script type="text/javascript">
!function(w,h,a,t,s,p){
    w.whatsapp || (
    s = h.createElement(a),
    s.src = t,
    p = h.getElementsByTagName(a)[0],
    p.parentNode.insertBefore(s, p)
    )}(window, document, "script", "https://cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget@latest/dist/js/whatsapp-widget.js");
    window.onload = function(){
        new whatsapp({
        agents:[{
            name : "Servicio al cliente",
            phone: "+57 320 2851704",
            hours: "Disponible 9am - 6pm",
            cta : "Haz clic para iniciar chat"
        }],
        time : ["9:00", "16:25"]
    })
};
</script>
```

### Options

#### name
Type: `String` 
Default: `""`

#### phone
Type: `String` 
Default: `""`

#### hours
Type: `String` 
Default: `""`

#### cta
Type: `String` 
Default: `""`

#### schedule
Type: `Array` 
Default: `[]`

## Example:
```javascript
new whatsapp({
 agents:[{
  name : "Servicio al cliente",
  phone: "+57 320 2851704",
  hours: "Disponible 9am - 6pm",
  cta  : "Haz clic para iniciar chat",
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
