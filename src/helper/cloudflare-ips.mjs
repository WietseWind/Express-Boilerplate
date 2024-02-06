import fetch from 'node-fetch'

// I know, I know, ugliest piece of shit. But works pretty damn well.
const cloudflareIps = [ ...await Promise.all((await Promise.all([4, 6].map(v => fetch('https://www.cloudflare.com/ips-v' + v)))).map(async r => (await r.text()).trim().split(`\n`))) ].flat()

export {
  cloudflareIps,
}
