import React from 'react'
import { FormPathPattern, FormPath } from '@uform/shared'
import {
  IFieldState,
  IVirtualFieldState,
  IMutators,
  IFormProps,
  IForm
} from '@uform/react'
import { ValidatePatternRules } from '@uform/validator'
import { Schema } from './shared/schema'
export interface ISchemaFieldProps {
  path?: FormPathPattern
}

export type ComponentWithStyleComponent<ComponentProps> = React.ComponentType<
  ComponentProps
> & {
  styledComponentId?: string
}

export interface ISchemaFieldComponentProps extends IFieldState {
  path: FormPath
  schema: Schema
  mutators: IMutators
  form: IForm
  renderField: (
    addtionKey: string | number,
    reactKey?: string | number
  ) => React.ReactElement
}
export interface ISchemaVirtualFieldComponentProps extends IVirtualFieldState {
  path: FormPath
  schema: Schema
  form: IForm
  children: React.ReactElement[]
  renderField: (
    addtionKey: string | number,
    reactKey?: string | number
  ) => React.ReactElement
}

export interface ISchemaFieldWrapper<Props = any> {
  (Traget: ISchemaFieldComponent):
    | React.FC<Props>
    | React.ClassicComponent<Props>
}

export type ISchemaFieldComponent = ComponentWithStyleComponent<
  ISchemaFieldComponentProps
> & {
  __WRAPPERS__?: ISchemaFieldWrapper[]
}

export type ISchemaVirtualFieldComponent = ComponentWithStyleComponent<
  ISchemaVirtualFieldComponentProps
> & {
  __WRAPPERS__?: ISchemaFieldWrapper[]
}

export interface IFieldStore {
  fields: {
    [key: string]: ISchemaFieldComponent
  }
  virtualFields: {
    [key: string]: ISchemaVirtualFieldComponent
  }
  wrappers: ISchemaFieldWrapper[]
}

export type SchemaMessage = string | React.ReactElement

export interface ISchema {
  /** base json schema spec**/
  title?: SchemaMessage
  description?: SchemaMessage
  default?: any
  readOnly?: boolean
  writeOnly?: boolean
  type?: 'string' | 'object' | 'array' | 'number' | string
  enum?: Array<string | number | { label: SchemaMessage; value: any }>
  const?: any
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string | RegExp
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  required?: string[] | boolean
  format?: string
  /** nested json schema spec **/
  properties?: {
    [key: string]: ISchema
  }
  items?: ISchema | ISchema[]
  additionalItems?: ISchema
  patternProperties?: {
    [key: string]: ISchema
  }
  additionalProperties?: ISchema
  /** extend json schema specs */
  editable?: boolean
  ['x-props']?: { [name: string]: any }
  ['x-index']?: number
  ['x-rules']?: ValidatePatternRules
  ['x-component']?: string | React.JSXElementConstructor<any>
  ['x-render']?: <T = ISchemaFieldComponentProps>(
    props: T & {
      renderComponent: () => React.ReactElement
    }
  ) => React.ReactElement
  ['x-effect']?: (
    dispatch: (type: string, payload: any) => void,
    option?: object
  ) => { [key: string]: any }
}

export interface ISchemaFormProps extends IFormProps {
  schema?: ISchema
  component?: string | React.JSXElementConstructor<any>
  components?: {
    form?: React.JSXElementConstructor<any>
    formItem?: React.JSXElementConstructor<any>
  }
}

export interface IMarkupSchemaFieldProps extends ISchema {
  name?: string
}

export interface IConnectOptions {
  valueName?: string
  eventName?: string
  defaultProps?: {}
  getValueFromEvent?: (event?: any, value?: any) => any
  getProps?: (
    componentProps: {},
    fieldProps: ISchemaFieldComponentProps | ISchemaVirtualFieldComponentProps
  ) => {} | void
  getComponent?: (
    Target: any,
    componentProps: {},
    fieldProps: ISchemaFieldComponentProps | ISchemaVirtualFieldComponentProps
  ) => T
}

export interface IConnectProps {
  [key: string]: any
}
