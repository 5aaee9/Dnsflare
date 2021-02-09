function toCamelCase(name: string): string {
    return name.replace(/_(\w)/g, (_, letter: string) => letter.toUpperCase())
}

function toHungarian(name: string): string {
    return name.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`)
}

function objectNameTransform(input: any, objectNameRule: (string) => string): any {
    const ret = {}

    if (Array.isArray(input)) {
        return input.map(it => objectNameTransform(it, objectNameRule))
    }

    if (typeof input !== 'object') {
        return input
    }

    Object.keys(input).forEach(it => {
        if (typeof input[it] === 'object' && input[it] !== null) {
            ret[objectNameRule(it)] = objectNameTransform(input[it], objectNameRule)
        } else {
            ret[objectNameRule(it)] = input[it]
        }
    })

    return ret
}

export const objectToCamelCase = input => objectNameTransform(input, toCamelCase)
export const objectToHungarian = input => objectNameTransform(input, toHungarian)
