// map-name-fixes.ts
// Handles STP specific overrides to match region names correctly

const NAME_ALIASES: Record<string, string> = {
  'Mé-zóxi': 'Mé-Zóchi',
  'Mé-Zóxi': 'Mé-Zóchi',
  'Me-Zochi': 'Mé-Zóchi',
  'Lemba': 'Lembá',
  'Pagué': 'RAP',
  'Principe': 'RAP',
  'Príncipe': 'RAP',
  'Região Autónoma do Príncipe': 'RAP',
  'Agua Grande': 'Água Grande',
  'Caué': 'Caué',
  'Lobata': 'Lobata',
  'Cantagalo': 'Cantagalo'
};

export function normalizeMapName(rawName: string): string {
  if (!rawName) return '';
  const trimmed = rawName.trim();
  return NAME_ALIASES[trimmed] || trimmed;
}
