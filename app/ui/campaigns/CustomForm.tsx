import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const Form = ({ children, action }: { children: React.ReactNode, action: any }) => {
    return (
        <div className="flex justify-center items-center">
            <form action={action} className="space-y-8 my-14" style={{ width: "1000px" }}>
                {children}
            </form>
        </div>
    )
}

export const FormItemInput = ({ name, label, maxLength = 50, minLength = 0, defaultValue = "", placeholder, Icon }: {
    name: string, label: string, maxLength?: number, minLength?: number, defaultValue?: string, placeholder?: string
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="mb-2 block text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                <Input type="text" defaultValue={defaultValue} placeholder={placeholder ? placeholder : name} id={name} name={name} maxLength={maxLength} minLength={minLength} required={minLength > 0} className={Icon ? "pl-10" : ""} />
                {Icon && <Icon className="absolute left-3 top-1/2 text-gray-500 peer-focus:text-gray-500 h-[18px] w-[18px] -translate-y-1/2" />}
            </div>
        </div>
    )
}

export const FormItemTextArea = ({ name, label, maxLength = 300, minLength = 0, defaultValue = "", placeholder, Icon }: {
    name: string, label: string, maxLength?: number, minLength?: number, defaultValue?: string, placeholder?: string
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="mb-2 block text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                <Textarea defaultValue={defaultValue} placeholder={placeholder ? placeholder : name} id={name} name={name} maxLength={maxLength} minLength={minLength} required={minLength > 0} className={Icon ? "pl-10" : ""} />
                {Icon && <Icon className="absolute left-3 top-1/4 text-gray-500 peer-focus:text-gray-500 h-[18px] w-[18px] -translate-y-1/2" />}
            </div>
        </div>
    )


}