import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup,
} from "@/components/ui/select"

export const Form = ({ children, action }: { children: React.ReactNode, action: any }) => {
    return (
        <div className="flex justify-center items-center">
            <form action={action} className="space-y-8 my-14" style={{ width: "1000px" }}>
                {children}
            </form>
        </div>
    )
}

export const FormItemInput = ({ name, label, maxLength = 50, minLength = 0, defaultValue = "", placeholder, type = "text", min = 0, max = 20, visible = true, Icon }: {
    name: string, label: string, maxLength?: number, minLength?: number, defaultValue?: string, placeholder?: string, type?: string, min?: number, max?: number, visible?: boolean
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>
}) => {
    return (
        <div className={(visible ? "mb-4" : "invisible max-h-0")}>
            <label htmlFor={name} className="mb-2 block text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                <Input type={type} min={min} max={max} defaultValue={(type === "number" && defaultValue === "") ? 0 : defaultValue} placeholder={placeholder ? placeholder : name.replaceAll("_", " ")} id={name} name={name} maxLength={maxLength} minLength={minLength} required={minLength > 0} className={Icon ? "pl-10" : ""} />
                {Icon && <Icon className="absolute left-3 top-1/2 text-gray-500 peer-focus:text-gray-500 h-[18px] w-[18px] -translate-y-1/2" />}
            </div>
        </div>
    )
}

export const FormItemTextArea = ({ name, label, maxLength = 300, minLength = 0, defaultValue = "", placeholder, visible = true, Icon }: {
    name: string, label: string, maxLength?: number, minLength?: number, defaultValue?: string, placeholder?: string, visible?: boolean
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>
}) => {
    return (
        <div className={(visible ? "mb-4" : "invisible max-h-0")}>
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

type keyValuePair = {
    key: string,
    value: string
}

export const FormItemSelect = ({ name, label, options, defaultValue = "", visible = true }: {
    name: string, label: string, options: keyValuePair[], defaultValue?: string, visible?: boolean
}) => {
    return (
        <div className={(visible ? "mb-4" : "invisible max-h-0")}>
            <label htmlFor={name} className="mb-2 block text-sm font-medium">
                {label}
            </label>
            <Select name={name} defaultValue={defaultValue}>
                <SelectTrigger>
                    <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {options.map((option, index) => (
                            <SelectItem key={option.key} value={option.key} >
                                {option.value}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}