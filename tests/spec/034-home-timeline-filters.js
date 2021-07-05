import {
  validateTimeline, settingsNavButton, instanceSettingHomeReblogs, homeNavButton
} from '../utils'
import { foobarURL } from '../roles'
import { homeTimeline } from '../fixtures'
import { Selector as $ } from 'testcafe'

fixture`034-home-timeline-filters.js`
  .page`${foobarURL}`

test('Filters reblogs from home timeline', async t => {
  await t
    .click(settingsNavButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .click(instanceSettingHomeReblogs)
    .expect(instanceSettingHomeReblogs.checked).notOk()
    .click(homeNavButton)
  await validateTimeline(t, homeTimeline.filter(({ content }) => {
    return content !== 'pinned toot 1'
  }))
})
