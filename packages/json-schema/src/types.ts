export type SchemaEnum<Message> = Array<
  | string
  | number
  | boolean
  | { label: Message; value: any; [key: string]: any }
  | { key: any; title: Message; [key: string]: any }
>

export type SchemaTypes =
  | 'string'
  | 'object'
  | 'array'
  | 'number'
  | 'boolean'
  | 'void'
  | 'date'
  | 'datetime'
  | (string & {})

export type SchemaProperties<
  Decorator,
  Component,
  DecoratorProps,
  ComponentProps,
  Pattern,
  Display,
  Validator,
  Message
> = Record<
  string,
  ISchema<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >
>

export type SchemaPatch = (schema: ISchema) => ISchema

export type SchemaKey = string | number

export type SchemaEffectTypes =
  | 'onFieldInit'
  | 'onFieldMount'
  | 'onFieldUnmount'
  | 'onFieldValueChange'
  | 'onFieldInputValueChange'
  | 'onFieldInitialValueChange'
  | 'onFieldValidateStart'
  | 'onFieldValidateEnd'
  | 'onFieldValidateFailed'
  | 'onFieldValidateSuccess'

export type SchemaReaction<Field = any> =
  | {
      dependencies?:
        | Array<string | { name?: string; source?: string }>
        | Record<string, string>
      when?: string | boolean
      target?: string
      effects?: SchemaEffectTypes[]
      fulfill?: {
        state?: Stringify<Formily.Core.Types.IGeneralFieldState>
        schema?: ISchema
        run?: string
      }
      otherwise?: {
        state?: Stringify<Formily.Core.Types.IGeneralFieldState>
        schema?: ISchema
        run?: string
      }
      [key: string]: any
    }
  | ((field: Field) => void)

export type SchemaReactions<Field = any> =
  | SchemaReaction<Field>
  | SchemaReaction<Field>[]

export type SchemaItems<
  Decorator,
  Component,
  DecoratorProps,
  ComponentProps,
  Pattern,
  Display,
  Validator,
  Message
> =
  | ISchema<
      Decorator,
      Component,
      DecoratorProps,
      ComponentProps,
      Pattern,
      Display,
      Validator,
      Message
    >
  | ISchema<
      Decorator,
      Component,
      DecoratorProps,
      ComponentProps,
      Pattern,
      Display,
      Validator,
      Message
    >[]

export type SchemaComponents = Record<string, any>

export interface ISchemaFieldFactoryOptions<
  Components extends SchemaComponents = any
> {
  components?: Components
  scope?: any
}

export interface ISchemaFieldUpdateRequest {
  state?: Stringify<Formily.Core.Types.IFieldState>
  schema?: ISchema
  run?: string
}

export interface ISchemaTransformerOptions extends ISchemaFieldFactoryOptions {
  required?: ISchema['required']
}

export type Stringify<P extends { [key: string]: any }> = {
  /**
   * Use `string & {}` instead of string to keep Literal Type for ISchema#component and ISchema#decorator
   */
  [key in keyof P]?: P[key] | (string & {})
}

export type ISchema<
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any,
  Pattern = any,
  Display = any,
  Validator = any,
  Message = any,
  ReactionField = any
> = Stringify<{
  version?: string
  name?: SchemaKey
  title?: Message
  description?: Message
  default?: any
  readOnly?: boolean
  writeOnly?: boolean
  type?: SchemaTypes
  enum?: SchemaEnum<Message>
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
  required?: string[] | boolean | string
  format?: string
  $ref?: string
  /** nested json schema spec **/
  definitions?: SchemaProperties<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >
  properties?: SchemaProperties<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >
  items?: SchemaItems<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >
  additionalItems?: ISchema<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >
  patternProperties?: SchemaProperties<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >
  additionalProperties?: ISchema<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >

  //顺序描述
  ['x-index']?: number
  //交互模式
  ['x-pattern']?: Pattern
  //展示状态
  ['x-display']?: Display
  //校验器
  ['x-validator']?: Validator
  //装饰器
  ['x-decorator']?: Decorator | (string & {}) | ((...args: any[]) => any)
  //装饰器属性
  ['x-decorator-props']?: DecoratorProps
  //组件
  ['x-component']?: Component | (string & {}) | ((...args: any[]) => any)
  //组件属性
  ['x-component-props']?: ComponentProps
  //组件响应器
  ['x-reactions']?: SchemaReactions<ReactionField>
  //内容
  ['x-content']?: any

  ['x-visible']?: boolean

  ['x-hidden']?: boolean

  ['x-disabled']?: boolean

  ['x-editable']?: boolean

  ['x-read-only']?: boolean

  ['x-read-pretty']?: boolean

  [key: `x-${string | number}`]: any
}>
