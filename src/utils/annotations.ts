import Vue from 'vue'

export type ElFormElement = Element & {
    validate(): Promise<boolean>
}

export function ValidForm(ref: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value

        descriptor.value = async function (...args: any[]) {
            ((this as Vue).$refs[ref] as ElFormElement).validate()
                .then(it => {
                    if (it) {
                        method.call(this, ...args)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
}
