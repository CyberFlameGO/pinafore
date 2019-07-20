import { statusHtmlToPlainText } from '../_utils/statusHtmlToPlainText'
import { importShowComposeDialog } from '../_components/dialog/asyncDialogs'
import { doDeleteStatus } from './delete'
import { store } from '../_store/store'

export async function deleteAndRedraft (status) {
  let deleteStatusPromise = doDeleteStatus(status.id)
  let dialogPromise = importShowComposeDialog()
  let deletedStatus = await deleteStatusPromise

  store.setComposeData('dialog', {
    text: deletedStatus.text || statusHtmlToPlainText(status.content, status.mentions),
    contentWarningShown: !!status.spoiler_text,
    contentWarning: status.spoiler_text || '',
    postPrivacy: status.visibility,
    media: status.media_attachments && status.media_attachments.map(_ => ({
      description: _.description || '',
      data: _
    })),
    inReplyToId: status.in_reply_to_id,
    // note that for polls there is no real way to preserve the original expiry
    poll: status.poll && {
      multiple: !!status.poll.multiple,
      options: (status.poll.options || []).map(option => option.title)
    }
  })
  let showComposeDialog = await dialogPromise
  showComposeDialog()
}
