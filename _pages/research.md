---
title: "Research"
permalink: /research/
excerpt: "中文研究台账与周报：Hessian 方程、曲率流、凸几何、几何分析，以及 AI 数学科研进展。"
author_profile: false
research_ledger: true
---

{% include research-ledger.html %}

<section class="weekly-archive" id="weekly-reports" lang="zh-CN">
  <h2>周报归档</h2>
  <p>台账追踪问题的长期状态；周报记录每周值得读的新工作和变化。两者互相链接。</p>
  {% assign issues = site.pages | where: "weekly_update", true | sort: "week_end" | reverse %}
  <ul class="weekly-archive-list">
  {% for issue in issues %}
    <li><a href="{{ issue.url | relative_url }}">{{ issue.week_label }}</a><span>{{ issue.excerpt }}</span></li>
  {% endfor %}
  </ul>
</section>

个人 [Publications]({{ '/' | relative_url }}#publications) 与 [Preprints]({{ '/' | relative_url }}#preprints) 见首页。
