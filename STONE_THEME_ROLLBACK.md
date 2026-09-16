# Stone theme rollback

The new public design is enabled by default and is isolated from the existing light/dark theme system.

## Preview the existing design

Open any public page with `?theme=classic`, for example:

```text
https://wasettravel.com/en?theme=classic
```

The URL override is useful for client review. The selected variant is also stored locally in the browser.

## Restore the existing design globally

Set this build-time environment variable and redeploy:

```text
NEXT_PUBLIC_SITE_THEME=classic
```

To enable the new design again, remove the variable or set it to `stone`.
