# ☁️ Link Shortener on Cloudflare Workers

![Using the link shortener to shorten a link](img/overview.gif)

This is a link shortener that runs as a [Cloudflare Worker](https://workers.cloudflare.com/). It's the finished code for the [Build a Link Shortener with Cloudflare Workers tutorial on DEV.to](https://dev.to/mmascioni/build-a-link-shortener-with-cloudflare-workers-1j3i). To deploy it on your own Cloudflare account, follow these steps:

1. Clone this repo: `git clone https://github.com/mm/cf-shortener.git`

2. Ensure Wrangler ***v2***+ is installed on your local machine:
    ```shell
    $ wrangler version
    ```

    If you see `wrangler v1....`, then you need to remove the old version:
    ```shell
    $ npm uninstall -g @cloudflare/wrangler
    ```

    Now install if needed; note the missing "@cloudflare/":
    ```shell
    $ npm install -g wrangler
    $ wrangler version
    ⛅️ wrangler 2.*.* 
    ```

3. Authenticate with Cloudflare:
    ```shell
    $ wrangler login
    ```

4. In the project directory, copy the `wrangler.example.toml` file to `wrangler.toml`. Get your Cloudflare Account ID by running `wrangler whoami`. In `wrangler.toml`, replace `ACCOUNT_ID_HERE` with the account ID you get from Wrangler or the Workers dashboard.

5. Create the Workers KV namespace for the shortener:

    ```shell
    $ wrangler kv:namespace create "SHORTEN"
    $ wrangler kv:namespace create "SHORTEN" --preview
    ```

    Copy the `id` you get in the terminal output to `wrangler.toml` in place of `ID_HERE`, and copy the `preview_id` you get in the terminal output in place of `PREVIEW_ID_HERE`.

6. Deploy the Worker: `wrangler publish`


## Changelog

### v1.1.0

- Updated all dependencies
- Add to `wrangler.toml` `compatibility_date = "2023-01-20"` (CloudFlare's new versioning tag)
- Switching from Wrangler V1 to Wrangler V2


### v1.0.0

- Initial version
