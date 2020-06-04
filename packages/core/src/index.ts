import {
  IFormCreatorOptions,
  IFieldRegistryProps,
  IField,
  IFieldState,
  isVirtualField,
  IVirtualField,
  LifeCycleTypes,
  IVirtualFieldRegistryProps,
  isField,
  IFormState,
  IVirtualFieldState,
  FormHeartSubscriber,
  IFormSubmitResult,
  IFormValidateResult,
  IFormResetOptions,
  isFormState,
  isFieldState,
  isVirtualFieldState,
  IFormExtendedValidateFieldOptions
} from './types'
import {
  FormValidator,
  setValidationLanguage,
  setValidationLocale
} from '@formily/validator'
import {
  FormPath,
  FormPathPattern,
  isValid,
  isFn,
  isArr,
  isObj,
  isPlainObj,
  each,
  BigData,
  clone,
  log,
  defaults,
  toArr,
  isNum
} from '@formily/shared'
import { createFormContext } from './context'
import { Field } from './models/field'
import { VirtualField } from './models/virtual-field'
export * from './shared/lifecycle'
export * from './types'

declare global {
  namespace FormilyCore {
    export interface FieldProps {
      [key: string]: any
    }
    export interface VirtualFieldProps {
      [key: string]: any
    }
  }
}

export const createForm = (options: IFormCreatorOptions = {}) => {
  const context = createFormContext(options)

  const {
    init,
    env,
    form,
    heart,
    graph,
    validator,
    hostUpdate,
    isHostRendering,
    getDataPath,
    getFormValuesIn,
    getFormInitialValuesIn,
    deleteFormValuesIn,
    setFormValuesIn,
    setFormInitialValuesIn,
    existFormValuesIn,
    updateRecoverableShownState,
    resetFormMessages,
    syncFormMessages,
    batchRunTaskQueue,
    pushTaskQueue
  } = context

  function onFieldChange({ field, path }: { field: IField; path: FormPath }) {
    return (published: IFieldState) => {
      const { dirtys } = field
      if (dirtys.initialized) {
        heart.publish(LifeCycleTypes.ON_FIELD_INIT, field)
      }
      if (dirtys.value) {
        heart.publish(LifeCycleTypes.ON_FIELD_VALUE_CHANGE, field)
      }
      if (dirtys.initialValue) {
        heart.publish(LifeCycleTypes.ON_FIELD_INITIAL_VALUE_CHANGE, field)
      }
      if (dirtys.visible || dirtys.display) {
        graph.eachChildren(path, childState => {
          childState.setState((state: IFieldState<FormilyCore.FieldProps>) => {
            if (dirtys.visible) {
              updateRecoverableShownState(published, state, 'visible')
            }
            if (dirtys.display) {
              updateRecoverableShownState(published, state, 'display')
            }
          }, true)
        })
      }
      if (dirtys.unmounted && published.unmounted) {
        heart.publish(LifeCycleTypes.ON_FIELD_UNMOUNT, field)
        if (!existFormValuesIn(published.name)) {
          graph.remove(published.path)
        }
      }

      if (dirtys.mounted && published.mounted) {
        heart.publish(LifeCycleTypes.ON_FIELD_MOUNT, field)
      }

      if (dirtys.errors) {
        syncFormMessages('errors', published)
      }

      if (dirtys.warnings) {
        syncFormMessages('warnings', published)
      }

      if (
        dirtys.unmounted ||
        dirtys.visible ||
        dirtys.display ||
        dirtys.editable
      ) {
        //fix #682
        resetFormMessages(published)
      }

      heart.publish(LifeCycleTypes.ON_FIELD_CHANGE, field)
    }
  }

  function onVirtualFieldChange({
    field,
    path
  }: {
    field: IVirtualField
    path: FormPath
  }) {
    return (published: IVirtualFieldState) => {
      const { dirtys } = field
      if (dirtys.initialized) {
        heart.publish(LifeCycleTypes.ON_FIELD_INIT, field)
      }

      if (dirtys.visible || dirtys.display) {
        graph.eachChildren(path, childState => {
          childState.setState(
            (state: IVirtualFieldState<FormilyCore.VirtualFieldProps>) => {
              if (dirtys.visible) {
                updateRecoverableShownState(published, state, 'visible')
              }
              if (dirtys.display) {
                updateRecoverableShownState(published, state, 'display')
              }
            },
            true
          )
        })
      }

      if (dirtys.mounted && published.mounted) {
        heart.publish(LifeCycleTypes.ON_FIELD_MOUNT, field)
      }
      heart.publish(LifeCycleTypes.ON_FIELD_CHANGE, field)
    }
  }

  function registerField({
    path,
    name,
    value,
    initialValue,
    required,
    rules,
    editable,
    visible,
    display,
    computeState,
    dataType,
    unmountRemoveValue,
    props
  }: IFieldRegistryProps<FormilyCore.FieldProps>) {
    let field: IField
    const nodePath = FormPath.parse(path || name)
    const dataPath = getDataPath(nodePath)
    const createField = (field?: IField) => {
      const alreadyHaveField = !!field
      field =
        field ||
        new Field({
          nodePath,
          dataPath,
          computeState,
          dataType,
          getValue(name) {
            return getFormValuesIn(name)
          },
          setValue(name, value) {
            setFormValuesIn(name, value)
          },
          setInitialValue(name, value) {
            setFormInitialValuesIn(name, value)
          },
          removeValue(name) {
            deleteFormValuesIn(name, true)
          },
          getInitialValue(name) {
            return getFormInitialValuesIn(name)
          }
        })
      field.subscription = {
        notify: onFieldChange({ field, path: nodePath })
      }
      heart.publish(LifeCycleTypes.ON_FIELD_WILL_INIT, field)
      if (!alreadyHaveField) {
        graph.appendNode(nodePath, field)
      }

      heart.batch(() => {
        field.batch(() => {
          field.setState((state: IFieldState<FormilyCore.FieldProps>) => {
            if (isValid(unmountRemoveValue)) {
              state.unmountRemoveValue = unmountRemoveValue
            }
            if (isValid(value)) {
              state.value = value
            } else if (isValid(initialValue)) {
              state.value = initialValue
            }

            if (isValid(visible)) {
              state.visible = visible
            }
            if (isValid(display)) {
              state.display = display
            }
            if (isValid(props)) {
              state.props = props
            }
            if (isValid(required)) {
              state.required = required
            }
            if (isValid(rules)) {
              state.rules = rules as any
            }
            if (isValid(editable)) {
              state.selfEditable = editable
            }
            if (isValid(options.editable)) {
              state.formEditable = options.editable
            }
            state.initialized = true
          })
          batchRunTaskQueue(field, nodePath)
        })
      })
      validator.register(nodePath, validate => {
        const {
          value,
          rules,
          errors,
          warnings,
          editable,
          visible,
          unmounted,
          display
        } = field.getState()
        // 不需要校验的情况有: 非编辑态(editable)，已销毁(unmounted), 逻辑上不可见(visible)
        if (
          editable === false ||
          visible === false ||
          unmounted === true ||
          display === false ||
          (field as any).disabledValidate ||
          (rules.length === 0 && errors.length === 0 && warnings.length === 0)
        )
          return validate(value, [])
        clearTimeout((field as any).validateTimer)
        ;(field as any).validateTimer = setTimeout(() => {
          field.setState(state => {
            state.validating = true
          })
        }, 60)
        heart.publish(LifeCycleTypes.ON_FIELD_VALIDATE_START, field)
        return validate(value, rules).then(({ errors, warnings }) => {
          clearTimeout((field as any).validateTimer)
          return new Promise(resolve => {
            field.setState((state: IFieldState<FormilyCore.FieldProps>) => {
              state.validating = false
              state.ruleErrors = errors
              state.ruleWarnings = warnings
            })
            heart.publish(LifeCycleTypes.ON_FIELD_VALIDATE_END, field)
            resolve({
              errors,
              warnings
            })
          })
        })
      })
      return field
    }
    if (graph.exist(nodePath)) {
      field = graph.get(nodePath)
      //field = createField(field) 如果重置会导致#565的问题，目前还没想清楚不重置会有啥问题
      if (isVirtualField(field)) {
        graph.replace(nodePath, field)
      }
    } else {
      field = createField()
    }
    return field
  }

  function registerVirtualField({
    name,
    path,
    display,
    visible,
    computeState,
    props
  }: IVirtualFieldRegistryProps<FormilyCore.VirtualFieldProps>) {
    const nodePath = FormPath.parse(path || name)
    const dataPath = getDataPath(nodePath)
    let field: IVirtualField
    const createField = (field?: IVirtualField) => {
      const alreadyHaveField = !!field
      field =
        field ||
        new VirtualField({
          nodePath,
          dataPath,
          computeState
        })
      field.subscription = {
        notify: onVirtualFieldChange({ field, path: nodePath })
      }
      heart.publish(LifeCycleTypes.ON_FIELD_WILL_INIT, field)
      if (!alreadyHaveField) {
        graph.appendNode(nodePath, field)
      }
      heart.batch(() => {
        //fix #766
        field.batch(() => {
          field.setState(
            (state: IVirtualFieldState<FormilyCore.VirtualFieldProps>) => {
              state.initialized = true
              state.props = props
              if (isValid(visible)) {
                state.visible = visible
              }
              if (isValid(display)) {
                state.display = display
              }
            }
          )
          batchRunTaskQueue(field, nodePath)
        })
      })
      return field
    }
    if (graph.exist(nodePath)) {
      field = graph.get(nodePath)
      //field = createField(field) 如果重置会导致#565的问题，目前还没想清楚不重置会有啥问题
      if (isField(field)) {
        graph.replace(nodePath, field)
      }
    } else {
      field = createField()
    }
    return field
  }

  function getFieldState(
    path: FormPathPattern,
    callback?: (state: IFieldState<FormilyCore.FieldProps>) => any
  ) {
    const field = graph.select(path)
    return field && field.getState(callback)
  }

  function setFieldState(
    path: FormPathPattern,
    callback?: (state: IFieldState<FormilyCore.FieldProps>) => void,
    silent?: boolean
  ) {
    if (!isFn(callback)) return
    let matchCount = 0
    const pattern = FormPath.getPath(path)
    graph.select(pattern, field => {
      if (!isFormState(field)) {
        field.setState(callback, silent)
      }
      matchCount++
    })
    if (matchCount === 0 || pattern.isWildMatchPattern) {
      pushTaskQueue(pattern, callback)
    }
  }

  function getFieldValue(path?: FormPathPattern) {
    return getFieldState(path, state => {
      return state.value
    })
  }

  function setFieldValue(path: FormPathPattern, value?: any, silent?: boolean) {
    setFieldState(
      path,
      state => {
        state.value = value
      },
      silent
    )
  }

  function getFieldInitialValue(path?: FormPathPattern) {
    return getFieldState(path, state => {
      return state.initialValue
    })
  }

  function setFieldInitialValue(
    path?: FormPathPattern,
    value?: any,
    silent?: boolean
  ) {
    setFieldState(
      path,
      state => {
        state.initialValue = value
      },
      silent
    )
  }

  function getFormState(callback?: (state: IFormState) => any) {
    return form.getState(callback)
  }

  function setFormState(
    callback?: (state: IFormState) => any,
    silent?: boolean
  ) {
    form.setState(callback, silent)
  }

  function getFormGraph() {
    return graph.map(node => {
      return node.getState()
    })
  }

  function setFormGraph(nodes: { [key: string]: any }) {
    each(
      nodes,
      (
        node:
          | IFieldState<FormilyCore.FieldProps>
          | IVirtualFieldState<FormilyCore.VirtualFieldProps>,
        key
      ) => {
        let nodeState: any
        if (graph.exist(key)) {
          nodeState = graph.get(key)
          nodeState.setSourceState(state => {
            Object.assign(state, node)
          })
        } else {
          if (node.displayName === 'VirtualFieldState') {
            nodeState = registerVirtualField({
              path: key
            })
            nodeState.setSourceState(state => {
              Object.assign(state, node)
            })
          } else if (node.displayName === 'FieldState') {
            nodeState = registerField({
              path: key
            })
            nodeState.setSourceState(state => {
              Object.assign(state, node)
            })
          }
        }
        if (nodeState) {
          nodeState.notify(form.getState())
        }
      }
    )
  }

  function subscribe(callback?: FormHeartSubscriber) {
    return heart.subscribe(callback)
  }

  function unsubscribe(id: number) {
    heart.unsubscribe(id)
  }

  function notify(type: string, payload: any) {
    heart.publish(type, payload)
  }

  async function submit(
    onSubmit?: (values: IFormState['values']) => any | Promise<any>
  ): Promise<IFormSubmitResult> {
    // 重复提交，返回前一次的promise
    if (form.getState(state => state.submitting)) return env.submittingTask
    heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_START, form)
    onSubmit = onSubmit || options.onSubmit
    form.setState(state => {
      state.submitting = true
    })

    env.submittingTask = async () => {
      // 增加onFormSubmitValidateStart来明确submit引起的校验开始了
      heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_VALIDATE_START, form)
      await validate('', { throwErrors: false, hostRendering: true })
      const validated = form.getState(state => ({
        errors: state.errors,
        warnings: state.warnings
      }))
      const { errors } = validated
      // 校验失败
      if (errors.length) {
        // 由于校验失败导致submit退出
        form.setState(state => {
          state.submitting = false
        })

        // 增加onFormSubmitValidateFailed来明确结束submit的类型
        heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_VALIDATE_FAILED, form)
        heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_END, form)
        if (isFn(options.onValidateFailed) && !form.state.unmounted) {
          options.onValidateFailed(validated)
        }

        throw errors
      }

      // 增加onFormSubmitValidateSucces来明确submit引起的校验最终的结果
      heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_VALIDATE_SUCCESS, form)

      heart.publish(LifeCycleTypes.ON_FORM_SUBMIT, form)

      let payload,
        values = form.getState(state => clone(state.values))
      if (isFn(onSubmit) && !form.state.unmounted) {
        try {
          payload = await Promise.resolve(onSubmit(values))
          heart.publish(LifeCycleTypes.ON_FORM_ON_SUBMIT_SUCCESS, payload)
        } catch (e) {
          heart.publish(LifeCycleTypes.ON_FORM_ON_SUBMIT_FAILED, e)
          new Promise(() => {
            throw e
          })
        }
      }

      form.setState(state => {
        state.submitting = false
      })
      heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_END, form)
      return {
        values,
        validated,
        payload
      }
    }

    return env.submittingTask()
  }

  async function reset(
    props: IFormResetOptions = {}
  ): Promise<void | IFormValidateResult> {
    props = defaults(
      {
        selector: '*',
        forceClear: false,
        validate: true,
        clearInitialValue: false
      },
      props
    )
    hostUpdate(() => {
      graph.eachChildren('', props.selector, (field: IField) => {
        ;(field as any).disabledValidate = true
        field.setState((state: IFieldState<FormilyCore.FieldProps>) => {
          state.modified = false
          state.ruleErrors = []
          state.ruleWarnings = []
          state.effectErrors = []
          state.effectWarnings = []
          if (props.clearInitialValue) {
            state.initialValue = undefined
          }
          // forceClear仅对设置initialValues的情况下有意义
          if (props.forceClear || !isValid(state.initialValue)) {
            if (isArr(state.value)) {
              state.value = []
            } else if (!isObj(state.value)) {
              state.value = undefined
            }
          } else {
            const value = clone(state.initialValue)
            if (isArr(state.value)) {
              if (isArr(value)) {
                state.value = value
              } else {
                state.value = []
              }
            } else if (isPlainObj(state.value)) {
              if (isPlainObj(value)) {
                state.value = value
              } else {
                state.value = {}
              }
            } else {
              state.value = value
            }
          }
        })
        ;(field as any).disabledValidate = false
      })
    })
    if (isFn(options.onReset) && !form.state.unmounted) {
      options.onReset()
    }
    heart.publish(LifeCycleTypes.ON_FORM_RESET, form)
    let validateResult: void | IFormValidateResult
    if (validate) {
      validateResult = await validate(props.selector, { throwErrors: false })
    }

    return validateResult
  }

  async function validate(
    path?: FormPathPattern,
    opts?: IFormExtendedValidateFieldOptions
  ): Promise<IFormValidateResult> {
    const { throwErrors = true, hostRendering } = opts || {}
    if (!form.getState(state => state.validating)) {
      form.setSourceState(state => {
        state.validating = true
      })
      // 渲染优化
      clearTimeout(env.validateTimer)
      env.validateTimer = setTimeout(() => {
        form.notify()
      }, 60)
    }
    heart.publish(LifeCycleTypes.ON_FORM_VALIDATE_START, form)
    if (graph.size > 100 && hostRendering) env.hostRendering = true
    const payload = await validator.validate(path, opts)
    clearTimeout(env.validateTimer)
    form.setState(state => {
      state.validating = false
    })
    heart.publish(LifeCycleTypes.ON_FORM_VALIDATE_END, form)
    if (graph.size > 100 && hostRendering) {
      heart.publish(LifeCycleTypes.ON_FORM_HOST_RENDER, form)
      env.hostRendering = false
    }
    // 增加name透出真实路径，和0.x保持一致
    const result = {
      errors: payload.errors.map(item => ({
        ...item,
        name: getFieldState(item.path).name
      })),
      warnings: payload.warnings.map(item => ({
        ...item,
        name: getFieldState(item.path).name
      }))
    }

    const { errors, warnings } = result

    // 打印warnings日志从submit挪到这里
    if (warnings.length) {
      log.warn(warnings)
    }
    if (errors.length > 0) {
      if (throwErrors) {
        throw result
      } else {
        return result
      }
    } else {
      return result
    }
  }

  function clearErrors(pattern: FormPathPattern = '*') {
    // 1. 指定路径或全部子路径清理
    hostUpdate(() => {
      graph.eachChildren('', pattern, field => {
        if (isField(field)) {
          field.setState(state => {
            state.ruleErrors = []
            state.ruleWarnings = []
            state.effectErrors = []
            state.effectWarnings = []
          })
        }
      })
    })
  }

  function createMutators(input: any) {
    let field: IField
    if (!isField(input)) {
      const selected = graph.select(input)
      if (selected) {
        field = selected
      } else {
        throw new Error(
          'The `createMutators` can only accept FieldState instance or FormPathPattern.'
        )
      }
    } else {
      field = input
    }
    function setValue(...values: any[]) {
      field.setState((state: IFieldState<FormilyCore.FieldProps>) => {
        state.value = values[0]
        state.values = values
      })
      heart.publish(LifeCycleTypes.ON_FIELD_INPUT_CHANGE, field)
      heart.publish(LifeCycleTypes.ON_FORM_INPUT_CHANGE, form)
    }

    function removeValue(key: string | number) {
      const nodePath = field.getSourceState(state => state.path)
      if (isValid(key)) {
        const childNodePath = FormPath.parse(nodePath).concat(key)
        setFieldState(childNodePath, state => {
          state.value = undefined
        })
        deleteFormValuesIn(childNodePath)
      } else {
        field.setState(state => {
          state.value = undefined
        })
        deleteFormValuesIn(nodePath)
      }
      heart.publish(LifeCycleTypes.ON_FIELD_VALUE_CHANGE, field)
      heart.publish(LifeCycleTypes.ON_FIELD_INPUT_CHANGE, field)
      heart.publish(LifeCycleTypes.ON_FORM_INPUT_CHANGE, form)
    }

    function getValue() {
      return field.getState(state => state.value)
    }

    function onGraphChange(callback: () => void) {
      let timer = null
      const id = graph.subscribe(() => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          graph.unsubscribe(id)
          callback()
        })
      })
    }

    //1. 无法自动交换通过移动来新增删除子列表元素的状态
    //2. 暂时不支持通过setFieldState修改值场景的状态交换
    function swapState($from: number, $to: number) {
      const keys: string[] = ['initialValue', 'visibleCacheValue', 'values']
      const arrayName = field.getSourceState(state => state.name)
      const fromFieldsName = `${arrayName}.${$from}.*`
      const toFieldsName = `${arrayName}.${$to}.*`
      const cache = {}
      const calculatePath = (name: string, $from: number, $to: number) => {
        return name.replace(`${arrayName}.${$from}`, `${arrayName}.${$to}`)
      }
      graph.select(fromFieldsName, field => {
        field.setSourceState((state: IFieldState) => {
          const targetState =
            getFieldState(calculatePath(state.name, $from, $to)) || {}
          keys.forEach(key => {
            cache[state.name] = cache[state.name] || {}
            cache[state.name][key] = state[key]
            state[key] = targetState && targetState[key]
          })
        })
      })
      graph.select(toFieldsName, field => {
        field.setSourceState((state: IFieldState) => {
          const cacheState = cache[calculatePath(state.name, $to, $from)] || {}
          keys.forEach(key => {
            state[key] = cacheState[key]
          })
        })
      })
    }

    function swapAfterState(start: number, arrayLength: number, step = 1) {
      for (let i = arrayLength - 1; i >= start + 1; i -= step) {
        swapState(i, i - 1)
      }
    }

    const mutators = {
      change(...values: any[]) {
        setValue(...values)
        return values[0]
      },
      focus() {
        field.setState((state: IFieldState<FormilyCore.FieldProps>) => {
          state.active = true
        })
      },
      blur() {
        field.setState((state: IFieldState<FormilyCore.FieldProps>) => {
          state.active = false
          state.visited = true
        })
      },
      push(value?: any) {
        const arr = toArr(getValue()).slice()
        arr.push(value)
        setValue(arr)
        return arr
      },
      pop() {
        const arr = toArr(getValue()).slice()
        arr.pop()
        setValue(arr)
        return arr
      },
      insert(index: number, value: any) {
        const arr = toArr(getValue()).slice()
        arr.splice(index, 0, value)
        setValue(arr)
        onGraphChange(() => {
          swapAfterState(index, arr.length)
        })
        return arr
      },
      remove(index?: number | string) {
        let val = getValue()
        if (isNum(index) && isArr(val)) {
          val = [].concat(val)
          const lastIndex = val.length - 1
          val.splice(index, 1)
          if (index < lastIndex) {
            swapState(Number(index), Number(index) + 1)
          }
          setValue(val)
        } else {
          removeValue(index)
        }
      },
      exist(index?: number | string) {
        const newPath = field.getSourceState(state =>
          FormPath.parse(state.path)
        )
        const val = getValue()
        return (isValid(index) ? newPath.concat(index) : newPath).existIn(
          val,
          newPath
        )
      },
      unshift(value: any) {
        return mutators.insert(0, value)
      },
      shift() {
        const arr = toArr(getValue()).slice()
        arr.shift()
        swapState(0, 1)
        setValue(arr)
        return arr
      },
      move($from: number, $to: number) {
        const arr = toArr(getValue()).slice()
        const item = arr[$from]
        arr.splice($from, 1)
        arr.splice($to, 0, item)
        swapState($from, $to)
        setValue(arr)
        return arr
      },
      moveUp(index: number) {
        const len = toArr(getValue()).length
        return mutators.move(index, index - 1 < 0 ? len - 1 : index - 1)
      },
      moveDown(index: number) {
        const len = toArr(getValue()).length
        return mutators.move(index, index + 1 > len ? 0 : index + 1)
      },
      validate(opts?: IFormExtendedValidateFieldOptions) {
        return validate(
          field.getSourceState(state => state.path),
          {
            ...opts,
            hostRendering: false
          }
        )
      }
    }
    return mutators
  }

  function hasChanged(target: any, path: FormPathPattern): boolean {
    if (env.publishing[target ? target.path : ''] === false) {
      throw new Error(
        'The watch function must be used synchronously in the subscribe callback.'
      )
    }
    if (isFormState(target)) {
      return form.hasChanged(path)
    } else if (isFieldState(target) || isVirtualFieldState(target)) {
      const node = graph.get(target.path)
      return node && node.hasChanged(path)
    } else {
      throw new Error(
        'Illegal parameter,You must pass the correct state object(FormState/FieldState/VirtualFieldState).'
      )
    }
  }

  const formApi = {
    submit,
    reset,
    hasChanged,
    clearErrors,
    validate,
    setFormState,
    getFormState,
    setFieldState,
    getFieldState,
    registerField,
    registerVirtualField,
    createMutators,
    getFormGraph,
    setFormGraph,
    setFieldValue,
    getFieldValue,
    setFieldInitialValue,
    getFieldInitialValue,
    isHostRendering,
    hostUpdate,
    subscribe,
    unsubscribe,
    notify
  }

  init(formApi)

  return formApi
}

export const registerValidationFormats = FormValidator.registerFormats

export const registerValidationRules = FormValidator.registerRules

export const registerValidationMTEngine = FormValidator.registerMTEngine

export {
  setValidationLanguage,
  setValidationLocale,
  BigData,
  FormPath,
  FormPathPattern
}

export default createForm
