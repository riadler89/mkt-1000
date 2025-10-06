export const stringToBoolean = (
  value: string | undefined,
  defaultValue: boolean = false,
) => (value ? value.toLowerCase() === 'true' : defaultValue)
