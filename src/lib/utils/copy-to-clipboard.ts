import { toast } from 'sonner'

/**
 * Put `text` on the clipboard and confirm with a toast. The write can be
 * refused (no permission, insecure origin), which shows an error toast
 * instead of a false confirmation.
 */
export async function copyToClipboard(text: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(successMessage)
  } catch {
    toast.error('Could not copy to the clipboard')
  }
}
