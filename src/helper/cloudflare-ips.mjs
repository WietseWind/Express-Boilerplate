import fetch from 'node-fetch'

const cloudflareIps = [ ...await Promise.all((await Promise.all([4, 6].map(v => fetch('https://www.cloudflare.com/ips-v' + v)))).map(async r => (await r.text()).trim().split(`\n`))) ].flat()

export {
  cloudflareIps,
}
