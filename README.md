# Ruijia Zhang's academic website

Website: https://ruijia-z.github.io/

This site uses Jekyll and AcademicPages (based on Minimal Mistakes). See `LICENSE` for the theme license.

## Content

- `_pages/main.md`: introduction, education, employment and recent news.
- `_pages/research.md`: the complete publications, preprints and projects list.
- `_pages/teaching.md`: teaching experience.
- `_pages/talks.md` and `_data/talks.yml`: talks, maintained in one list.
- `_pages/contact.md`: institutional mailing address.
- `_config.yml`: site metadata and the single source for the email address.
- `_data/navigation.yml`: navigation links.

The former About Me page redirects to the homepage. Former individual talk URLs redirect to the talks list. Archived documents in `_archive/` are excluded from publication; the older PDF CV is retained there as a historical record, not as current biographical information.

## Preview

With Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve
```

Open http://localhost:4000. Generated output in `_site/` must not be committed.

## Publish

GitHub Pages builds and deploys the `master` branch. After pushing, check the **pages build and deployment** workflow in GitHub Actions and verify the live pages.
