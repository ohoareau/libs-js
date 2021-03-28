export function unknown(args: string[], {operation}) {
    throw new Error(`Unsupported cli operation '${operation}'`)
}