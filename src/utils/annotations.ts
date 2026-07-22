type FormTarget = { $refs: Record<string, ElFormElement | undefined> };

type ValidatedMethod = (...args: unknown[]) => void;

export type ElFormElement = Element & {
    validate(): Promise<boolean>;
};

export function ValidForm(ref: string) {
    return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value as ValidatedMethod;

        descriptor.value = async function (...args: unknown[]) {
            const form = (this as FormTarget).$refs[ref];
            if (!form) {
                return;
            }

            form.validate()
                .then((it) => {
                    if (it) {
                        method.call(this, ...args);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };
    };
}
