/* istanbul ignore file */
import { untracked } from '@formily/reactive'
import {
  isBool,
  isArr,
  isStr,
  FormPath,
  isValid,
  toArr,
  isEqual,
  each,
  isFn,
  isPlainObj,
  reduce,
  isEmpty,
  FormPathPattern,
} from '@formily/shared'
import { getValidateLocale } from '@formily/validator'
import { Schema } from './schema'
import {
  ISchema,
  ISchemaFieldFactoryOptions,
  ISchemaFieldUpdateRequest,
  SchemaReactions,
} from './types'
import {
  onFieldInit,
  onFieldMount,
  onFieldUnmount,
  onFieldValueChange,
  onFieldInputValueChange,
  onFieldInitialValueChange,
  onFieldValidateStart,
  onFieldValidateEnd,
  onFieldValidateFailed,
  onFieldValidateSuccess,
} from '@formily/core'

const FieldEffects = {
  onFieldInit,
  onFieldMount,
  onFieldUnmount,
  onFieldValueChange,
  onFieldInputValueChange,
  onFieldInitialValueChange,
  onFieldValidateStart,
  onFieldValidateEnd,
  onFieldValidateFailed,
  onFieldValidateSuccess,
}

const getValidator = (schema: Schema): Formily.Core.Types.FieldValidator => {
  let rules = []
  if (schema.format) {
    rules.push({ format: schema.format })
  }
  if (isValid(schema.maxItems)) {
    rules.push({ max: schema.maxItems })
  }
  if (isValid(schema.minItems)) {
    rules.push({ min: schema.minItems })
  }
  if (isValid(schema.maxLength)) {
    rules.push({ max: schema.maxLength })
  }
  if (isValid(schema.minLength)) {
    rules.push({ min: schema.minLength })
  }
  if (isValid(schema.maximum)) {
    rules.push({ maximum: schema.maximum })
  }
  if (isValid(schema.minimum)) {
    rules.push({ minimum: schema.minimum })
  }
  if (isValid(schema.exclusiveMaximum)) {
    rules.push({ exclusiveMaximum: schema.exclusiveMaximum })
  }
  if (isValid(schema.exclusiveMinimum)) {
    rules.push({ exclusiveMinimum: schema.exclusiveMinimum })
  }
  if (isValid(schema.pattern)) {
    rules.push({ pattern: schema.pattern })
  }
  if (isValid(schema.const)) {
    rules.push({
      validator: (
        value: any,
        rule: any,
        ctx: any,
        format: (message: string, scope: any) => string
      ) => {
        if (isEmpty(value)) return ''
        return value === schema.const
          ? ''
          : format(getValidateLocale('schema.const'), schema)
      },
    })
  }
  if (isValid(schema.multipleOf)) {
    rules.push({
      validator: (
        value: any,
        rule: any,
        ctx: any,
        format: (message: string, scope: any) => string
      ) => {
        if (isEmpty(value)) return ''
        return value % schema.multipleOf === 0
          ? ''
          : format(getValidateLocale('schema.multipleOf'), schema)
      },
    })
  }
  if (isValid(schema.maxProperties)) {
    rules.push({
      validator: (
        value: any,
        rule: any,
        ctx: any,
        format: (message: string, scope: any) => string
      ) => {
        if (isEmpty(value)) return ''
        return Object.keys(value || {}).length <= schema.maxProperties
          ? ''
          : format(getValidateLocale('schema.maxProperties'), schema)
      },
    })
  }
  if (isValid(schema.minProperties)) {
    rules.push({
      validator: (
        value: any,
        rule: any,
        ctx: any,
        format: (message: string, scope: any) => string
      ) => {
        if (isEmpty(value)) return ''
        return Object.keys(value || {}).length >= schema.minProperties
          ? ''
          : format(getValidateLocale('schema.minProperties'), schema)
      },
    })
  }
  if (isValid(schema.uniqueItems)) {
    rules.push({
      validator: (
        value: any,
        rule: any,
        ctx: any,
        format: (message: string, scope: any) => string
      ) => {
        value = toArr(value)
        return value.some((item: any, index: number) => {
          for (let start = index; start < value.length; start++) {
            if (isEqual(value[start], item)) {
              return false
            }
          }
        })
          ? format(getValidateLocale('schema.uniqueItems'), schema)
          : ''
      },
    })
  }

  if (isValid(schema['x-validator'])) {
    rules = rules.concat(schema['x-validator'])
  }
  if (rules.length) return rules
}

const getDataSource = (schema: Schema) => {
  if (isArr(schema['enum'])) {
    return schema['enum'].map((item) => {
      if (typeof item === 'object') {
        return item
      } else {
        return {
          label: item,
          value: item,
        }
      }
    })
  }
}

const findComponent = (
  type: 'component' | 'decorator',
  path: Formily.Core.Types.FormPathPattern,
  options: ISchemaFieldFactoryOptions,
  state: Formily.Core.Types.IFieldState
) => {
  let component: any = state?.[type]?.[0]

  if (path && options?.components) {
    if (FormPath.isPathPattern(path)) {
      component = FormPath.getIn(options.components, path)
      if (!component) {
        //Todo: need to use __DEV__ keyword
        console.error(
          `[Formily JSON Schema]: Cannot find the '${path}' component mapped by Schema.x-${type}`
        )
      }
    }
  }
  if (isFn(path) || (path?.['$$typeof'] && isFn(path['type']))) {
    return path
  }
  return component
}

const getBaseProps = (
  schema: Schema,
  options: ISchemaFieldFactoryOptions,
  state?: Formily.Core.Types.IFieldState
) => {
  const props: Partial<Formily.Core.Types.IFieldFactoryProps<any, any>> = {}

  const validator = getValidator(schema)

  const dataSource = getDataSource(schema)

  const editable = isValid(schema['x-editable'])
    ? schema['x-editable']
    : schema['writeOnly']

  const readOnly = isValid(schema['x-read-only'])
    ? schema['x-read-only']
    : schema['readOnly']

  const decoratorType = findComponent(
    'decorator',
    schema['x-decorator'],
    options,
    state
  )

  const decoratorProps = schema['x-decorator-props'] || state?.decorator?.[1]

  const componentType = findComponent(
    'component',
    schema['x-component'],
    options,
    state
  )
  const componentProps = schema['x-component-props'] || state?.component?.[1]

  if (isValid(schema.default)) {
    props.initialValue = schema.default
  }

  if (isValid(schema.title)) {
    props.title = schema.title
  }

  if (isValid(schema.description)) {
    props.description = schema.description
  }

  if (isValid(schema['x-disabled'])) {
    props.disabled = schema['x-disabled']
  }

  if (isValid(schema['x-read-pretty'])) {
    props.readPretty = schema['x-read-pretty']
  }

  if (isValid(schema['x-visible'])) {
    props.visible = schema['x-visible']
  }

  if (isValid(schema['x-hidden'])) {
    props.hidden = schema['x-hidden']
  }

  if (isValid(schema['x-display'])) {
    props.display = schema['x-display']
  }

  if (isValid(schema['x-pattern'])) {
    props.pattern = schema['x-pattern']
  }

  if (isValid(validator)) {
    props.validator = validator
  }

  if (isValid(dataSource)) {
    props.dataSource = dataSource
  }

  if (isValid(editable)) {
    props.editable = editable
  }

  if (isValid(readOnly)) {
    props.readOnly = readOnly
  }

  if (isValid(decoratorType)) {
    props.decorator = [decoratorType, decoratorProps]
  }

  if (isValid(componentType)) {
    props.component = [componentType, componentProps]
  }

  return props
}

const patchState = (state: any, target: any) => {
  const patch = (target: any, path: string[]) => {
    if (isPlainObj(target)) {
      each(target, (value, key) => {
        patch(value, path.concat(key))
      })
    } else {
      FormPath.setIn(state, path, target)
    }
  }
  untracked(() => {
    patch(target, [])
  })
  return state
}

const getRequired = (schema: Schema) => {
  if (isBool(schema.required)) {
    return schema.required
  }
  let parent: Schema = schema.parent
  while (parent) {
    if (isStr(parent.required)) {
      if (FormPath.parse(parent.required).match(schema.name)) return true
    } else if (isArr(parent.required)) {
      if (
        parent.required.some((parent) =>
          FormPath.parse(parent).match(schema.name)
        )
      ) {
        return true
      }
    }
    parent = parent.parent
  }
  return undefined
}

const getReactions = (schema: ISchema, options: ISchemaFieldFactoryOptions) => {
  const setSchemaFieldState = (
    field: Formily.Core.Types.GeneralField,
    request: ISchemaFieldUpdateRequest,
    compile: (expression: any) => any
  ) => {
    if (!request) return
    if (request.state) {
      field.setState((state) => patchState(state, compile(request.state)))
    }
    if (request.schema) {
      field.setState((state) =>
        patchState(
          state,
          getBaseProps(patchState({}, compile(request.schema)), options, state)
        )
      )
    }
  }

  const setSchemaFieldStateByTarget = (
    form: Formily.Core.Models.Form,
    target: FormPathPattern,
    request: ISchemaFieldUpdateRequest,
    compile: (expression: any, state?: any) => any
  ) => {
    if (!request) return
    if (request.state) {
      form.setFieldState(target, (state) =>
        patchState(state, compile(request.state, state))
      )
    }
    if (request.schema) {
      form.setFieldState(target, (state) =>
        patchState(
          state,
          getBaseProps(
            patchState({}, compile(request.schema, state)),
            options,
            state
          )
        )
      )
    }
  }

  const queryDependency = (
    field: Formily.Core.Models.Field,
    pattern: string
  ) => {
    const [target, path] = String(pattern).split(/\s*#\s*/)
    return field.query(target).getIn(path || 'value')
  }

  const parseDependencies = (
    field: Formily.Core.Models.Field,
    dependencies: Array<string | { name: string; source: string }> | object
  ) => {
    if (isArr(dependencies)) {
      const results = []
      dependencies.forEach((pattern) => {
        if (isStr(pattern)) {
          results.push(queryDependency(field, pattern))
        } else if (isPlainObj(pattern)) {
          if (pattern.name && pattern.source) {
            results[pattern.name] = queryDependency(field, pattern.source)
          }
        }
      })
      return results
    } else if (isPlainObj(dependencies)) {
      return reduce(
        dependencies,
        (buf, pattern, key) => {
          buf[key] = queryDependency(field, pattern)
          return buf
        },
        {}
      )
    }
    return []
  }

  return (field: Formily.Core.Models.Field) => {
    const reactions: SchemaReactions = toArr(schema['x-reactions'])
    reactions.forEach((reaction) => {
      if (!reaction) return
      if (isFn(reaction)) {
        return reaction(field)
      }
      const run = () => {
        const $self = field
        const $form = field.form
        const $deps = parseDependencies(field, reaction.dependencies)
        const $dependencies = $deps
        const scope = {
          ...options.scope,
          $target: null,
          $form,
          $self,
          $deps,
          $dependencies,
        }
        const compile = (expression: any, target?: any) => {
          if (target) {
            scope.$target = target
          }
          return Schema.compile(expression, scope)
        }
        const when = Schema.compile(reaction?.when, scope)
        const condition = isValid(reaction?.when) ? when : true
        if (condition) {
          if (reaction.target) {
            setSchemaFieldStateByTarget(
              field.form,
              reaction.target,
              reaction.fulfill,
              compile
            )
          } else {
            setSchemaFieldState(field, reaction.fulfill, compile)
          }
          if (isStr(reaction.fulfill?.run)) {
            compile(`{{async function(){${reaction.fulfill?.run}}}}`)()
          }
        } else {
          if (reaction.target) {
            setSchemaFieldStateByTarget(
              field.form,
              reaction.target,
              reaction.otherwise,
              compile
            )
          } else {
            setSchemaFieldState(field, reaction.otherwise, compile)
          }
          if (isStr(reaction.otherwise?.run)) {
            compile(`{{async function(){${reaction.otherwise?.run}}}}`)()
          }
        }
      }
      if (reaction.target) {
        reaction.effects = reaction.effects?.length
          ? reaction.effects
          : ['onFieldInit', 'onFieldValueChange']
      }
      if (reaction.effects) {
        each(reaction.effects, (type) => {
          if (FieldEffects[type]) {
            untracked(() => {
              FieldEffects[type](field.address, run)
            })
          }
        })
      } else {
        run()
      }
    })
  }
}

export const transformSchemaToFieldProps = (
  schema: Schema,
  options: ISchemaFieldFactoryOptions
): Formily.Core.Types.IFieldFactoryProps<any, any> => {
  const required = getRequired(schema)
  const reactions = getReactions(schema, options)
  const props = getBaseProps(schema, options)

  props.required = required
  props.name = schema.name
  props.reactions = [reactions]

  return props as any
}
