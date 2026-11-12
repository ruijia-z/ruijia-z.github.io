---
title: "Research"
permalink: /research/
excerpt: "中文研究周报：Hessian 方程、曲率流、凸几何、几何分析，以及 AI 数学科研进展。"
author_profile: true
research_ledger: true
---

<section class="weekly-archive" id="weekly-reports" lang="zh-CN">
  <h2>周报归档</h2>
  <p>按周选读几何分析的新论文，跟踪数学问题的进展和 AI 科研动态。最新一期在前。</p>
  {% assign issues = site.pages | where: "weekly_update", true | sort: "week_end" | reverse %}
  <ul class="weekly-archive-list">
  {% for issue in issues %}
    <li><a href="{{ issue.url | relative_url }}">{{ issue.week_label }}</a><span>{{ issue.excerpt }}</span></li>
  {% endfor %}
  </ul>
</section>
