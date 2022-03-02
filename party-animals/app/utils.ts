export function itemURL(iconString: string): string {
  const [icon, style] = iconString.split(':');
  return `https://img.icons8.com/${style || 'color'}/192/${
    icon || 'tear-off-calendar'
  }.svg?token=9b757a847e9a44b7d84dc1c200a3b92ecf6274b2`;
}
