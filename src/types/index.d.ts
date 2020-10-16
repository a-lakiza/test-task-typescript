export interface ObjectType {
  [key: string]: any
}

export interface FormFields {
  [key: string]: {
    required: boolean,
    value: any,
    error: boolean,
    errorMessage: string | null
  }
}

export interface Configuration {
  label: string
  name: string
  type: string
  required: boolean,
  errorMessage?: string
}

export interface Contact {
  id: string
  key: string
  [key: string]: any
}