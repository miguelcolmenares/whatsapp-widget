# whatsapp-widget

## Agents:

list of params required to add a new agent:

**name**: string

**phone**: string

**hours**: string

**cta**: string

**schedule**: array

## Example:
```
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
