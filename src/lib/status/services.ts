/**
 * The checks this site shows from my Gatus monitor, and nothing else. The
 * page renders a check only when its key is listed here, so a new endpoint in
 * Gatus stays off the page until it is added on purpose. Left out:
 *   - `domains_*`: domain expiry is a reminder for me, not news for visitors,
 *     and one of them is the control panel's own domain.
 *   - `monitoring_alertmanager-watchdog`: a heartbeat from my alerting, which
 *     says nothing about whether a site is up.
 *   - `apis_subslayer-api-dev`: a dev deploy that goes down on every push.
 * The infrastructure checks carry the generic names Gatus already gives
 * them; never add a host, an IP or a panel name here.
 */

export type StatusGroupId = 'sites' | 'apis' | 'infrastructure'

export interface StatusGroupInfo {
  id: StatusGroupId
  title: string
  blurb: string
}

export interface PublicCheck {
  /** Gatus endpoint key, `<group>_<name>` with dots as dashes. */
  key: string
  /** Name on the page. */
  name: string
  group: StatusGroupId
  /** Where the name links to, for checks of public sites. */
  href?: string
}

export const STATUS_GROUPS: readonly StatusGroupInfo[] = [
  {
    id: 'sites',
    title: 'Sites',
    blurb: 'My own sites and apps, and the client sites I host.',
  },
  {
    id: 'apis',
    title: 'APIs',
    blurb: 'The backends my apps talk to.',
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    blurb: 'What runs underneath, checked privately and named generically.',
  },
]

/** A public site: the domain is its name and its link. */
function site(domain: string): PublicCheck {
  return {
    key: `sites_${domain.replaceAll('.', '-')}`,
    name: domain,
    group: 'sites',
    href: `https://${domain}`,
  }
}

export const PUBLIC_CHECKS: readonly PublicCheck[] = [
  site('shirone.dev'),
  site('shirone.blog'),
  site('shiroani.app'),
  site('storybook.shiroani.app'),
  site('shiranami.app'),
  site('kireimanga.app'),
  site('omniscribe.app'),
  site('lunofi.app'),
  site('sudekospzoo.pl'),
  site('matmajka.com'),
  { key: 'apis_api-shiranami-app', name: 'Shiranami API', group: 'apis' },
  { key: 'apis_api-lunofi-app', name: 'Lunofi API', group: 'apis' },
  { key: 'apis_subslayer-api', name: 'SubSlayer API', group: 'apis' },
  {
    key: 'infrastructure_control-panel',
    name: 'Control panel',
    group: 'infrastructure',
  },
  {
    key: 'infrastructure_object-storage',
    name: 'Object storage',
    group: 'infrastructure',
  },
  {
    key: 'infrastructure_dashboards',
    name: 'Dashboards',
    group: 'infrastructure',
  },
  { key: 'infrastructure_metrics', name: 'Metrics', group: 'infrastructure' },
  { key: 'infrastructure_logs', name: 'Logs', group: 'infrastructure' },
]
