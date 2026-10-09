---
title: "Sitemap"
permalink: /sitemap/
author_profile: true
---

- [Home]({{ '/' | relative_url }})
{% for item in site.data.navigation.main %}
- [{{ item.title }}]({{ item.url | relative_url }})
{% endfor %}

## Research updates

{% assign issues = site.pages | where: "weekly_update", true | sort: "week_end" | reverse %}
{% for issue in issues %}
- [{{ issue.week_label }}]({{ issue.url | relative_url }})
{% endfor %}
