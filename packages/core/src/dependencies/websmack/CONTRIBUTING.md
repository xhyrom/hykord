# Contributing

Found a site that works with an existing snippet: issue.

Found a new snippet that works for a new site: PR.

Other bundlers than Webpack are allowed.

Note that most, like Vite.js (via esbuild) & Rollup, do not expose any way to get into their modules past build time.

## Top tips

- Use Firefox
  - it hides default props from the `window` object, removing lots of clutter while you're testing
  - you can identify webpack websites easily by seeing the Webpack entry in the Debugger, with icon and all
    - if you have to use chrome, usually in electron, look for `webpack://`
- Heres a way to make random IDs: `Math.random().toString(36)`
- Look for webpack "chunk"s or `jsonp`.
