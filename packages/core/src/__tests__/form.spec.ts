import { createForm } from '../'
import {
  onFieldValueChange,
  onFormInitialValuesChange,
  onFormValuesChange,
} from '../effects'
import { attach, sleep } from './shared'
import { LifeCycleTypes } from '../types'
import { observable, batch } from '@formily/reactive'

test('create form', () => {
  const form = attach(createForm())
  expect(form).not.toBeUndefined()
})

test('createField/createArrayField/createObjectField/createVoidField', () => {
  const form = attach(createForm())
  const normal = attach(
    form.createField({
      name: 'normal',
      basePath: 'parent',
    })
  )
  const normal2 = attach(
    form.createField({
      name: 'normal',
      basePath: 'parent',
    })
  )
  const array_ = attach(
    form.createArrayField({ name: 'array', basePath: 'parent' })
  )
  const array2_ = attach(
    form.createArrayField({ name: 'array', basePath: 'parent' })
  )
  const object_ = attach(
    form.createObjectField({ name: 'object', basePath: 'parent' })
  )
  const object2_ = attach(
    form.createObjectField({ name: 'object', basePath: 'parent' })
  )
  const void_ = attach(
    form.createVoidField({ name: 'void', basePath: 'parent' })
  )
  const void2_ = attach(
    form.createVoidField({ name: 'void', basePath: 'parent' })
  )
  const children_ = attach(
    form.createField({ name: 'children', basePath: 'parent.void' })
  )
  expect(normal).not.toBeUndefined()
  expect(array_).not.toBeUndefined()
  expect(object_).not.toBeUndefined()
  expect(void_).not.toBeUndefined()
  expect(normal.address.toString()).toEqual('parent.normal')
  expect(normal.path.toString()).toEqual('parent.normal')
  expect(array_.address.toString()).toEqual('parent.array')
  expect(array_.path.toString()).toEqual('parent.array')
  expect(object_.address.toString()).toEqual('parent.object')
  expect(object_.path.toString()).toEqual('parent.object')
  expect(void_.address.toString()).toEqual('parent.void')
  expect(void_.path.toString()).toEqual('parent.void')
  expect(children_.address.toString()).toEqual('parent.void.children')
  expect(children_.path.toString()).toEqual('parent.children')
  expect(form.createField({ name: '' })).toBeUndefined()
  expect(form.createArrayField({ name: '' })).toBeUndefined()
  expect(form.createObjectField({ name: '' })).toBeUndefined()
  expect(form.createVoidField({ name: '' })).toBeUndefined()
  expect(array_ === array2_).toBeTruthy()
  expect(object_ === object2_).toBeTruthy()
  expect(void_ === void2_).toBeTruthy()
  expect(normal === normal2).toBeTruthy()
})

test('setValues/setInitialValues', () => {
  const form = attach(createForm())
  form.setValues({
    aa: 123,
    cc: {
      kk: 321,
    },
  })
  const field = attach(
    form.createField({
      name: 'cc.mm',
      initialValue: 'ooo',
    })
  )
  const field2 = attach(
    form.createField({
      name: 'cc.pp',
      initialValue: 'www',
    })
  )
  expect(form.values.aa).toEqual(123)
  expect(form.values.cc.kk).toEqual(321)
  expect(form.values.cc.mm).toEqual('ooo')
  expect(form.initialValues.cc.mm).toEqual('ooo')
  expect(form.values.cc.pp).toEqual('www')
  expect(form.initialValues.cc.pp).toEqual('www')
  expect(field.value).toEqual('ooo')
  expect(field2.value).toEqual('www')
  form.setInitialValues({
    bb: '123',
    cc: {
      dd: 'xxx',
      pp: 'www2',
    },
  })
  expect(form.values.aa).toEqual(123)
  expect(form.values.bb).toEqual('123')
  expect(form.values.cc.kk).toEqual(321)
  expect(form.values.cc.dd).toEqual('xxx')
  expect(form.initialValues.bb).toEqual('123')
  expect(form.initialValues.cc.kk).toBeUndefined()
  expect(form.initialValues.cc.dd).toEqual('xxx')
  expect(form.values.cc.mm).toEqual('ooo')
  expect(form.initialValues.cc.mm).toEqual('ooo')
  expect(field.value).toEqual('ooo')
  expect(form.values.cc.pp).toEqual('www2')
  expect(form.initialValues.cc.pp).toEqual('www2')
  expect(field2.value).toEqual('www2')
  form.setInitialValues({}, 'overwrite')
  expect(form.initialValues?.cc?.pp).toBeUndefined()
  form.setValues({}, 'overwrite')
  expect(form.values.aa).toBeUndefined()
})

test('setValues with null', () => {
  const form = attach(createForm())
  form.setInitialValues({
    'object-1': {
      'array-1': null,
    },
    'object-2': {
      'array-2': null,
    },
  })
  form.setValues({
    'object-1': {
      'array-1': null,
    },
    'object-2': {
      'array-2': null,
    },
  })
  expect(form.values).toEqual({
    'object-1': {
      'array-1': null,
    },
    'object-2': {
      'array-2': null,
    },
  })
})

test('observable values/initialValues', () => {
  const values: any = observable({
    aa: 123,
    bb: 321,
  })
  const initialValues: any = observable({
    cc: 321,
    dd: 444,
  })
  const form = attach(
    createForm({
      values,
      initialValues,
    })
  )
  batch(() => {
    values.kk = 321
  })
  expect(form.values.kk).toEqual(321)
})

test('deleteValuesIn/deleteInitialValuesIn', () => {
  const form = attach(
    createForm<{
      aa?: number
      bb?: number
    }>({
      values: {
        aa: 123,
      },
      initialValues: {
        bb: 123,
      },
    })
  )
  expect(form.values.aa).toEqual(123)
  expect(form.values.bb).toEqual(123)
  form.deleteValuesIn('aa')
  form.deleteIntialValuesIn('bb')
  expect(form.existValuesIn('aa')).toBeFalsy()
  expect(form.existInitialValuesIn('bb')).toBeFalsy()
})

test('setSubmitting/setValidating', async () => {
  const form = attach(createForm())
  form.setSubmitting(true)
  expect(form.submitting).toBeFalsy()
  await sleep()
  expect(form.submitting).toBeTruthy()
  form.setSubmitting(false)
  expect(form.submitting).toBeFalsy()
  form.setValidating(true)
  expect(form.validating).toBeFalsy()
  await sleep()
  expect(form.validating).toBeTruthy()
  form.setValidating(false)
  expect(form.validating).toBeFalsy()
})

test('setEffects/addEffects/removeEffects', () => {
  const form = attach(createForm())
  const valueChange = jest.fn()
  const valueChange2 = jest.fn()
  form.addEffects('e1', () => {
    onFieldValueChange('aa', valueChange)
  })
  const field = attach(
    form.createField({
      name: 'aa',
    })
  )
  field.setValue('123')
  expect(valueChange).toBeCalledTimes(1)
  form.removeEffects('e1')
  field.setValue('321')
  expect(valueChange).toBeCalledTimes(1)
  form.addEffects('e2', () => {
    onFieldValueChange('aa', valueChange)
  })
  field.setValue('444')
  expect(valueChange).toBeCalledTimes(2)
  form.setEffects(() => {
    onFieldValueChange('aa', valueChange2)
  })
  field.setValue('555')
  expect(valueChange).toBeCalledTimes(3)
  expect(valueChange2).toBeCalledTimes(1)
})

test('query', () => {
  const form = attach(createForm())
  attach(
    form.createObjectField({
      name: 'object',
    })
  )
  attach(
    form.createVoidField({
      name: 'void',
      basePath: 'object',
    })
  )
  attach(
    form.createField({
      name: 'normal',
      basePath: 'object.void',
    })
  )
  attach(
    form.createArrayField({
      name: 'array',
    })
  )
  expect(form.query('object').take()).not.toBeUndefined()
  expect(form.query('object').take()).not.toBeUndefined()
  expect(form.query('object.void').take()).not.toBeUndefined()
  expect(form.query('object.void.normal').take()).not.toBeUndefined()
  expect(form.query('object.normal').take()).not.toBeUndefined()
  expect(form.query('object.*').map((field) => field.path.toString())).toEqual([
    'object.void',
    'object.normal',
  ])
  expect(form.query('*').map((field) => field.path.toString())).toEqual([
    'object',
    'object.void',
    'object.normal',
    'array',
  ])
  expect(form.query('array').take()).not.toBeUndefined()
  expect(form.query('*').take()).not.toBeUndefined()
  expect(form.query('*(oo)').take()).toBeUndefined()
  expect(form.query('*(oo)').map()).toEqual([])
  expect(form.query('object.void').get('value')).toBeUndefined()
  expect(form.query('object.void').get('initialValue')).toBeUndefined()
  expect(form.query('object.void').get('inputValue')).toBeUndefined()
  expect(form.query('array').get('value')).toEqual([])
  expect(form.query('array').get('initialValue')).toBeUndefined()
  expect(form.query('array').get('inputValue')).toBeNull()
  form.setFieldState('array', (state) => {
    state.value = [111]
    state.initialValue = [111]
    state.inputValue = [111]
  })
  expect(form.query('array').get('value')).toEqual([111])
  expect(form.query('array').get('initialValue')).toEqual([111])
  expect(form.query('array').get('inputValue')).toEqual([111])
  expect(form.query('array').getIn('inputValue')).toEqual([111])
  expect(form.query('opo').get('value')).toBeUndefined()
  expect(form.query('opo').getIn('value')).toBeUndefined()
  expect(form.query('opo').get('initialValue')).toBeUndefined()
  expect(form.query('opo').get('inputValue')).toBeUndefined()
})

test('notify/subscribe/unsubscribe', () => {
  const form = attach(createForm())
  const subscribe = jest.fn()
  const id = form.subscribe(subscribe)
  expect(subscribe).toBeCalledTimes(0)
  form.setInitialValues({ aa: 123 })
  expect(subscribe).toBeCalledTimes(2)
  expect(form.values).toEqual({ aa: 123 })
  form.notify(LifeCycleTypes.ON_FORM_SUBMIT)
  expect(subscribe).toBeCalledTimes(3)
  form.unsubscribe(id)
  form.notify(LifeCycleTypes.ON_FORM_SUBMIT)
  expect(subscribe).toBeCalledTimes(3)
})

test('setState/getState/setFormState/getFormState/setFieldState/getFieldState', () => {
  const form = attach(createForm())
  const state = form.getState()
  form.setState((state) => {
    state.pattern = 'disabled'
    state.values = { aa: 123 }
  })
  expect(form.pattern).toEqual('disabled')
  expect(form.disabled).toBeTruthy()
  expect(form.values.aa).toEqual(123)
  form.setState(state)
  expect(form.pattern).toEqual('editable')
  expect(form.disabled).toBeFalsy()
  expect(form.values.aa).toBeUndefined()
  form.setFormState((state) => {
    state.pattern = 'readOnly'
    state.values = { bb: 321 }
  })
  expect(form.pattern).toEqual('readOnly')
  expect(form.disabled).toBeFalsy()
  expect(form.readOnly).toBeTruthy()
  expect(form.values.aa).toBeUndefined()
  expect(form.values.bb).toEqual(321)
  form.setFormState(state)
  expect(form.pattern).toEqual('editable')
  expect(form.disabled).toBeFalsy()
  expect(form.readOnly).toBeFalsy()
  expect(form.values.aa).toBeUndefined()
  expect(form.values.bb).toBeUndefined()
  attach(
    form.createField({
      name: 'aa',
    })
  )
  const fieldState = form.getFieldState('aa')
  form.setFieldState('aa', (state) => {
    state.title = 'AA'
    state.description = 'This is AA'
    state.value = '123'
  })
  expect(form.getFieldState('aa', (state) => state.title)).toEqual('AA')
  expect(form.getFieldState('aa', (state) => state.description)).toEqual(
    'This is AA'
  )
  expect(form.getFieldState('aa', (state) => state.value)).toEqual('123')
  form.setFieldState('aa', fieldState)
  expect(form.getFieldState('aa', (state) => state.title)).toBeUndefined()
  expect(form.getFieldState('aa', (state) => state.description)).toBeUndefined()
  expect(form.getFieldState('aa', (state) => state.value)).toBeUndefined()
  form.setState((state) => {
    state.display = 'none'
  })
  expect(form.getFieldState('aa', (state) => state.visible)).toBeFalsy()
  const update = (value: any) => (state: any) => {
    state.value = value
  }
  const update2 = (state: any) => {
    state.value = 123
  }
  form.setFieldState('kk', update(123))
  form.setFieldState('kk', update(321))
  form.setFieldState('oo', update2)
  form.setFieldState('oo', update2)
  const oo = attach(
    form.createField({
      name: 'oo',
    })
  )
  const kk = attach(
    form.createField({
      name: 'kk',
    })
  )
  expect(oo.value).toEqual(123)
  expect(kk.value).toEqual(321)
})

test('validate/valid/invalid/errors/warnings/successes/clearErrors/clearWarnings/clearSuccesses/queryFeedbacks', async () => {
  const form = attach(createForm())
  const aa = attach(
    form.createField({
      name: 'aa',
      required: true,
      validator(value) {
        if (value == '123') {
          return {
            type: 'success',
            message: 'success',
          }
        } else if (value == '321') {
          return {
            type: 'warning',
            message: 'warning',
          }
        } else if (value == '111') {
          return 'error'
        }
      },
    })
  )
  const bb = attach(
    form.createField({
      name: 'bb',
      required: true,
    })
  )
  attach(
    form.createVoidField({
      name: 'cc',
    })
  )
  try {
    await form.validate()
  } catch {}
  expect(form.invalid).toBeTruthy()
  expect(form.valid).toBeFalsy()
  expect(form.errors).toEqual([
    {
      type: 'error',
      address: 'aa',
      path: 'aa',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['The field value is required'],
    },
    {
      type: 'error',
      address: 'bb',
      path: 'bb',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['The field value is required'],
    },
  ])
  await aa.onInput('123')
  expect(form.errors).toEqual([
    {
      type: 'error',
      address: 'bb',
      path: 'bb',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['The field value is required'],
    },
  ])
  expect(form.successes).toEqual([
    {
      type: 'success',
      address: 'aa',
      path: 'aa',
      code: 'ValidateSuccess',
      triggerType: 'onInput',
      messages: ['success'],
    },
  ])
  await aa.onInput('321')
  expect(form.errors).toEqual([
    {
      type: 'error',
      address: 'bb',
      path: 'bb',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['The field value is required'],
    },
  ])
  expect(form.warnings).toEqual([
    {
      type: 'warning',
      address: 'aa',
      path: 'aa',
      code: 'ValidateWarning',
      triggerType: 'onInput',
      messages: ['warning'],
    },
  ])
  await aa.onInput('111')
  expect(form.errors).toEqual([
    {
      type: 'error',
      address: 'aa',
      path: 'aa',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['error'],
    },
    {
      type: 'error',
      address: 'bb',
      path: 'bb',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['The field value is required'],
    },
  ])
  await aa.onInput('yes')
  await bb.onInput('yes')
  await form.validate()
  expect(form.invalid).toBeFalsy()
  expect(form.valid).toBeTruthy()
  expect(form.errors).toEqual([])
  expect(form.successes).toEqual([])
  expect(form.warnings).toEqual([])
  await aa.onInput('')
  await bb.onInput('')
  try {
    await form.validate()
  } catch {}
  expect(form.errors).toEqual([
    {
      type: 'error',
      address: 'aa',
      path: 'aa',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['The field value is required'],
    },
    {
      type: 'error',
      address: 'bb',
      path: 'bb',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['The field value is required'],
    },
  ])
  form.clearErrors('aa')
  expect(form.errors).toEqual([
    {
      type: 'error',
      address: 'bb',
      path: 'bb',
      code: 'ValidateError',
      triggerType: 'onInput',
      messages: ['The field value is required'],
    },
  ])
  form.clearErrors('*')
  expect(form.errors).toEqual([])
  await aa.onInput('123')
  expect(form.errors).toEqual([])
  expect(form.successes).toEqual([
    {
      type: 'success',
      address: 'aa',
      path: 'aa',
      code: 'ValidateSuccess',
      triggerType: 'onInput',
      messages: ['success'],
    },
  ])
  form.clearSuccesses('aa')
  expect(form.successes).toEqual([])
  await aa.onInput('321')
  expect(form.errors).toEqual([])
  expect(form.successes).toEqual([])
  expect(form.warnings).toEqual([
    {
      type: 'warning',
      address: 'aa',
      path: 'aa',
      code: 'ValidateWarning',
      triggerType: 'onInput',
      messages: ['warning'],
    },
  ])
  form.clearWarnings('*')
  expect(form.errors).toEqual([])
  expect(form.successes).toEqual([])
  expect(form.warnings).toEqual([])
  await aa.onInput('123')
  await bb.onInput('')
  expect(
    form.queryFeedbacks({
      type: 'error',
    }).length
  ).toEqual(1)
  expect(
    form.queryFeedbacks({
      type: 'success',
    }).length
  ).toEqual(1)
  expect(
    form.queryFeedbacks({
      code: 'ValidateError',
    }).length
  ).toEqual(1)
  expect(
    form.queryFeedbacks({
      code: 'ValidateSuccess',
    }).length
  ).toEqual(1)
  expect(
    form.queryFeedbacks({
      code: 'EffectError',
    }).length
  ).toEqual(0)
  expect(
    form.queryFeedbacks({
      code: 'EffectSuccess',
    }).length
  ).toEqual(0)
  expect(
    form.queryFeedbacks({
      path: 'aa',
    }).length
  ).toEqual(1)
  expect(
    form.queryFeedbacks({
      path: 'bb',
    }).length
  ).toEqual(1)
  expect(
    form.queryFeedbacks({
      address: 'aa',
    }).length
  ).toEqual(1)
  expect(
    form.queryFeedbacks({
      address: 'bb',
    }).length
  ).toEqual(1)
  aa.setValue('')
  bb.setValue('')
  form.clearErrors()
  form.clearSuccesses()
  form.clearWarnings()
  try {
    await form.validate('aa')
  } catch {}
  expect(
    form.queryFeedbacks({
      type: 'error',
    }).length
  ).toEqual(1)
  try {
    await form.validate('*')
  } catch {}
  expect(
    form.queryFeedbacks({
      type: 'error',
    }).length
  ).toEqual(2)
})

test('setPattern/pattern/editable/readOnly/disabled/readPretty', () => {
  const form = attach(
    createForm({
      pattern: 'disabled',
    })
  )
  const field = attach(
    form.createField({
      name: 'aa',
    })
  )
  expect(form.pattern).toEqual('disabled')
  expect(form.disabled).toBeTruthy()
  expect(field.pattern).toEqual('disabled')
  expect(field.disabled).toBeTruthy()
  form.setPattern('readOnly')
  expect(form.pattern).toEqual('readOnly')
  expect(form.readOnly).toBeTruthy()
  expect(field.pattern).toEqual('readOnly')
  expect(field.readOnly).toBeTruthy()
  form.setPattern('readPretty')
  expect(form.pattern).toEqual('readPretty')
  expect(form.readPretty).toBeTruthy()
  expect(field.pattern).toEqual('readPretty')
  expect(field.readPretty).toBeTruthy()
  const form2 = attach(
    createForm({
      editable: false,
    })
  )
  expect(form2.pattern).toEqual('readPretty')
  expect(form2.readPretty).toBeTruthy()
  const form3 = attach(
    createForm({
      disabled: true,
    })
  )
  expect(form3.pattern).toEqual('disabled')
  expect(form3.disabled).toBeTruthy()
  const form4 = attach(
    createForm({
      readOnly: true,
    })
  )
  expect(form4.pattern).toEqual('readOnly')
  expect(form4.readOnly).toBeTruthy()
  const form5 = attach(
    createForm({
      readPretty: true,
    })
  )
  expect(form5.pattern).toEqual('readPretty')
  expect(form5.readPretty).toBeTruthy()
})

test('setDisplay/display/visible/hidden', () => {
  const form = attach(
    createForm({
      display: 'hidden',
    })
  )
  const field = attach(
    form.createField({
      name: 'aa',
    })
  )
  expect(form.display).toEqual('hidden')
  expect(form.hidden).toBeTruthy()
  expect(field.display).toEqual('hidden')
  expect(field.hidden).toBeTruthy()
  form.setDisplay('visible')
  expect(form.display).toEqual('visible')
  expect(form.visible).toBeTruthy()
  expect(field.display).toEqual('visible')
  expect(field.visible).toBeTruthy()
  form.setDisplay('none')
  expect(form.display).toEqual('none')
  expect(form.visible).toBeFalsy()
  expect(field.display).toEqual('none')
  expect(field.visible).toBeFalsy()
  const form2 = attach(
    createForm({
      hidden: true,
    })
  )
  expect(form2.display).toEqual('hidden')
  expect(form2.hidden).toBeTruthy()
  expect(form2.visible).toBeFalsy()
  const form3 = attach(
    createForm({
      visible: false,
    })
  )
  expect(form3.display).toEqual('none')
  expect(form3.visible).toBeFalsy()
})

test('submit', async () => {
  const form = attach(createForm())
  const onSubmit = jest.fn()
  const field = attach(
    form.createField({
      name: 'aa',
      required: true,
    })
  )
  let errors1: Error
  try {
    await form.submit(onSubmit)
  } catch (e) {
    errors1 = e
  }
  expect(errors1).not.toBeUndefined()
  expect(onSubmit).toBeCalledTimes(0)
  field.onInput('123')
  await form.submit(onSubmit)
  expect(onSubmit).toBeCalledTimes(1)
  let errors2: Error
  try {
    await form.submit(() => {
      throw new Error('xxx')
    })
  } catch (e) {
    errors2 = e
  }
  expect(errors2).not.toBeUndefined()
  expect(form.valid).toBeTruthy()
})

test('reset', async () => {
  const form = attach(
    createForm<{
      aa?: number
      bb?: number
    }>({
      values: {
        bb: 123,
      },
      initialValues: {
        aa: 123,
      },
    })
  )
  const field = attach(
    form.createField({
      name: 'aa',
      required: true,
    })
  )
  const field2 = attach(
    form.createField({
      name: 'bb',
      required: true,
    })
  )
  attach(
    form.createVoidField({
      name: 'cc',
    })
  )
  expect(field.value).toEqual(123)
  expect(field2.value).toEqual(123)
  expect(form.values.aa).toEqual(123)
  expect(form.values.bb).toEqual(123)
  field.onInput('xxxxx')
  expect(form.values.aa).toEqual('xxxxx')
  try {
    await form.reset()
  } catch {}
  expect(form.valid).toBeTruthy()
  expect(form.values.aa).toEqual(123)
  expect(field.value).toEqual(123)
  expect(form.values.bb).toBeUndefined()
  expect(field2.value).toBeUndefined()
  field.onInput('aaa')
  field2.onInput('bbb')
  expect(form.valid).toBeTruthy()
  expect(form.values.aa).toEqual('aaa')
  expect(field.value).toEqual('aaa')
  expect(form.values.bb).toEqual('bbb')
  expect(field2.value).toEqual('bbb')
  try {
    await form.reset('*', {
      validate: true,
    })
  } catch {}
  expect(form.valid).toBeFalsy()
  expect(form.values.aa).toEqual(123)
  expect(field.value).toEqual(123)
  expect(form.values.bb).toBeUndefined()
  expect(field2.value).toBeUndefined()
  field.onInput('aaa')
  field2.onInput('bbb')
  try {
    await form.reset('*', {
      forceClear: true,
    })
  } catch {}
  expect(form.valid).toBeTruthy()
  expect(form.values.aa).toBeUndefined()
  expect(field.value).toBeUndefined()
  expect(form.values.bb).toBeUndefined()
  expect(field2.value).toBeUndefined()
  field.onInput('aaa')
  field2.onInput('bbb')
  try {
    await form.reset('aa', {
      forceClear: true,
    })
  } catch {}
  expect(form.valid).toBeTruthy()
  expect(form.values.aa).toBeUndefined()
  expect(field.value).toBeUndefined()
  expect(form.values.bb).toEqual('bbb')
  expect(field2.value).toEqual('bbb')
})

test('devtools', () => {
  window['__FORMILY_DEV_TOOLS_HOOK__'] = {
    inject() {},
    unmount() {},
  }
  const form = attach(createForm())
  form.onUnmount()
})

test('reset array field', async () => {
  const form = attach(
    createForm({
      values: {
        array: [{ value: 123 }],
      },
    })
  )
  attach(
    form.createArrayField({
      name: 'array',
      required: true,
    })
  )
  expect(form.values).toEqual({
    array: [{ value: 123 }],
  })
  await form.reset('*', {
    forceClear: true,
  })
  expect(form.values).toEqual({
    array: [],
  })
})

test('reset object field', async () => {
  const form = attach(
    createForm({
      values: {
        object: { value: 123 },
      },
    })
  )
  attach(
    form.createObjectField({
      name: 'object',
      required: true,
    })
  )
  expect(form.values).toEqual({
    object: { value: 123 },
  })
  await form.reset('*', {
    forceClear: true,
  })
  expect(form.values).toEqual({
    object: {},
  })
})

test('initialValues merge values before create field', () => {
  const form = attach(createForm())
  const array = attach(
    form.createArrayField({
      name: 'array',
    })
  )

  form.values.array = [{ aa: '321' }]
  const arr_0_aa = attach(
    form.createField({
      name: 'aa',
      basePath: 'array.0',
      initialValue: '123',
    })
  )
  expect(array.value).toEqual([{ aa: '321' }])
  expect(arr_0_aa.value).toEqual('321')
})

test('initialValues merge values after create field', () => {
  const form = attach(createForm())
  const aa = attach(
    form.createArrayField({
      name: 'aa',
      initialValue: '111',
    })
  )
  const array = attach(
    form.createArrayField({
      name: 'array',
    })
  )
  const arr_0_aa = attach(
    form.createField({
      name: 'aa',
      basePath: 'array.0',
      initialValue: '123',
    })
  )
  form.values.aa = '222'
  form.values.array = [{ aa: '321' }]
  expect(array.value).toEqual([{ aa: '321' }])
  expect(arr_0_aa.value).toEqual('321')
  expect(aa.value).toEqual('222')
})

test('remove property of form values with undefined value', () => {
  const form = attach(createForm())
  const field = attach(
    form.createField({
      name: 'aaa',
      initialValue: 123,
    })
  )
  expect(form.values).toMatchObject({ aaa: 123 })
  field.display = 'none'
  expect(form.values.hasOwnProperty('aaa')).toBeFalsy()
  field.display = 'visible'
  expect(form.values.hasOwnProperty('aaa')).toBeTruthy()
  field.setValue(undefined)
  expect(form.values.hasOwnProperty('aaa')).toBeTruthy()
})

test('empty array initialValues', () => {
  const form = attach(
    createForm({
      initialValues: {
        aa: [0],
        bb: [''],
        cc: [],
        dd: [null],
        ee: [undefined],
      },
    })
  )
  form.createArrayField({
    name: 'aa',
  })
  form.createArrayField({
    name: 'bb',
  })
  form.createArrayField({
    name: 'cc',
  })
  form.createArrayField({
    name: 'dd',
  })
  form.createArrayField({
    name: 'ee',
  })
  expect(form.values.aa).toEqual([0])
  expect(form.values.bb).toEqual([''])
  expect(form.values.cc).toEqual([])
  expect(form.values.dd).toEqual([])
  expect(form.values.ee).toEqual([])
})

test('form lifecycle can be triggered after call form.setXXX', () => {
  let initialValuesTriggerNum = 0
  let valuesTriggerNum = 0

  const form = attach(
    createForm<{
      aa?: number
      bb?: number
    }>({
      initialValues: {
        aa: 1,
      },
      values: {
        bb: 1,
      },
    })
  )

  form.setEffects(() => {
    onFormInitialValuesChange(() => {
      initialValuesTriggerNum++
    })

    onFormValuesChange(() => {
      valuesTriggerNum++
    })
  })

  expect(initialValuesTriggerNum).toEqual(0)
  expect(valuesTriggerNum).toEqual(0)

  form.initialValues.aa = 2
  form.values.bb = 2

  expect(initialValuesTriggerNum).toEqual(1)
  // initialValues 会通过 applyValuesPatch 改变 values，导致 onFormValuesChange 多触发一次
  expect(valuesTriggerNum).toEqual(2)

  form.setInitialValues({ aa: 3 })
  form.setValues({ bb: 3 })

  expect(initialValuesTriggerNum).toEqual(2)
  expect(valuesTriggerNum).toEqual(4)

  // 测试 form.setXXX 之后还能正常触发：https://github.com/alibaba/formily/issues/1675
  form.initialValues.aa = 4
  form.values.bb = 4

  expect(initialValuesTriggerNum).toEqual(3)
  expect(valuesTriggerNum).toEqual(6)
})

test('form values change with array field(default value)', async () => {
  const handler = jest.fn()
  const form = attach(
    createForm({
      effects() {
        onFormValuesChange(handler)
      },
    })
  )
  const array = attach(
    form.createArrayField({
      name: 'array',
      initialValue: [
        {
          hello: 'world',
        },
      ],
    })
  )
  await array.push({})
  expect(handler).toBeCalledTimes(2)
})
