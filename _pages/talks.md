---
title: "Talks"
permalink: /talks/
author_profile: true
redirect_from:
  - /talks/2022-04-01-talk-1
  - /talks/2022-04-01-talk-1.html
  - /talks/2024-04-01-talk-1
  - /talks/2024-04-01-talk-1.html
  - /talks/2024-11-01-talk-1
  - /talks/2024-11-01-talk-1.html
  - /talks/2024-11-01-talk-2
  - /talks/2024-11-01-talk-2.html
---

{% for talk in site.data.talks %}
### {{ talk.title }}

**{{ talk.date }}** · {{ talk.venue }}<br>
{{ talk.location }}

{% endfor %}
