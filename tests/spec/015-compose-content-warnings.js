import {
  composeContentWarning, composeInput, composeLengthIndicator, contentWarningButton, homeNavButton,
  notificationsNavButton
} from '../utils'
import { foobarURL } from '../roles'

fixture`015-compose-content-warnings.js`
  .page`${foobarURL}`

test('Changes content warnings', async t => {
  await t
    .expect(composeContentWarning.exists).notOk()
    .expect(contentWarningButton.getAttribute('aria-label')).eql('Add content warning')
    .expect(contentWarningButton.getAttribute('title')).eql('Add content warning')
    .click(contentWarningButton)
    .expect(composeContentWarning.exists).ok()
    .expect(contentWarningButton.getAttribute('aria-label')).eql('Remove content warning')
    .expect(contentWarningButton.getAttribute('title')).eql('Remove content warning')
    .typeText(composeContentWarning, 'hello content warning', { paste: true })
    .typeText(composeInput, 'secret text', { paste: true })
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(contentWarningButton.getAttribute('aria-label')).eql('Remove content warning')
    .expect(contentWarningButton.getAttribute('title')).eql('Remove content warning')
    .expect(composeContentWarning.value).eql('hello content warning')
    .expect(composeInput.value).eql('secret text')
    .selectText(composeInput)
    .pressKey('delete')
    .selectText(composeContentWarning)
    .pressKey('delete')
    .expect(composeContentWarning.value).eql('')
    .expect(composeInput.value).eql('')
    .click(contentWarningButton)
    .expect(composeContentWarning.exists).notOk()
    .expect(contentWarningButton.getAttribute('aria-label')).eql('Add content warning')
    .expect(contentWarningButton.getAttribute('title')).eql('Add content warning')
})

test('Considers content warnings for length limits', async t => {
  await t
    .expect(composeLengthIndicator.innerText).eql('500')
    .click(contentWarningButton)
    .typeText(composeContentWarning, 'my content warning', { paste: true })
    .expect(composeLengthIndicator.innerText).eql('482')
    .typeText(composeInput, 'secret text', { paste: true })
    .expect(composeLengthIndicator.innerText).eql('471')
    .selectText(composeContentWarning)
    .pressKey('delete')
    .expect(composeLengthIndicator.innerText).eql('489')
    .selectText(composeInput)
    .pressKey('delete')
    .expect(composeLengthIndicator.innerText).eql('500')
})

test('Content warning goes away if you hide it', async t => {
  await t
    .click(contentWarningButton)
    .expect(composeContentWarning.value).eql('')
    .typeText(composeContentWarning, 'yo', { paste: true })
    .expect(composeContentWarning.value).eql('yo')
    .expect(composeLengthIndicator.innerText).eql('498')
    .click(contentWarningButton)
    .expect(composeContentWarning.exists).notOk()
    .expect(composeLengthIndicator.innerText).eql('500')
    .click(contentWarningButton)
    .expect(composeContentWarning.value).eql('')
    .expect(composeLengthIndicator.innerText).eql('500')
})
