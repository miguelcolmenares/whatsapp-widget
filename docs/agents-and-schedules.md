---
title: Agents and schedules
description: "How the schedule decides when an agent is shown: the days, the times, a day off and the clock that is used."
order: 3
---

# Agents and schedules

An agent is shown only while it is available. The `schedule` option says when that is.

## The schedule

`schedule` is a list of seven entries, one for each day of the week, and the first one is **Sunday**. This is the numbering of `Date.getDay()` in JavaScript: Sunday is 0, Monday is 1, and Saturday is 6.

Each entry is the opening and the closing time of that day, as two texts in 24 hour time:

```javascript
schedule: [
  ["9:00", "18:00"], // Sunday
  ["9:00", "20:00"], // Monday
  ["9:00", "20:00"], // Tuesday
  ["9:00", "20:00"], // Wednesday
  ["9:00", "20:00"], // Thursday
  ["9:00", "22:00"], // Friday
  ["10:00", "18:00"], // Saturday
];
```

The agent is available from the opening time to the closing time, both included.

## A day off

Use `null` for a day when the agent does not work:

```javascript
schedule: [
  null, // Sunday
  ["9:00", "18:00"],
  ["9:00", "18:00"],
  ["9:00", "18:00"],
  ["9:00", "18:00"],
  ["9:00", "18:00"],
  null, // Saturday
];
```

An entry that is missing, or that has fewer than two times, is also a day off.

## No schedule

An agent with no `schedule`, or with an empty one, is always available.

## Which clock

The widget reads the date and the time of the **visitor's** device, not of the server and not of the time zone of the business. A visitor in another time zone sees the agents that are available by their own clock.

## When it is decided

The widget checks the agents when it is created, and again when it draws the list. If at that moment no agent is available, the widget is not drawn. It does not look at the clock after that: an agent who opens later appears the next time the page is loaded, and an agent who closes stays in the list of a page that is already open.
