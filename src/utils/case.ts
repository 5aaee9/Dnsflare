function toCamelCase(name: string): string {
    return name.replace(/_(\w)/g, (_, letter: string) => letter.toUpperCase());
}

function toHungarian(name: string): string {
    return name.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);
}

type AnyRecord = Record<string, unknown>;

type CaseTransformRule = (value: string) => string;

type Convertible = AnyRecord | unknown[];

type ConvertibleOrPrimitive = Convertible | string | number | boolean | null | undefined;

function isConvertible(value: unknown): value is Convertible {
    return typeof value === "object" && value !== null;
}

function objectNameTransform(
    input: ConvertibleOrPrimitive,
    objectNameRule: CaseTransformRule,
): ConvertibleOrPrimitive {
    if (Array.isArray(input)) {
        return input.map((it) => objectNameTransform(it as ConvertibleOrPrimitive, objectNameRule));
    }

    if (!isConvertible(input)) {
        return input;
    }

    const ret: AnyRecord = {};

    Object.keys(input).forEach((it) => {
        const value = (input as AnyRecord)[it];
        if (isConvertible(value)) {
            ret[objectNameRule(it)] = objectNameTransform(value, objectNameRule);
        } else {
            ret[objectNameRule(it)] = value;
        }
    });

    return ret;
}

export const objectToCamelCase = <T>(input: T): T =>
    objectNameTransform(input as ConvertibleOrPrimitive, toCamelCase) as T;
export const objectToHungarian = <T>(input: T): T =>
    objectNameTransform(input as ConvertibleOrPrimitive, toHungarian) as T;
