'use client'

// Re-export all form components from their individual files
export { FormInput, type FormInputProps } from './FormInput'
export { FormSelect, type FormSelectProps } from './FormSelect'
export { FormTextArea, type FormTextAreaProps } from './FormTextArea'
export { FormCheckbox, type FormCheckboxProps } from './FormCheckbox'
export { FormRadio, type FormRadioProps } from './FormRadio'

// Legacy aliases for backward compatibility
export { FormInput as TextInput } from './FormInput'
export { FormSelect as Select } from './FormSelect'
export { FormTextArea as TextArea } from './FormTextArea'
export { FormCheckbox as Checkbox } from './FormCheckbox'
export { FormRadio as Radio } from './FormRadio'

// Re-export types
export type { FormInputProps as TextInputProps } from './FormInput'
export type { FormSelectProps as SelectProps } from './FormSelect'
export type { FormTextAreaProps as TextAreaProps } from './FormTextArea'
export type { FormCheckboxProps as CheckboxProps } from './FormCheckbox'
export type { FormRadioProps as RadioProps } from './FormRadio'
