const defaultWhatsAppNumber = '541123992527'

export function getWhatsAppNumber() {
  const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')
  return configuredNumber || defaultWhatsAppNumber
}

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`
}
