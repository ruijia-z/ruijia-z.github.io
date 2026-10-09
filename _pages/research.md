---
title: "Research"
permalink: /research/
excerpt: "Weekly research updates on Hessian equations, geometric flows and geometric analysis."
author_profile: true
---

Weekly notes on new developments in **Hessian equations, geometric flows and geometric analysis**. Each issue explains the questions addressed, the researchers involved, the main results and the methods behind them, with links to the original papers.

{% assign issues = site.pages | where: "weekly_update", true | sort: "week_end" | reverse %}
{% for issue in issues %}
## [{{ issue.week_label }}]({{ issue.url | relative_url }})

{{ issue.excerpt }}

{% endfor %}

My [publications]({{ '/' | relative_url }}#publications) and [preprints]({{ '/' | relative_url }}#preprints) are on the homepage.
