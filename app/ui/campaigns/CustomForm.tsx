import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import Link from "next/link"

export const Form = ({ children, action, close }: { children: React.ReactNode, action: any, close?: string }) => {
    return (
        <div className="flex justify-center items-center">
            <form action={action} className="relative space-y-8 my-8" style={{ width: "1000px" }}>
                {close &&
                    <Link href={close} className="absolute top-0 right-0 text-text">
                        <X className="h-7 w-7" />
                    </Link>
                }
                <div className='bg-main border-2 border-black rounded-lg shadow-light dark:shadow-dark overflow-hidden'
                    style={{ margin: "-28px", padding: "28px" }}>
                    {children}
                </div>
            </form>
        </div>
    )
}

export const FormItemInput = ({ name, label, maxLength = 50, minLength = 0, defaultValue = "", placeholder, type = "text", min = 0, max = 20, visible = true, Icon, className }: {
    name: string, label: string, maxLength?: number, minLength?: number, defaultValue?: string, placeholder?: string, type?: string, min?: number, max?: number, visible?: boolean
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>, className?: string
}) => {
    return (
        <div className={cn((visible ? "mb-4" : "invisible max-h-0"), className)}>
            <label htmlFor={name} className="text-text mb-2 block text-sm font-medium">
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
            <label htmlFor={name} className="text-text mb-2 block text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                <Textarea defaultValue={defaultValue} placeholder={placeholder ? placeholder : name} id={name} name={name} maxLength={maxLength} minLength={minLength} required={minLength > 0} className={Icon ? "pl-10" : ""} />
                {Icon && <Icon className="absolute left-3 top-1/4 text-gray-500 peer-focus:text-gray-500 h-[18px] w-[18px] -translate-y-1/2" />}
            </div>
        </div>
    )
}

export type keyValuePair = {
    key: string,
    value: string
}

export const FormItemSelect = ({ name, label, options, defaultValue = "", visible = true, className, classNameLabel, classNameSelect }: {
    name: string, label: string, options: keyValuePair[], defaultValue?: string, visible?: boolean, className?: string, classNameLabel?: string, classNameSelect?: string
}) => {
    return (
        <div className={cn((visible ? "mb-4" : "invisible max-h-0"), className)}>
            <label htmlFor={name} className={cn(
                'mb-2 block text-sm font-medium',
                classNameLabel,
            )}>
                {label}
            </label>
            <Select name={name} defaultValue={defaultValue}>
                <SelectTrigger className={classNameSelect}>
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

export const FormItemCheckbox = ({ name, label, defaultChecked, visible = true, className }: {
    name: string, label: string, defaultChecked: boolean, visible?: boolean, className?: string
}) => {
    return (
        <div className={cn((visible ? "ml-1 mb-8" : "invisible max-h-0"), className)}>
            <label className="text-text mb-5 block text-sm font-medium">
                {label}
            </label>
            <div className="flex">
                <Checkbox id={name} name={name} defaultChecked={defaultChecked} />
            </div>
        </div>
    )
}