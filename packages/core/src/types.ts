import { FormPath, FormPathPattern, isFn } from '@uform/shared'
import { ValidateArrayRules, ValidateNodeResult } from '@uform/validator'
import {
  FormLifeCycle,
  FormHeartSubscriber,
  LifeCycleTypes
} from './shared/lifecycle'
import { Draft } from 'immer'

export type FormGraphNodeMap<T> = {
  [key in string]: T
}

export interface FormGraphVisitorOptions<T> {
  path: FormPath
  exsist: boolean
  append: (node: T) => void
}

export type FormGraph<T> = (
  node: T,
  options: FormGraphVisitorOptions<T>
) => void

export type FormGrpahJSONParser<T> = (json: {}) => T

export interface FormGraphNodeRef {
  parent?: FormGraphNodeRef
  path: FormPath
  children: FormPath[]
}

export type FormGraphMatcher<T> = (node: T, path: FormPath) => void

export type FormGraphEacher<T> = (node: T, path: FormPath) => void

export type FormLifeCyclePayload<T> = (
  params: {
    type: string
    payload: T
  },
  context: any
) => void

export type StateDirtyMap<P> = {
  [key in keyof P]?: boolean
}

export interface StateModel<P> {
  publishState?: (state: P) => P
  dirtyCheck?: (dirtys: StateDirtyMap<P>) => StateDirtyMap<P> | void
  computeState?: (state: Draft<P>, preState?: P) => Draft<P> | void
}

export interface IStateModelFactory<S, P> {
  new (state: S, props: P): StateModel<S>
  defaultState?: S
  defaultProps?: P
  displayName?: string
}

export interface IFieldState {
  displayName?: string
  name: string
  initialized: boolean
  pristine: boolean
  valid: boolean
  touched: boolean
  invalid: boolean
  visible: boolean
  display: boolean
  editable: boolean
  loading: boolean
  modified: boolean
  active: boolean
  visited: boolean
  validating: boolean
  errors: string[]
  values: any[]
  effectErrors: string[]
  warnings: string[]
  effectWarnings: string[]
  value: any
  initialValue: any
  rules: ValidateArrayRules[]
  required: boolean
  mounted: boolean
  unmounted: boolean
  props: {}
}
export type FieldStateDirtyMap = StateDirtyMap<IFieldState>

export interface IFieldStateProps {
  path?: FormPathPattern
  name?: string
  value?: any
  values?: any[]
  initialValue?: any
  props?: {}
  rules?: ValidateArrayRules[]
  required?: boolean
  editable?: boolean
  onChange?: (fieldState: IField) => void
}

export const isField = (target: any): target is IField =>
  target && target.displayName === 'FieldState'

export const isFieldState = (target: any): target is IFieldState =>
  target && target.displayName === 'FieldState'

export const isVirtualField = (target: any): target is IVirtualField =>
  target && target.displayName === 'VirtualFieldState'

export const isVirtualFieldState = (
  target: any
): target is IVirtualFieldState =>
  target && target.displayName === 'VirtualFieldState'

export const isStateModel = (target: any): target is IModel =>
  target && isFn(target.getState)

export interface IFormState {
  pristine: boolean
  valid: boolean
  invalid: boolean
  loading: boolean
  validating: boolean
  submitting: boolean
  initialized: boolean
  errors: string[]
  warnings: string[]
  values: {}
  initialValues: {}
  mounted: boolean
  unmounted: boolean
  props: {}
}

export type FormStateDirtyMap = StateDirtyMap<IFormState>

export interface IFormStateProps {
  initialValues?: {}
  values?: {}
  lifecycles?: FormLifeCycle[]
}

export interface IFormCreatorOptions extends IFormStateProps {
  useDirty?: boolean
  validateFirst?: boolean
  onSubmit?: (values: IFormState['values']) => void | Promise<any>
  onReset?: () => void
  onValidateFailed?: (validated: IFormValidateResult) => void
}

export interface IVirtualFieldState {
  name: string
  displayName?: string
  initialized: boolean
  visible: boolean
  display: boolean
  mounted: boolean
  unmounted: boolean
  props: {}
}
export type VirtualFieldStateDirtyMap = StateDirtyMap<IFieldState>

export interface IVirtualFieldStateProps {
  path?: FormPathPattern
  name?: string
  props?: {}
  onChange?: (fieldState: IVirtualField) => void
}

export type IFormValidateResult = ValidateNodeResult

export interface IFormSubmitResult {
  validated: IFormValidateResult
  payload: any
}

export interface IFormResetOptions {
  forceClear?: boolean
  validate?: boolean
}

export interface IFormGraph {
  [path: string]: IFormState | IFieldState | IVirtualFieldState
}

export interface IMutators {
  change(...values: any[]): any
  focus(): void
  blur(): void
  push(value: any): any[]
  pop(): any[]
  insert(index: number, value: any): any[]
  remove(index: number | string): any
  unshift(value: any): any[]
  shift(): any[]
  move($from: number, $to: number): any
  validate(): void
}

export type Subscriber<S> = (payload: S) => void

export interface IModel<S = {}, P = {}> {
  state: S
  props: P
  displayName?: string
  dirtyNum: number
  dirtyMap: StateDirtyMap<S>
  subscribers: Subscriber<S>[]
  batching: boolean
  controller: StateModel<S>
  subscribe: (callback?: Subscriber<S>) => void
  unsubscribe: (callback?: Subscriber<S>) => void
  batch: (callback?: () => void) => void
  notify: (payload: S) => void
  getState: (callback?: (state: S) => any) => any
  setState: (callback?: (state: S | Draft<S>) => void, silent?: boolean) => void
  unsafe_getSourceState: (callback?: (state: S) => any) => any
  unsafe_setSourceState: (callback?: (state: S) => void) => void
  hasChanged: (key?: string) => boolean
  getChanged: () => StateDirtyMap<S>
}

export type IField = IModel<IFieldState, IFieldStateProps>

export type IVirtualField = IModel<IVirtualFieldState, IVirtualFieldStateProps>

export type IFormInternal = IModel<IFormState, IFormStateProps>

export interface IForm {
  submit(
    onSubmit: (values: IFormState['values']) => void | Promise<any>
  ): Promise<IFormSubmitResult>
  reset(options?: IFormResetOptions): void
  validate(path?: FormPathPattern, options?: {}): Promise<IFormValidateResult>
  setFormState(callback?: (state: IFormState) => any): void
  getFormState(callback?: (state: IFormState) => any): any
  setFieldState(
    path: FormPathPattern,
    callback?: (state: IFieldState) => void
  ): void
  getFieldState(
    path: FormPathPattern,
    callback?: (state: IFieldState) => any
  ): any
  registerField(props: IFieldStateProps): IField
  registerVirtualField(props: IVirtualFieldStateProps): IVirtualField
  createMutators(path: FormPathPattern): IMutators
  getFormGraph(): IFormGraph
  setFormGraph(graph: IFormGraph): void
  subscribe(callback?: FormHeartSubscriber): void
  unsubscribe(callback?: FormHeartSubscriber): void
  notify: <T>(type: string, payload: T) => void
  setFieldValue(path?: FormPathPattern, value?: any): void
  getFieldValue(path?: FormPathPattern): any
  setFieldInitialValue(path?: FormPathPattern, value?: any): void
  getFieldInitialValue(path?: FormPathPattern): any
}

export { FormHeartSubscriber, LifeCycleTypes }
