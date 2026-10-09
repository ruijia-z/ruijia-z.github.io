# Ruijia Zhang's academic website

Website: https://ruijia-z.github.io/

This site uses Jekyll and AcademicPages (based on Minimal Mistakes). See `LICENSE` for the theme license.

## Content

- `_pages/main.md`: introduction, education, employment, recent news, publications, preprints and research projects.
- `_pages/research.md`: weekly research update index, generated from issue metadata.
- `_pages/research-updates/`: individual weekly issues, each with a permanent URL.
- `_pages/teaching.md`: teaching experience.
- `_pages/talks.md` and `_data/talks.yml`: talks, maintained in one list.
- `_pages/contact.md`: institutional mailing address.
- `_config.yml`: site metadata and the single source for the email address.
- `_data/navigation.yml`: navigation links.

The former About Me page redirects to the homepage. Former individual talk URLs redirect to the talks list. Archived documents in `_archive/` are excluded from publication; the older PDF CV is retained there as a historical record, not as current biographical information.

Page titles remain in metadata for browser tabs and search engines. Visible opening titles are disabled by the `hide_page_title: true` page default in `_config.yml`; set it to `false` in a page's front matter to display its title.

## Add a weekly research update

Create `_pages/research-updates/YYYYMMDD-YYYYMMDD.md` with the following front matter, substituting the issue's dates and description:

```yaml
---
title: "Research update: 2–9 October 2026"
permalink: /research/20261002-20261009/
weekly_update: true
week_start: "2026-10-02"
week_end: "2026-10-09"
week_label: "20261002–20261009"
excerpt: "A short, plain-text description of the issue."
author_profile: true
---
```

The Research index and sitemap discover the page automatically and sort issues newest first. Keep date strings quoted and `weekly_update` a boolean. Use a unique permalink for every issue.

For each item, verify the submission or revision date, authors, main theorem assumptions and original source. Explain the result, method and relevance. Distinguish new results from new proofs, revisions and seminar announcements; label preprints accurately. Link to the specific version summarized, and do not imply that a full proof has been independently checked when only its statements and strategy have been read. This archive is maintained manually; no scheduled publication job is configured.

## Preview

With Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve
```

Open http://localhost:4000. Generated output in `_site/` must not be committed.

## Publish

GitHub Pages builds and deploys the `master` branch. After pushing, check the **pages build and deployment** workflow in GitHub Actions and verify the live pages.
