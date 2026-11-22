source "https://rubygems.org"

gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

# Windows/JRuby compatibility
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Hinweis: "wdm" (Datei-Watcher für Windows) lässt sich unter Ruby >= 3.3
# nicht mehr kompilieren. Unter Windows deshalb mit `--force_polling` starten.
